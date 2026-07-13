import { useRoute } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { ArrowRight, CheckCircle2, AlertCircle, Clock, FileText } from 'lucide-react';

export default function CaseDetail() {
  const [match, params] = useRoute('/cases/:id');

  if (!match) return null;

  const caseId = parseInt(params?.id as string);

  // Queries
  const { data: caseData, isLoading: caseLoading } = trpc.payroll.cases.getById.useQuery({ caseId });
  const { data: auditLog } = trpc.payroll.audit.getCaseLog.useQuery({ caseId });
  const { data: agentExecutions } = trpc.payroll.agents.getHistory.useQuery({ caseId });
  const { data: approvals } = trpc.payroll.approvals.getPending.useQuery({});

  if (caseLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-slate-900 font-medium">Caso no encontrado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stageOrder = [
    'COLLECTION',
    'ANALYSIS',
    'PRE_LIQUIDATION',
    'AUDIT',
    'APPROVAL',
    'EMISSION',
    'PRESENTATION',
    'CLOSED',
  ];

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      COLLECTION: 'bg-purple-100 text-purple-800',
      ANALYSIS: 'bg-blue-100 text-blue-800',
      PRE_LIQUIDATION: 'bg-indigo-100 text-indigo-800',
      AUDIT: 'bg-orange-100 text-orange-800',
      APPROVAL: 'bg-yellow-100 text-yellow-800',
      EMISSION: 'bg-green-100 text-green-800',
      PRESENTATION: 'bg-teal-100 text-teal-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getAgentColor = (agentType: string) => {
    const colors: Record<string, string> = {
      NORMATIVE_INTERPRETER: 'bg-blue-100 text-blue-800',
      PRE_LIQUIDATOR: 'bg-green-100 text-green-800',
      AUDITOR: 'bg-orange-100 text-orange-800',
      COMMUNICATOR: 'bg-purple-100 text-purple-800',
    };
    return colors[agentType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Caso #{caseData.id} - {caseData.clientName}
          </h1>
          <p className="text-slate-600 mt-2">
            Período: {caseData.payrollPeriod} • {caseData.employeeCount} empleados
          </p>
        </div>

        {/* Estado del caso */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase mb-2">Estado Actual</p>
                <Badge className="bg-blue-100 text-blue-800 text-base px-3 py-1">
                  {caseData.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 uppercase mb-2">Etapa</p>
                <Badge className={getStageColor(caseData.currentStage) + ' text-base px-3 py-1'}>
                  {caseData.currentStage}
                </Badge>
              </div>
            </div>

            {/* Timeline de etapas */}
            <div className="mt-8">
              <p className="text-sm font-medium text-slate-700 mb-4">Progreso del Flujo</p>
              <div className="flex items-center gap-2 overflow-x-auto pb-4">
                {stageOrder.map((stage, index) => (
                  <div key={stage} className="flex items-center gap-2">
                    <div
                      className={`px-3 py-2 rounded text-xs font-medium whitespace-nowrap transition ${
                        stage === caseData.currentStage
                          ? getStageColor(stage)
                          : stageOrder.indexOf(stage) < stageOrder.indexOf(caseData.currentStage)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {stage}
                    </div>
                    {index < stageOrder.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="agents">
              Ejecuciones de Agentes
              {agentExecutions && agentExecutions.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {agentExecutions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="audit">Auditoría</TabsTrigger>
            <TabsTrigger value="info">Información</TabsTrigger>
          </TabsList>

          {/* Tab: Ejecuciones de Agentes */}
          <TabsContent value="agents" className="space-y-4">
            {agentExecutions && agentExecutions.length > 0 ? (
              agentExecutions.map((execution: any) => (
                <Card key={execution.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className={getAgentColor(execution.agentType)}>
                            {execution.agentType}
                          </Badge>
                          <p className="text-sm text-slate-500 mt-2">
                            {new Date(execution.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            execution.status === 'SUCCESS'
                              ? 'default'
                              : execution.status === 'PENDING'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {execution.status}
                        </Badge>
                      </div>

                      {execution.input && (
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-slate-600 uppercase mb-2">Entrada</p>
                          <p className="text-sm text-slate-700 break-words">
                            {typeof execution.input === 'string'
                              ? execution.input
                              : JSON.stringify(execution.input, null, 2)}
                          </p>
                        </div>
                      )}

                      {execution.output && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-xs font-medium text-blue-900 uppercase mb-2">Salida</p>
                          <p className="text-sm text-blue-800 break-words">
                            {typeof execution.output === 'string'
                              ? execution.output
                              : JSON.stringify(execution.output, null, 2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-slate-500">No hay ejecuciones de agentes registradas</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Auditoría */}
          <TabsContent value="audit" className="space-y-4">
            {auditLog && auditLog.length > 0 ? (
              auditLog.map((log: any) => (
                <Card key={log.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {log.action === 'STAGE_TRANSITION' && (
                          <ArrowRight className="w-5 h-5 text-blue-600" />
                        )}
                        {log.action === 'APPROVAL' && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        {log.action === 'REJECTION' && (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        {log.action === 'AGENT_EXECUTION' && (
                          <Clock className="w-5 h-5 text-orange-600" />
                        )}
                        {!['STAGE_TRANSITION', 'APPROVAL', 'REJECTION', 'AGENT_EXECUTION'].includes(
                          log.action
                        ) && <FileText className="w-5 h-5 text-slate-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{log.action}</p>
                        <p className="text-sm text-slate-600 mt-1">{log.details}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-slate-500">No hay eventos de auditoría registrados</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Información */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información del Caso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">ID del Caso</p>
                    <p className="text-slate-900 mt-1">{caseData.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Cliente</p>
                    <p className="text-slate-900 mt-1">{caseData.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Período de Nómina</p>
                    <p className="text-slate-900 mt-1">{caseData.payrollPeriod}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Cantidad de Empleados</p>
                    <p className="text-slate-900 mt-1">{caseData.employeeCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Creado</p>
                    <p className="text-slate-900 mt-1">
                      {new Date(caseData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Actualizado</p>
                    <p className="text-slate-900 mt-1">
                      {new Date(caseData.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
