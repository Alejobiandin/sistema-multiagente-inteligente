import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, AlertCircle } from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  area: string;
  priority: "low" | "medium" | "high";
  assignedAgent?: string;
  status: "unassigned" | "assigned" | "processing";
}

const areas = [
  "Liquidación de Sueldos",
  "Impuestos y Retenciones",
  "Auditoría",
  "Contabilidad",
  "Economía y Análisis",
];

const agents = [
  "Agente Preliquidador",
  "Agente Cargas Sociales",
  "Agente Fiscal",
  "Agente Auditor",
  "Agente Contable",
  "Agente Económico",
];

export default function TaskAssignment() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "1",
      title: "Procesar liquidaciones de marzo",
      area: "Liquidación de Sueldos",
      priority: "high",
      assignedAgent: "Agente Preliquidador",
      status: "processing",
    },
    {
      id: "2",
      title: "Calcular retenciones",
      area: "Impuestos y Retenciones",
      priority: "high",
      assignedAgent: "Agente Fiscal",
      status: "assigned",
    },
    {
      id: "3",
      title: "Auditar gastos de febrero",
      area: "Auditoría",
      priority: "medium",
      status: "unassigned",
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    area: "",
    priority: "medium" as const,
    description: "",
  });

  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleAddTask = () => {
    if (!newTask.title || !newTask.area) return;

    const task: TaskItem = {
      id: String(tasks.length + 1),
      title: newTask.title,
      area: newTask.area,
      priority: newTask.priority,
      status: "unassigned",
    };

    setTasks([...tasks, task]);
    setNewTask({ title: "", area: "", priority: "medium", description: "" });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleAssignAgent = (taskId: string, agent: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? { ...t, assignedAgent: agent, status: "assigned" }
          : t
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, area: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    setTasks(
      tasks.map((t) =>
        t.id === draggedTask ? { ...t, area, status: "assigned" } : t
      )
    );
    setDraggedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "assigned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tasksByArea = areas.map((area) => ({
    area,
    tasks: tasks.filter((t) => t.area === area),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Asignación de Tareas</h1>
            <p className="text-slate-400">Designa tareas a agentes o arrastra entre áreas</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarea
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Crear Nueva Tarea</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Asigna una nueva tarea a los agentes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300">Título</label>
                  <Input
                    placeholder="Ej: Procesar liquidaciones"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">Área</label>
                  <Select value={newTask.area} onValueChange={(value) => setNewTask({ ...newTask, area: value })}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Selecciona un área" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {areas.map((area) => (
                        <SelectItem key={area} value={area} className="text-white">
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-300">Prioridad</label>
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="low" className="text-white">
                        Baja
                      </SelectItem>
                      <SelectItem value="medium" className="text-white">
                        Media
                      </SelectItem>
                      <SelectItem value="high" className="text-white">
                        Alta
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-300">Descripción</label>
                  <Textarea
                    placeholder="Detalles de la tarea..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <Button
                  onClick={handleAddTask}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Crear Tarea
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Drag and Drop Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tasksByArea.map(({ area, tasks: areaTasks }) => (
            <Card
              key={area}
              className="bg-slate-800 border-slate-700 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, area)}
            >
              <CardHeader>
                <CardTitle className="text-white">{area}</CardTitle>
                <CardDescription className="text-slate-400">
                  {areaTasks.length} tarea{areaTasks.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {areaTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Arrastra tareas aquí</p>
                  </div>
                ) : (
                  areaTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="p-3 bg-slate-700 rounded-lg cursor-move hover:bg-slate-600 transition-colors space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-white text-sm">{task.title}</p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority === "high"
                                ? "Alta"
                                : task.priority === "medium"
                                  ? "Media"
                                  : "Baja"}
                            </Badge>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status === "processing"
                                ? "Procesando"
                                : task.status === "assigned"
                                  ? "Asignado"
                                  : "Sin asignar"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {task.assignedAgent ? (
                        <div className="bg-slate-600 p-2 rounded text-xs text-slate-300">
                          Asignado a: <span className="font-semibold">{task.assignedAgent}</span>
                        </div>
                      ) : (
                        <div>
                          <label className="text-xs text-slate-400">Asignar agente:</label>
                          <Select
                            value={task.assignedAgent || ""}
                            onValueChange={(agent) => handleAssignAgent(task.id, agent)}
                          >
                            <SelectTrigger className="h-8 bg-slate-600 border-slate-500 text-white text-xs">
                              <SelectValue placeholder="Selecciona agente" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {agents.map((agent) => (
                                <SelectItem key={agent} value={agent} className="text-white text-xs">
                                  {agent}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
