import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Brain, Zap, Clock, CheckCircle2, ChevronRight } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  area: string;
  currentTask: string;
  progress: number;
  status: "active" | "idle" | "error";
  startTime: string;
  estimatedTime: string;
  successRate: number;
  tasksCompleted: number;
}

const agents: Agent[] = [
  {
    id: "agent-1",
    name: "Agente Preliquidador",
    area: "Liquidación de Sueldos",
    currentTask: "Procesando liquidación empleado #1234",
    progress: 65,
    status: "active",
    startTime: "14:32",
    estimatedTime: "2 min",
    successRate: 98.5,
    tasksCompleted: 156,
  },
  {
    id: "agent-2",
    name: "Agente Cargas Sociales",
    area: "Liquidación de Sueldos",
    currentTask: "Calculando aportes patronales",
    progress: 45,
    status: "active",
    startTime: "14:35",
    estimatedTime: "1 min",
    successRate: 99.2,
    tasksCompleted: 234,
  },
  {
    id: "agent-3",
    name: "Agente Fiscal",
    area: "Impuestos y Retenciones",
    currentTask: "Procesando retenciones de marzo",
    progress: 88,
    status: "active",
    startTime: "14:20",
    estimatedTime: "30 seg",
    successRate: 97.8,
    tasksCompleted: 89,
  },
  {
    id: "agent-4",
    name: "Agente Auditor",
    area: "Auditoría",
    currentTask: "Esperando nuevas tareas",
    progress: 0,
    status: "idle",
    startTime: "-",
    estimatedTime: "-",
    successRate: 99.5,
    tasksCompleted: 342,
  },
  {
    id: "agent-5",
    name: "Agente Contable",
    area: "Contabilidad",
    currentTask: "Registrando asientos contables",
    progress: 72,
    status: "active",
    startTime: "14:33",
    estimatedTime: "1 min 30 seg",
    successRate: 98.1,
    tasksCompleted: 167,
  },
  {
    id: "agent-6",
    name: "Agente Económico",
    area: "Economía y Análisis",
    currentTask: "Analizando tendencias de gastos",
    progress: 92,
    status: "active",
    startTime: "14:15",
    estimatedTime: "15 seg",
    successRate: 96.7,
    tasksCompleted: 45,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "error":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <Zap className="h-4 w-4 text-green-600" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

export default function AgentsPanel() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(agents[0]);
  const activeAgents = agents.filter((a) => a.status === "active");
  const idleAgents = agents.filter((a) => a.status === "idle");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Panel de Agentes</h1>
          <p className="text-slate-400">Monitorea el estado y progreso de todos los agentes en tiempo real</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Agentes Activos</p>
                  <p className="text-3xl font-bold text-white">{activeAgents.length}</p>
                </div>
                <Zap className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Agentes Disponibles</p>
                  <p className="text-3xl font-bold text-white">{idleAgents.length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Promedio de Éxito</p>
                  <p className="text-3xl font-bold text-white">98.3%</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agents List */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Agentes en Tiempo Real</CardTitle>
                <CardDescription className="text-slate-400">
                  Haz clic en un agente para ver detalles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAgent?.id === agent.id
                        ? "bg-slate-700 border-blue-500"
                        : "bg-slate-700 border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-slate-600">
                          <Brain className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{agent.name}</p>
                          <p className="text-xs text-slate-400">{agent.area}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(agent.status)}
                        <Badge className={getStatusColor(agent.status)}>
                          {agent.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 mb-2">{agent.currentTask}</p>

                    {agent.status === "active" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Progreso</span>
                          <span>{agent.progress}%</span>
                        </div>
                        <Progress value={agent.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>Inicio: {agent.startTime}</span>
                      <span>Est: {agent.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Agent Details */}
          {selectedAgent && (
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-white">Detalles del Agente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Agent Info */}
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">Nombre</p>
                    <p className="text-white font-semibold">{selectedAgent.name}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">Área</p>
                    <Badge variant="outline" className="bg-slate-700 border-slate-600 text-slate-300">
                      {selectedAgent.area}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">Estado</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedAgent.status)}
                      <Badge className={getStatusColor(selectedAgent.status)}>
                        {selectedAgent.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>

                  {selectedAgent.status === "active" && (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-400">Tarea Actual</p>
                        <p className="text-white text-sm">{selectedAgent.currentTask}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progreso</span>
                          <span className="text-white font-semibold">{selectedAgent.progress}%</span>
                        </div>
                        <Progress value={selectedAgent.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-700 p-3 rounded">
                          <p className="text-xs text-slate-400">Inicio</p>
                          <p className="text-white font-semibold">{selectedAgent.startTime}</p>
                        </div>
                        <div className="bg-slate-700 p-3 rounded">
                          <p className="text-xs text-slate-400">Est. Tiempo</p>
                          <p className="text-white font-semibold">{selectedAgent.estimatedTime}</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">Tasa de Éxito</p>
                    <div className="flex items-center justify-between">
                      <Progress value={selectedAgent.successRate} className="h-2 flex-1" />
                      <span className="text-white font-semibold ml-2">{selectedAgent.successRate}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">Tareas Completadas</p>
                    <p className="text-2xl font-bold text-white">{selectedAgent.tasksCompleted}</p>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    Ver Historial Completo
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
