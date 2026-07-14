import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart3,
  Brain,
  AlertTriangle,
  TrendingUp,
  Users,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  Plus,
} from "lucide-react";

interface Area {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  activeAgents: number;
  totalAgents: number;
  pendingTasks: number;
  completedTasks: number;
  progress: number;
  status: "active" | "idle" | "error";
  lastUpdate: string;
}

const areas: Area[] = [
  {
    id: "payroll",
    name: "Liquidación de Sueldos",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "from-blue-500 to-blue-600",
    activeAgents: 3,
    totalAgents: 4,
    pendingTasks: 12,
    completedTasks: 87,
    progress: 87,
    status: "active",
    lastUpdate: "Hace 2 min",
  },
  {
    id: "taxes",
    name: "Impuestos y Retenciones",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "from-green-500 to-green-600",
    activeAgents: 2,
    totalAgents: 3,
    pendingTasks: 5,
    completedTasks: 42,
    progress: 89,
    status: "active",
    lastUpdate: "Hace 5 min",
  },
  {
    id: "audit",
    name: "Auditoría",
    icon: <CheckCircle2 className="h-6 w-6" />,
    color: "from-purple-500 to-purple-600",
    activeAgents: 1,
    totalAgents: 2,
    pendingTasks: 3,
    completedTasks: 28,
    progress: 90,
    status: "idle",
    lastUpdate: "Hace 15 min",
  },
  {
    id: "accounting",
    name: "Contabilidad",
    icon: <Brain className="h-6 w-6" />,
    color: "from-orange-500 to-orange-600",
    activeAgents: 2,
    totalAgents: 3,
    pendingTasks: 8,
    completedTasks: 56,
    progress: 88,
    status: "active",
    lastUpdate: "Hace 1 min",
  },
  {
    id: "economics",
    name: "Economía y Análisis",
    icon: <Zap className="h-6 w-6" />,
    color: "from-red-500 to-red-600",
    activeAgents: 1,
    totalAgents: 2,
    pendingTasks: 2,
    completedTasks: 19,
    progress: 90,
    status: "idle",
    lastUpdate: "Hace 30 min",
  },
];

const recentAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Anomalía detectada en liquidación",
    description: "Empleado #1234 tiene salario 40% superior al promedio",
    area: "Liquidación de Sueldos",
    time: "Hace 2 min",
  },
  {
    id: 2,
    type: "info",
    title: "Tarea completada",
    description: "Impuestos de marzo procesados correctamente",
    area: "Impuestos y Retenciones",
    time: "Hace 5 min",
  },
  {
    id: 3,
    type: "warning",
    title: "Requiere aprobación",
    description: "Despido de empleado requiere revisión humana",
    area: "Liquidación de Sueldos",
    time: "Hace 8 min",
  },
];

export default function ControlCenter() {
  const { user } = useAuth();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "error":
        return "Error";
      default:
        return "Inactivo";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Centro de Control</h1>
            <p className="text-slate-400">Bienvenido, {user?.name || "Usuario"}. Gestiona todas tus áreas desde aquí.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
              <Settings className="h-4 w-4" />
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Agentes Activos</p>
                  <p className="text-3xl font-bold text-white">9</p>
                </div>
                <Zap className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Tareas Pendientes</p>
                  <p className="text-3xl font-bold text-white">30</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completadas Hoy</p>
                  <p className="text-3xl font-bold text-white">232</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Alertas</p>
                  <p className="text-3xl font-bold text-white">3</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Areas Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Áreas de Trabajo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {areas.map((area) => (
              <Card
                key={area.id}
                className={`bg-slate-800 border-slate-700 cursor-pointer transition-all hover:border-slate-600 hover:shadow-lg ${
                  selectedArea === area.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedArea(area.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${area.color} text-white`}>
                      {area.icon}
                    </div>
                    <Badge className={getStatusColor(area.status)}>
                      {getStatusLabel(area.status)}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-sm mt-3">{area.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progreso</span>
                      <span>{area.progress}%</span>
                    </div>
                    <Progress value={area.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-700 p-2 rounded">
                      <p className="text-slate-400">Agentes</p>
                      <p className="text-white font-bold">{area.activeAgents}/{area.totalAgents}</p>
                    </div>
                    <div className="bg-slate-700 p-2 rounded">
                      <p className="text-slate-400">Pendientes</p>
                      <p className="text-yellow-400 font-bold">{area.pendingTasks}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">{area.lastUpdate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Alertas Recientes</h2>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <Alert
                key={alert.id}
                className={`bg-slate-800 border-l-4 ${
                  alert.type === "warning"
                    ? "border-l-yellow-500 border-slate-700"
                    : "border-l-green-500 border-slate-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  {alert.type === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription className="text-white">
                      <p className="font-semibold">{alert.title}</p>
                      <p className="text-slate-400 text-sm mt-1">{alert.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className="bg-slate-700 border-slate-600 text-slate-300">
                          {alert.area}
                        </Badge>
                        <span className="text-xs text-slate-500">{alert.time}</span>
                      </div>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
