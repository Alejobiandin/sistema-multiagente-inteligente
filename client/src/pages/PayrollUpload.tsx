import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Upload, AlertCircle, CheckCircle2, Clock, Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function PayrollUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [clientName, setClientName] = useState("");
  const [payrollPeriod, setPayrollPeriod] = useState("");
  const [fileType, setFileType] = useState<"CSV" | "EXCEL" | "JSON">("CSV");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadId, setUploadId] = useState<number | null>(null);

  const uploadMutation = trpc.payroll.uploads.upload.useMutation({
    onSuccess: (data: any) => {
      toast.success(data.message || "Nómina cargada exitosamente");
      setUploadId(data.uploadId);
      setUploadProgress(0);
      setFile(null);
      setClientName("");
      setPayrollPeriod("");
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setUploadId(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !clientName || !payrollPeriod) {
      toast.error("Completa todos los campos");
      return;
    }

    setIsUploading(true);
    try {
      const fileContent = await file.text();
      let employeeData: Array<{ name: string; salary: number }> = [];

      // Parsear según tipo de archivo
      if (fileType === "CSV") {
        const lines = fileContent.split("\n");
        for (let i = 1; i < lines.length; i++) {
          const [name, salary] = lines[i].split(",");
          if (name && salary) {
            employeeData.push({ name: name.trim(), salary: parseFloat(salary) });
          }
        }
      } else if (fileType === "JSON") {
        const data = JSON.parse(fileContent);
        employeeData = data.employees || data;
      }

      uploadMutation.mutate({
        clientName,
        payrollPeriod,
        fileType,
        fileName: file.name,
        employeeData,
      });
    } catch (error) {
      toast.error("Error al procesar el archivo");
    } finally {
      setIsUploading(false);
    }
  };

  // Monitorear progreso de procesamiento
  const statusQuery = trpc.payroll.uploads.getStatus.useQuery(
    { uploadId: uploadId || 0 },
    { enabled: !!uploadId, refetchInterval: 1000 }
  );

  const handleDownloadResults = () => {
    if (uploadId) {
      toast.info("Descarga de resultados - próximamente");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Carga de Nóminas</h1>
          <p className="text-slate-600 mt-2">Sube archivos de nómina para procesamiento automático</p>
        </div>

        {!uploadId ? (
          <Card>
            <CardHeader>
              <CardTitle>Cargar Archivo</CardTitle>
              <CardDescription>Selecciona un archivo CSV, Excel o JSON con datos de empleados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Nombre del Cliente</Label>
                <Input
                  placeholder="Ej: Empresa XYZ"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Período de Nómina</Label>
                <Input
                  type="month"
                  value={payrollPeriod}
                  onChange={(e) => setPayrollPeriod(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Archivo</Label>
                <Select value={fileType} onValueChange={(value: any) => setFileType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSV">CSV</SelectItem>
                    <SelectItem value="EXCEL">Excel</SelectItem>
                    <SelectItem value="JSON">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Archivo</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.json"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-600">
                      {file ? file.name : "Arrastra un archivo o haz clic para seleccionar"}
                    </p>
                  </label>
                </div>
              </div>

              <Button onClick={handleUpload} disabled={isUploading || !file} className="w-full">
                {isUploading ? "Procesando..." : "Cargar y Procesar"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Procesamiento en Progreso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {statusQuery.data && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso General</span>
                      <span>{statusQuery.data.status?.progressPercentage || 0}%</span>
                    </div>
                    <Progress value={parseInt(statusQuery.data.status?.progressPercentage || "0")} />
                  </div>

                  {statusQuery.data.summary && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded">
                        <p className="text-sm text-slate-600">Total</p>
                        <p className="text-2xl font-bold text-blue-600">{statusQuery.data.summary.total}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded">
                        <p className="text-sm text-slate-600">Completadas</p>
                        <p className="text-2xl font-bold text-green-600">{statusQuery.data.summary.completed}</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded">
                        <p className="text-sm text-slate-600">Procesando</p>
                        <p className="text-2xl font-bold text-yellow-600">{statusQuery.data.summary.processing}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded">
                        <p className="text-sm text-slate-600">Errores</p>
                        <p className="text-2xl font-bold text-red-600">{statusQuery.data.summary.failed}</p>
                      </div>
                    </div>
                  )}

                  {parseInt(statusQuery.data.status?.progressPercentage || "0") === 100 && (
                    <Button onClick={handleDownloadResults} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Resultados
                    </Button>
                  )}

                  <Button
                    onClick={() => setUploadId(null)}
                    variant="outline"
                    className="w-full"
                  >
                    Nueva Carga
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Los archivos CSV deben tener columnas: nombre, salario. Los archivos JSON deben contener un array de objetos con propiedades name y salary.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
