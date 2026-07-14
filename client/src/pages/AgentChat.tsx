import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Brain, Clock, CheckCircle2 } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "agent";
  content: string;
  timestamp: string;
  agentName?: string;
}

interface Task {
  id: string;
  title: string;
  area: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  agentResponse?: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "agent",
    content: "Hola, soy el Agente Preliquidador. ¿Necesitas procesar liquidaciones?",
    timestamp: "14:30",
    agentName: "Agente Preliquidador",
  },
  {
    id: "2",
    sender: "user",
    content: "Sí, necesito procesar las liquidaciones de marzo para 50 empleados",
    timestamp: "14:31",
  },
  {
    id: "3",
    sender: "agent",
    content:
      "Entendido. He detectado que 3 empleados tienen cambios en su categoría. ¿Debo aplicar las nuevas cargas sociales automáticamente o requieres revisión?",
    timestamp: "14:32",
    agentName: "Agente Preliquidador",
  },
  {
    id: "4",
    sender: "user",
    content: "Revísalos primero, quiero ver los detalles antes de procesar",
    timestamp: "14:33",
  },
  {
    id: "5",
    sender: "agent",
    content:
      "Perfecto. He preparado un reporte con los 3 casos. Empleado #1234 cambió de categoría A a B, lo que aumenta sus cargas en 2.5%. Empleado #5678 tiene un nuevo descuento por préstamo. Empleado #9012 requiere revisión de horas extra. ¿Apruebas proceder?",
    timestamp: "14:34",
    agentName: "Agente Preliquidador",
  },
];

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Procesar liquidaciones de marzo",
    area: "Liquidación de Sueldos",
    status: "processing",
    progress: 65,
  },
  {
    id: "2",
    title: "Calcular cargas sociales",
    area: "Impuestos y Retenciones",
    status: "completed",
    progress: 100,
    agentResponse: "Completado: 50 empleados procesados correctamente",
  },
  {
    id: "3",
    title: "Revisar anomalías",
    area: "Auditoría",
    status: "pending",
    progress: 0,
  },
];

export default function AgentChat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Agente Preliquidador");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      sender: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simular respuesta del agente
    setTimeout(() => {
      const agentResponse: Message = {
        id: String(messages.length + 2),
        sender: "agent",
        content: "Entendido. Procesando tu solicitud...",
        timestamp: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        agentName: selectedAgent,
      };
      setMessages((prev) => [...prev, agentResponse]);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Diálogo con Agentes</h1>
          <p className="text-slate-400">Comunícate directamente con los agentes y gestiona tareas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 h-[600px] flex flex-col">
              <CardHeader className="border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-400" />
                      {selectedAgent}
                    </CardTitle>
                    <CardDescription className="text-slate-400">Activo ahora</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">En línea</Badge>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-slate-700 text-slate-100 rounded-bl-none"
                        }`}
                      >
                        {msg.sender === "agent" && (
                          <p className="text-xs text-slate-400 mb-1 font-semibold">{msg.agentName}</p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t border-slate-700 p-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escribe tu instrucción..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-slate-700 border-slate-600">
                    <Paperclip className="h-4 w-4 text-slate-300" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Tasks Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Tareas Asignadas</CardTitle>
                <CardDescription className="text-slate-400">Estado actual de tus tareas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-slate-700 rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{task.title}</p>
                        <p className="text-xs text-slate-400">{task.area}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        <Badge className={getStatusColor(task.status)}>
                          {task.status === "completed"
                            ? "Completado"
                            : task.status === "processing"
                              ? "Procesando"
                              : task.status === "failed"
                                ? "Error"
                                : "Pendiente"}
                        </Badge>
                      </div>
                    </div>

                    {task.status !== "pending" && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Progreso</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {task.agentResponse && (
                      <p className="text-xs text-slate-300 bg-slate-600 p-2 rounded">
                        {task.agentResponse}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
