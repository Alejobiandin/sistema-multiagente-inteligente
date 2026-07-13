import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Filter } from "lucide-react";
import { toast } from "sonner";

interface PayrollRecord {
  id: number;
  clientName: string;
  payrollPeriod: string;
  employeeCount: number;
  status: "COMPLETED" | "FAILED" | "PROCESSING";
  totalAmount: number;
  processedAt: string;
  downloadUrl?: string;
}

export default function PayrollHistory() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [payrollPeriodFilter, setPayrollPeriodFilter] = useState("");
  const [records, setRecords] = useState<PayrollRecord[]>([
    {
      id: 1,
      clientName: "Empresa ABC SA",
      payrollPeriod: "2024-01",
      employeeCount: 45,
      status: "COMPLETED",
      totalAmount: 450000,
      processedAt: "2024-01-31T18:30:00",
      downloadUrl: "/reports/payroll-2024-01.pdf",
    },
    {
      id: 2,
      clientName: "Empresa XYZ SRL",
      payrollPeriod: "2024-01",
      employeeCount: 28,
      status: "COMPLETED",
      totalAmount: 280000,
      processedAt: "2024-01-31T17:45:00",
      downloadUrl: "/reports/payroll-xyz-2024-01.pdf",
    },
    {
      id: 3,
      clientName: "Empresa ABC SA",
      payrollPeriod: "2024-02",
      employeeCount: 45,
      status: "PROCESSING",
      totalAmount: 0,
      processedAt: "2024-02-15T10:00:00",
    },
  ]);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.payrollPeriod.includes(searchTerm);
    const matchesStatus = statusFilter === "ALL" || record.status === statusFilter;
    const matchesPeriod = !payrollPeriodFilter || record.payrollPeriod === payrollPeriodFilter;
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const handleDownload = (record: PayrollRecord) => {
    if (record.downloadUrl) {
      toast.success(`Descargando ${record.clientName} - ${record.payrollPeriod}`);
      // En producción, aquí iría la lógica real de descarga
    } else {
      toast.error("El archivo aún no está disponible");
    }
  };

  const handleView = (record: PayrollRecord) => {
    toast.info(`Ver detalles de ${record.clientName} - ${record.payrollPeriod}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>;
      case "FAILED":
        return <Badge className="bg-red-100 text-red-800">Fallida</Badge>;
      case "PROCESSING":
        return <Badge className="bg-blue-100 text-blue-800">En Proceso</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalAmount = filteredRecords.reduce((sum, record) => sum + record.totalAmount, 0);
  const completedCount = filteredRecords.filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Historial de Liquidaciones</h1>
          <p className="text-slate-600 mt-2">Accede a todas las liquidaciones procesadas</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">{filteredRecords.length}</div>
                <p className="text-sm text-slate-600 mt-1">Total de Liquidaciones</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{completedCount}</div>
                <p className="text-sm text-green-700 mt-1">Completadas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">${(totalAmount / 1000).toFixed(0)}K</div>
                <p className="text-sm text-slate-600 mt-1">Monto Total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <Input
                  id="search"
                  placeholder="Cliente o período..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="COMPLETED">Completadas</SelectItem>
                    <SelectItem value="PROCESSING">En Proceso</SelectItem>
                    <SelectItem value="FAILED">Fallidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Input
                  id="period"
                  placeholder="YYYY-MM"
                  value={payrollPeriodFilter}
                  onChange={(e) => setPayrollPeriodFilter(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liquidaciones</CardTitle>
            <CardDescription>Historial completo de procesamiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-right">Empleados</TableHead>
                    <TableHead className="text-right">Monto Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.clientName}</TableCell>
                        <TableCell>{record.payrollPeriod}</TableCell>
                        <TableCell className="text-right">{record.employeeCount}</TableCell>
                        <TableCell className="text-right">${record.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>{new Date(record.processedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(record)}
                            disabled={record.status !== "COMPLETED"}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(record)}
                            disabled={record.status !== "COMPLETED"}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        No hay liquidaciones que coincidan con los filtros
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
