import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function HumanApprovals() {
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | 'MODIFIED'>('APPROVED');
  const [reasoning, setReasoning] = useState('');
  const [learnedRule, setLearnedRule] = useState('');

  // Queries
  const { data: pendingApprovals, refetch: refetchApprovals } = trpc.payroll.approvals.getPending.useQuery({});

  // Mutations
  const submitApprovalMutation = trpc.payroll.approvals.submit.useMutation({
    onSuccess: () => {
      refetchApprovals();
      setIsDialogOpen(false);
      setReasoning('');
      setLearnedRule('');
      setSelectedApproval(null);
    },
  });

  const handleOpenApproval = (approval: any) => {
    setSelectedApproval(approval);
    setIsDialogOpen(true);
  };

  const handleSubmitApproval = () => {
    if (!selectedApproval || !reasoning.trim()) return;

    submitApprovalMutation.mutate({
      approvalId: selectedApproval.id,
      decision,
      reasoning,
      learnedRule: learnedRule || undefined,
      learnedRuleCategory: learnedRule ? 'LEARNING' : undefined,
    });
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Panel de Supervisión Humana
          </h1>
          <p className="text-slate-600 mt-1">
            Revise, apruebe o rechace resultados de agentes y registre aprendizaje organizacional
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pendientes
              {pendingApprovals && pendingApprovals.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingApprovals.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="info">Información</TabsTrigger>
          </TabsList>

          {/* Tab: Aprobaciones Pendientes */}
          <TabsContent value="pending" className="space-y-4">
            {pendingApprovals && pendingApprovals.length > 0 ? (
              pendingApprovals.map((approval: any) => (
                <Card key={approval.id} className="hover:shadow-md transition">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            Caso #{approval.caseId}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            Etapa: <Badge className={getStageColor(approval.stage)}>{approval.stage}</Badge>
                          </p>
                        </div>
                        <AlertCircle className="w-6 h-6 text-yellow-500" />
                      </div>

                      {/* Información de la aprobación */}
                      <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                        <div>
                          <p className="text-xs font-medium text-slate-600 uppercase">
                            Tipo de Decisión Requerida
                          </p>
                          <p className="text-sm text-slate-900 mt-1">
                            Revisión de resultado de agente en etapa {approval.stage}
                          </p>
                        </div>

                        {approval.agentExecutionId && (
                          <div>
                            <p className="text-xs font-medium text-slate-600 uppercase">
                              Ejecución de Agente
                            </p>
                            <p className="text-sm text-slate-900 mt-1">
                              ID: {approval.agentExecutionId}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Botón de acción */}
                      <Button
                        onClick={() => handleOpenApproval(approval)}
                        className="w-full"
                      >
                        Revisar y Decidir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-slate-900 font-medium">No hay aprobaciones pendientes</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Todos los casos están siendo procesados correctamente
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Información */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Acerca del Panel de Supervisión Humana</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Propósito del Sistema
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Este panel permite que los supervisores humanos revisen, aprueben o rechacen
                    los resultados generados por los agentes IA. Las decisiones tomadas se convierten
                    automáticamente en aprendizaje organizacional, enriqueciendo el ADN de la empresa.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Tipos de Decisiones
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Aprobada:</strong> El resultado del agente es correcto y se procede con la siguiente etapa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Rechazada:</strong> El resultado no cumple con los estándares y requiere corrección</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Modificada:</strong> El resultado es parcialmente correcto pero requiere ajustes</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Aprendizaje Organizacional
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Cuando rechaza o modifica un resultado, puede registrar una regla aprendida.
                    Esta regla se agregará al ADN organizacional y será utilizada por los agentes
                    en futuras decisiones, mejorando continuamente la calidad del sistema.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog de aprobación */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Revisar Aprobación - Caso #{selectedApproval?.caseId}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Información del caso */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-2">Etapa</p>
                <Badge className={getStageColor(selectedApproval?.stage)}>
                  {selectedApproval?.stage}
                </Badge>
              </div>

              {/* Opciones de decisión */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">
                  Seleccione su decisión
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="decision"
                      value="APPROVED"
                      checked={decision === 'APPROVED'}
                      onChange={(e) => setDecision(e.target.value as any)}
                    />
                    <div>
                      <p className="font-medium text-slate-900">Aprobada</p>
                      <p className="text-xs text-slate-500">El resultado es correcto</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="decision"
                      value="REJECTED"
                      checked={decision === 'REJECTED'}
                      onChange={(e) => setDecision(e.target.value as any)}
                    />
                    <div>
                      <p className="font-medium text-slate-900">Rechazada</p>
                      <p className="text-xs text-slate-500">Requiere corrección</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="decision"
                      value="MODIFIED"
                      checked={decision === 'MODIFIED'}
                      onChange={(e) => setDecision(e.target.value as any)}
                    />
                    <div>
                      <p className="font-medium text-slate-900">Modificada</p>
                      <p className="text-xs text-slate-500">Parcialmente correcta</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Razonamiento */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Razonamiento de la Decisión *
                </label>
                <Textarea
                  placeholder="Explique por qué toma esta decisión..."
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Regla aprendida (opcional) */}
              {(decision === 'REJECTED' || decision === 'MODIFIED') && (
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Regla Aprendida (Opcional)
                  </label>
                  <Textarea
                    placeholder="Describa la regla o criterio que los agentes deben aplicar en el futuro..."
                    value={learnedRule}
                    onChange={(e) => setLearnedRule(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Esta regla se agregará al ADN organizacional
                  </p>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitApproval}
                  disabled={submitApprovalMutation.isPending || !reasoning.trim()}
                  className="flex-1"
                >
                  {submitApprovalMutation.isPending ? 'Enviando...' : 'Enviar Decisión'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
