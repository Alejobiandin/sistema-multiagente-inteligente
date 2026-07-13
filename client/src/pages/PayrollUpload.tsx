import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Upload, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

export default function PayrollUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [clientName, setClientName] = useState("");
  const [payrollPeriod, setPayrollPeriod] = useState("");
  const [fileType, setFileType] = useState<"CSV" | "EXCEL" | "JSON">("CSV");
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = trpc.payroll.uploads.upload.useMutation({
    onSuccess: (data: any) => {
      toast.success("Nómina cargada exitosamente");
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
    }
  };

  const handleUpload = async () => {
    if (!file || !clientName || !payrollPeriod) {
      toast.error("Completa todos los campos");
      return;
    }

    setIsUploading(true);
    try {
      // Aquí iría la lógica de upload a S3
      // Por ahora, simulamos el upload
      const fileContent = await file.text();
      uploadMutation.mutate({
        clientName,
        payrollPeriod,
        fileType,
        fileContent,
        fileName: file.name,
      });
    } catch (error) {
      toast.error("Error al procesar el archivo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Carga de Nóminas</h1>
          <p className="text-slate-600 mt-2">Sube archivos de nómina para procesamiento automático</p>
        </div>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Cargar Archivo de Nómina</CardTitle>
            <CardDescription>Soporta CSV, Excel y JSON</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Nombre del Cliente</Label>
                <Input
                  id="client-name"
                  placeholder="Ej: Empresa ABC SA"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payroll-period">Período de Nómina</Label>
                <Input
                  id="payroll-period"
                  placeholder="Ej: 2024-01"
                  value={payrollPeriod}
                  onChange={(e) => setPayrollPeriod(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-type">Formato de Archivo</Label>
              <Select value={fileType} onValueChange={(value) => setFileType(value as "CSV" | "EXCEL" | "JSON")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="EXCEL">Excel (.xlsx)</SelectItem>
                  <SelectItem value="JSON">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition">
              <input
                type="file"
                id="file-input"
                className="hidden"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.json"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-900">
                  {file ? file.name : "Arrastra un archivo aquí o haz clic para seleccionar"}
                </p>
                <p className="text-xs text-slate-500 mt-1">CSV, Excel o JSON</p>
              </label>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || !clientName || !payrollPeriod || isUploading}
              className="w-full"
              size="lg"
            >
              {isUploading ? "Cargando..." : "Cargar Nómina"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Cargas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for recent uploads */}
              <div className="text-center py-8 text-slate-500">
                <p>No hay cargas recientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
