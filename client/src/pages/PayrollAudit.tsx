import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, AlertCircle, CheckCircle2, Clock, User } from "lucide-react";

interface AuditEntry {
  id: number;
  timestamp: string;
  action: string;
  actor: string;
  actorRole: string;
  caseId: number;
  clientName: string;
  details: string;
  status: "SUCCESS" | "WARNING" | "ERROR";
  agentInvolved?: string;
  changes?: Record<string, unknown>;
}

export default function PayrollAudit() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    {
      id: 1,
      timestamp: "2024-02-15T14:30:00",
      action: "PAYROLL_UPLOADED",
      actor: "admin@empresa.com",
      actorRole: "ADMIN",
      caseId: 101,
      clientName: "Empresa ABC SA",
      details: "Carga de nómina para período 2024-02",
      status: "SUCCESS",
      changes: { fileName: "nomina_feb_2024.csv", recordCount: 45 },
    },
    {
      id: 2,
      timestamp: "2024-02-15T14:32:15",
      action: "VALIDATION_STARTED",
      actor: "system",
      actorRole: "AGENT",
      caseId: 101,
      clientName: "Empresa ABC SA",
      details: "Agente Validador iniciando validación de datos",
      status: "SUCCESS",
      agentInvolved: "VALIDATOR",
    },
    {
      id: 3,
      timestamp: "2024-02-15T14:33:45",
      action: "VALIDATION_COMPLETED",
      actor: "system",
      actorRole: "AGENT",
      caseId: 101,
      clientName: "Empresa ABC SA",
      details: "Validación completada: 45 registros válidos, 0 errores",
      status: "SUCCESS",
      agentInvolved: "VALIDATOR",
      changes: { validRecords: 45, invalidRecords: 0 },
    },
    {
      id: 4,
      timestamp: "2024-02-15T14:35:00",
      action: "LIQUIDATION_STARTED",
      actor: "system",
      actorRole: "AGENT",
      caseId: 101,
      clientName: "Empresa ABC SA",
      details: "Agente Preliquidador iniciando cálculo de liquidaciones",
      status: "SUCCESS",
      agentInvolved: "PRE_LIQUIDATOR",
    },
    {
      id: 5,
      timestamp: "2024-02-15T14:42:30",
      action: "SOCIAL_CHARGES_CALCULATED",
      actor: "system",
      actorRole: "AGENT",
      caseId: 101,
      clientName: "Empresa ABC SA",
      details: "Cargas sociales calculadas: AFIP 13%, INAMOVILIDAD 0.75%",
      status: "SUCCESS",
      agentInvolved: "SOCIAL_CHARGES",
      changes: { totalCharges: 450000, chargesPercentage: 13.75 },
    },
    {
      id: 6,
      timestamp: "2024-02-15T14:45:00",
      action: "AUDIT_REVIEW_REQUIRED",
      actor: "system",
      actorRole: "AGENT",
      caseId: 101,
      clientName: "Empresa ABC SA",
      details: "Agente Auditor detectó anomalía: 2 empleados con variación > 15%",
      status: "WARNING",
      agentInvolved: "AUDITOR",
    },
    {
      id: 7,
      timestamp: "2024-02-15T15:00:00",
      action: "HUMAN_APPROVAL_REQUIRED",
      actor: "system",
      actorRole: "SYSTEM",
      caseId: 101,
      clientName: "Empresa ABC SA",
      details: "Requiere aprobación humana para anomalías detectadas",
      status: "WARNING",
    },
    {
      id: 8,
      timestamp: "2024-02-15T15:15:00",
      action: "APPROVAL_SUBMITTED",
      actor: "supervisor@empresa.com",
      actorRole: "SUPERVISOR",
      caseId: 101,
      clientName: "Empresa ABC SA",
      details: "Aprobación manual: Las anomalías son normales por cambio de categoría",
      status: "SUCCESS",
      changes: { decision: "APPROVED", reasoning: "Cambio de categoría laboral" },
    },
    {
      id: 9,
      timestamp: "2024-02-15T15:16:00",
      action: "LEARNING_RECORDED",
      actor: "system",
      actorRole: "SYSTEM",
      caseId: 101,
      clientName: "Empresa ABC SA",
      details: "Regla aprendida: Variaciones > 15% son normales en cambios de categoría",
      status: "SUCCESS",
      changes: { category: "LEARNED_RULES", key: "category_change_variance" },
    },
    {
      id: 10,
      timestamp: "2024-02-15T15:20:00",
      action: "LIQUIDATION_COMPLETED",
      actor: "system",
      actorRole: "AGENT",
      caseId: 101,
      clientName: "Empresa ABC SA",
      details: "Liquidación completada exitosamente",
      status: "SUCCESS",
      agentInvolved: "PRE_LIQUIDATOR",
      changes: { totalAmount: 450000, status: "COMPLETED" },
    },
  ]);

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.actor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "WARNING":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "ERROR":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "WARNING":
        return "bg-yellow-100 text-yellow-800";
      case "ERROR":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const successCount = filteredLog.filter((e) => e.status === "SUCCESS").length;
  const warningCount = filteredLog.filter((e) => e.status === "WARNING").length;
  const errorCount = filteredLog.filter((e) => e.status === "ERROR").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Auditoría de Liquidaciones</h1>
          <p className="text-slate-600 mt-2">Trazabilidad completa de todas las acciones y decisiones</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">{filteredLog.length}</div>
                <p className="text-sm text-slate-600 mt-1">Total de Eventos</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{successCount}</div>
                <p className="text-sm text-green-700 mt-1">Exitosos</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
                <p className="text-sm text-yellow-700 mt-1">Advertencias</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{errorCount}</div>
                <p className="text-sm text-red-700 mt-1">Errores</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <Input
                  id="search"
                  placeholder="Acción, cliente, usuario..."
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
                    <SelectItem value="SUCCESS">Exitosos</SelectItem>
                    <SelectItem value="WARNING">Advertencias</SelectItem>
                    <SelectItem value="ERROR">Errores</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-from">Desde</Label>
                <Input id="date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-to">Hasta</Label>
                <Input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Registro de Auditoría
            </CardTitle>
            <CardDescription>Historial detallado de todas las acciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLog.length > 0 ? (
                filteredLog.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getStatusIcon(entry.status)}</div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">{entry.action}</p>
                          <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                          {entry.agentInvolved && <Badge variant="outline">{entry.agentInvolved}</Badge>}
                        </div>

                        <p className="text-sm text-slate-600 mb-2">{entry.details}</p>

                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {entry.actor} ({entry.actorRole})
                          </span>
                          <span>{entry.clientName}</span>
                        </div>

                        {selectedEntry?.id === entry.id && entry.changes && (
                          <Alert className="mt-3 bg-blue-50 border-blue-200">
                            <AlertDescription className="text-sm">
                              <p className="font-semibold mb-1">Cambios:</p>
                              <pre className="text-xs bg-white p-2 rounded border border-blue-100 overflow-auto">
                                {JSON.stringify(entry.changes, null, 2)}
                              </pre>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No hay eventos que coincidan con los filtros</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
