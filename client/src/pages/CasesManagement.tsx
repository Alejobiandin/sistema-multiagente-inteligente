import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Calendar, Users } from "lucide-react";

const createCaseSchema = z.object({
  clientId: z.coerce.number(),
  clientName: z.string().min(1, "Nombre del cliente requerido"),
  payrollPeriod: z.string().min(1, "Período de nómina requerido"),
  employeeCount: z.coerce.number().optional(),
});

type CreateCaseForm = z.infer<typeof createCaseSchema>;

export default function CasesManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Queries
  const { data: cases, refetch: refetchCases } = trpc.payroll.cases.list.useQuery({
    limit: 50,
  });

  // Mutations
  const createCaseMutation = trpc.payroll.cases.create.useMutation({
    onSuccess: () => {
      refetchCases();
      setIsDialogOpen(false);
      form.reset();
    },
  });

  // Form
  const form = useForm<CreateCaseForm>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      clientId: 1,
      clientName: "",
      payrollPeriod: new Date().toISOString().slice(0, 7),
      employeeCount: 0,
    },
  } as any);

  const onSubmit: SubmitHandler<CreateCaseForm> = (data: CreateCaseForm) => {
    createCaseMutation.mutate(data);
  };

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

  const stageOrder = [
    "COLLECTION",
    "ANALYSIS",
    "PRE_LIQUIDATION",
    "AUDIT",
    "APPROVAL",
    "EMISSION",
    "PRESENTATION",
    "CLOSED",
  ];

  const getStageProgress = (stage: string) => {
    return ((stageOrder.indexOf(stage) + 1) / stageOrder.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gestión de Casos de Payroll
            </h1>
            <p className="text-slate-600 mt-1">
              Crear, seguir y administrar procesos de liquidación de nómina
            </p>
          </div>

          {/* Botón crear caso */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Caso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Caso de Payroll</DialogTitle>
              </DialogHeader>

              <Form {...(form as any)}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Empresa XYZ S.A." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="payrollPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Período de Nómina</FormLabel>
                        <FormControl>
                          <Input type="month" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad de Empleados</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createCaseMutation.isPending}
                  >
                    {createCaseMutation.isPending ? "Creando..." : "Crear Caso"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de casos */}
        <div className="space-y-4">
          {cases && cases.length > 0 ? (
            cases.map((caseItem: any) => (
              <Card key={caseItem.id} className="hover:shadow-md transition">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header del caso */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {caseItem.clientName}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Período: {caseItem.payrollPeriod} • {caseItem.employeeCount} empleados
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(caseItem.status)}>
                          {caseItem.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Etapa actual y progreso */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">
                          Etapa actual: {caseItem.currentStage}
                        </span>
                        <span className="text-sm text-slate-500">
                          {Math.round(getStageProgress(caseItem.currentStage))}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${getStageProgress(caseItem.currentStage)}%`,
                          }}
                        />
                      </div>

                      {/* Etapas */}
                      <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-2">
                        {stageOrder.map((stage) => (
                          <div
                            key={stage}
                            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition ${
                              stage === caseItem.currentStage
                                ? getStageColor(stage)
                                : stageOrder.indexOf(stage) <
                                  stageOrder.indexOf(caseItem.currentStage)
                                ? "bg-green-100 text-green-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {stage}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.location.href = `/cases/${caseItem.id}`;
                        }}
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          window.location.href = `/cases/${caseItem.id}/audit`;
                        }}
                      >
                        Auditoría
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-slate-500">No hay casos registrados</p>
                <p className="text-sm text-slate-400 mt-1">
                  Crea un nuevo caso para comenzar
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
