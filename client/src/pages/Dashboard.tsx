import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react";

interface CaseMetrics {
  total: number;
  active: number;
  completed: number;
  errors: number;
}

interface AgentStatus {
  type: string;
  status: "idle" | "running" | "error";
  lastExecution?: Date;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<CaseMetrics>({
    total: 0,
    active: 0,
    completed: 0,
    errors: 0,
  });

  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([
    { type: "Agente Interpretador Normativo", status: "idle" },
    { type: "Agente Preliquidador", status: "idle" },
    { type: "Agente Auditor", status: "idle" },
    { type: "Agente Comunicador", status: "idle" },
  ]);

  // Consultar casos
  const { data: cases } = trpc.payroll.cases.list.useQuery({
    limit: 100,
  });

  // Consultar notificaciones pendientes
  const { data: notifications } = trpc.payroll.notifications.list.useQuery({
    unreadOnly: true,
  });

  // Consultar aprobaciones pendientes
  const { data: pendingApprovals } = trpc.payroll.approvals.getPending.useQuery({});

  useEffect(() => {
    if (cases) {
      const stats: CaseMetrics = {
        total: cases.length,
        active: cases.filter((c: any) => c.status === "ACTIVE").length,
        completed: cases.filter((c: any) => c.status === "COMPLETED").length,
        errors: cases.filter((c: any) => c.status === "ERROR").length,
      };
      setMetrics(stats);
    }
  }, [cases]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "ERROR":
        return "bg-red-100 text-red-800";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStageColor = (stage: string) => {
    const stages: Record<string, string> = {
      COLLECTION: "bg-purple-100 text-purple-800",
      ANALYSIS: "bg-blue-100 text-blue-800",
      PRE_LIQUIDATION: "bg-indigo-100 text-indigo-800",
      AUDIT: "bg-orange-100 text-orange-800",
      APPROVAL: "bg-yellow-100 text-yellow-800",
      EMISSION: "bg-green-100 text-green-800",
      PRESENTATION: "bg-teal-100 text-teal-800",
      CLOSED: "bg-gray-100 text-gray-800",
    };
    return stages[stage] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            SNISSI - Sistema Multiagente de Payroll
          </h1>
          <p className="text-slate-600">
            Gestión inteligente de liquidación de nómina con supervisión humana
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Casos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {metrics.total}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {metrics.active} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {metrics.active}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                En procesamiento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Completados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {metrics.completed}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Finalizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Errores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {metrics.errors}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Requieren atención
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principales */}
        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="agents">Estado de Agentes</TabsTrigger>
            <TabsTrigger value="cases">Casos Recientes</TabsTrigger>
            <TabsTrigger value="approvals">
              Aprobaciones Pendientes
              {pendingApprovals && pendingApprovals.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingApprovals.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Tab: Estado de Agentes */}
          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estado de los Cuatro Agentes IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agentStatuses.map((agent) => (
                  <div
                    key={agent.type}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      {agent.status === "running" && (
                        <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
                      )}
                      {agent.status === "idle" && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {agent.status === "error" && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">
                          {agent.type}
                        </p>
                        <p className="text-sm text-slate-500">
                          {agent.status === "running"
                            ? "Ejecutando..."
                            : agent.status === "idle"
                            ? "Disponible"
                            : "Error"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        agent.status === "idle"
                          ? "default"
                          : agent.status === "running"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {agent.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Casos Recientes */}
          <TabsContent value="cases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Casos Activos y Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                {cases && cases.length > 0 ? (
                  <div className="space-y-3">
                    {cases.slice(0, 10).map((caseItem: any) => (
                      <div
                        key={caseItem.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {caseItem.clientName}
                          </p>
                          <p className="text-sm text-slate-500">
                            Período: {caseItem.payrollPeriod} • {caseItem.employeeCount} empleados
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(caseItem.status)}>
                            {caseItem.status}
                          </Badge>
                          <Badge className={getStageColor(caseItem.currentStage)}>
                            {caseItem.currentStage}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">
                    No hay casos registrados
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Aprobaciones Pendientes */}
          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aprobaciones Pendientes de Supervisión</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingApprovals && pendingApprovals.length > 0 ? (
                  <div className="space-y-3">
                    {pendingApprovals.map((approval: any) => (
                      <div
                        key={approval.id}
                        className="p-4 border rounded-lg bg-yellow-50 hover:bg-yellow-100 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">
                              Caso #{approval.caseId} - Etapa: {approval.stage}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                              Requiere decisión de supervisión
                            </p>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              // Navegar a página de aprobación
                              window.location.href = `/approvals/${approval.id}`;
                            }}
                          >
                            Revisar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">
                    No hay aprobaciones pendientes
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Notificaciones recientes */}
        {notifications && notifications.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Notificaciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.slice(0, 5).map((notif: any) => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    {notif.notificationType === "ANOMALY_DETECTED" && (
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    {notif.notificationType === "APPROVAL_REQUIRED" && (
                      <Clock className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    )}
                    {notif.notificationType === "STAGE_COMPLETED" && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {notif.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
