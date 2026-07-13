import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { Activity, AlertTriangle, CheckCircle2, Clock, Zap } from "lucide-react";

interface ProcessingTask {
  id: number;
  employeeId: string;
  employeeName: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export default function PayrollMonitoring() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ProcessingTask[]>([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    processingTasks: 0,
    avgTimePerTask: 0,
    tasksPerSecond: 0,
  });

  // Simular datos de monitoreo
  useEffect(() => {
    const mockTasks: ProcessingTask[] = [
      {
        id: 1,
        employeeId: "EMP001",
        employeeName: "Juan García",
        status: "COMPLETED",
        progress: 100,
        startedAt: new Date(Date.now() - 5000).toISOString(),
        completedAt: new Date().toISOString(),
      },
      {
        id: 2,
        employeeId: "EMP002",
        employeeName: "María López",
        status: "PROCESSING",
        progress: 65,
        startedAt: new Date(Date.now() - 3000).toISOString(),
      },
      {
        id: 3,
        employeeId: "EMP003",
        employeeName: "Carlos Martínez",
        status: "PROCESSING",
        progress: 45,
        startedAt: new Date(Date.now() - 2000).toISOString(),
      },
      {
        id: 4,
        employeeId: "EMP004",
        employeeName: "Ana Rodríguez",
        status: "PENDING",
        progress: 0,
        startedAt: new Date().toISOString(),
      },
    ];

    setTasks(mockTasks);

    const completed = mockTasks.filter((t) => t.status === "COMPLETED").length;
    const failed = mockTasks.filter((t) => t.status === "FAILED").length;
    const processing = mockTasks.filter((t) => t.status === "PROCESSING").length;

    setStats({
      totalTasks: mockTasks.length,
      completedTasks: completed,
      failedTasks: failed,
      processingTasks: processing,
      avgTimePerTask: 2.5,
      tasksPerSecond: 0.4,
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "PROCESSING":
        return <Activity className="h-4 w-4 text-blue-600 animate-spin" />;
      case "FAILED":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const overallProgress = Math.round((stats.completedTasks / stats.totalTasks) * 100);
  const estimatedTimeRemaining = ((stats.totalTasks - stats.completedTasks) * stats.avgTimePerTask) / stats.tasksPerSecond;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Monitoreo de Liquidaciones</h1>
          <p className="text-slate-600 mt-2">Seguimiento en tiempo real del procesamiento de nóminas</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">{stats.totalTasks}</div>
                <p className="text-sm text-slate-600 mt-1">Total de Tareas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.completedTasks}</div>
                <p className="text-sm text-green-700 mt-1">Completadas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.processingTasks}</div>
                <p className="text-sm text-blue-700 mt-1">En Proceso</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{stats.failedTasks}</div>
                <p className="text-sm text-red-700 mt-1">Fallidas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso General</CardTitle>
            <CardDescription>Liquidación de nóminas en progreso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{overallProgress}% Completado</span>
                <span className="text-slate-600">{stats.completedTasks} de {stats.totalTasks}</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-slate-600">Tiempo Promedio por Tarea</p>
                <p className="text-lg font-semibold text-slate-900">{stats.avgTimePerTask.toFixed(1)}s</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Velocidad de Procesamiento</p>
                <p className="text-lg font-semibold text-slate-900">{stats.tasksPerSecond.toFixed(2)} tareas/s</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Tiempo Estimado Restante</p>
                <p className="text-lg font-semibold text-slate-900">{estimatedTimeRemaining.toFixed(0)}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Tareas</CardTitle>
            <CardDescription>Estado individual de cada liquidación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <p className="font-medium text-slate-900">{task.employeeName}</p>
                        <p className="text-sm text-slate-500">{task.employeeId}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  </div>

                  <Progress value={task.progress} className="h-2 mb-2" />

                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{task.progress}%</span>
                    <span>
                      {task.completedAt
                        ? new Date(task.completedAt).toLocaleTimeString()
                        : new Date(task.startedAt).toLocaleTimeString()}
                    </span>
                  </div>

                  {task.errorMessage && (
                    <Alert className="mt-2 bg-red-50 border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">{task.errorMessage}</AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Métricas de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Tasa de Éxito</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalTasks > 0 ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Tasa de Fallos</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.totalTasks > 0 ? ((stats.failedTasks / stats.totalTasks) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
