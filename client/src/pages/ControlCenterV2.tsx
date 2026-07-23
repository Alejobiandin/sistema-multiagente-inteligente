/**
 * Centro de Control V2 - Interfaz Moderna, Vistosa y Responsiva
 * Diseño premium con gradientes, animaciones y componentes visuales atractivos
 */

import { useState } from "react";
import { Activity, TrendingUp, AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Area {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  activeAgents: number;
  pendingTasks: number;
  progress: number;
  status: "active" | "idle" | "error";
  recentActivity: string;
}

const areas: Area[] = [
  {
    id: "payroll",
    name: "Liquidación de Sueldos",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    bgGradient: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
    activeAgents: 3,
    pendingTasks: 12,
    progress: 65,
    status: "active",
    recentActivity: "Procesando 45 liquidaciones"
  },
  {
    id: "taxes",
    name: "Impuestos",
    icon: <Activity className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    bgGradient: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
    activeAgents: 2,
    pendingTasks: 8,
    progress: 42,
    status: "active",
    recentActivity: "Calculando retenciones"
  },
  {
    id: "accounting",
    name: "Contabilidad",
    icon: <CheckCircle2 className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    bgGradient: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
    activeAgents: 2,
    pendingTasks: 5,
    progress: 88,
    status: "active",
    recentActivity: "Generando asientos"
  },
  {
    id: "economy",
    name: "Economía",
    icon: <Zap className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    bgGradient: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950",
    activeAgents: 1,
    pendingTasks: 3,
    progress: 56,
    status: "idle",
    recentActivity: "Análisis de presupuesto"
  },
  {
    id: "billing",
    name: "Facturación",
    icon: <Clock className="w-6 h-6" />,
    color: "from-indigo-500 to-blue-500",
    bgGradient: "bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950",
    activeAgents: 1,
    pendingTasks: 6,
    progress: 71,
    status: "active",
    recentActivity: "Emitiendo facturas"
  },
  {
    id: "clients",
    name: "Gestión de Clientes",
    icon: <AlertCircle className="w-6 h-6" />,
    color: "from-teal-500 to-cyan-500",
    bgGradient: "bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950",
    activeAgents: 1,
    pendingTasks: 4,
    progress: 92,
    status: "active",
    recentActivity: "Actualizando datos"
  }
];

export default function ControlCenterV2() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const totalAgents = areas.reduce((sum, a) => sum + a.activeAgents, 0);
  const totalTasks = areas.reduce((sum, a) => sum + a.pendingTasks, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header Premium */}
      <div className="relative overflow-hidden border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent md:text-4xl">
                Centro de Control
              </h1>
              <p className="mt-2 text-slate-400">Gestiona todas tus áreas de trabajo desde un único lugar</p>
            </div>
            
            <div className="flex gap-2">
              <div className="rounded-lg bg-slate-700/50 px-4 py-2 backdrop-blur-sm">
                <p className="text-xs text-slate-400">Agentes Activos</p>
                <p className="text-2xl font-bold text-white">{totalAgents}</p>
              </div>
              <div className="rounded-lg bg-slate-700/50 px-4 py-2 backdrop-blur-sm">
                <p className="text-xs text-slate-400">Tareas Pendientes</p>
                <p className="text-2xl font-bold text-white">{totalTasks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Grid de Áreas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <div
              key={area.id}
              onClick={() => setSelectedArea(area.id)}
              className="group relative cursor-pointer transition-all duration-300 hover:scale-105"
            >
              {/* Card Background Gradient */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${area.color} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20`} />
              
              {/* Card Content */}
              <Card className={`relative border-slate-700/50 ${area.bgGradient} backdrop-blur-sm transition-all duration-300 group-hover:border-slate-600/50`}>
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`rounded-xl bg-gradient-to-br ${area.color} p-3 text-white`}>
                      {area.icon}
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      area.status === "active" 
                        ? "bg-green-500/20 text-green-400" 
                        : area.status === "error"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-slate-500/20 text-slate-400"
                    }`}>
                      {area.status === "active" ? "Activo" : area.status === "error" ? "Error" : "Inactivo"}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-1">{area.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{area.recentActivity}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-lg bg-slate-700/30 p-2">
                      <p className="text-xs text-slate-400">Agentes</p>
                      <p className="text-xl font-bold text-white">{area.activeAgents}</p>
                    </div>
                    <div className="rounded-lg bg-slate-700/30 p-2">
                      <p className="text-xs text-slate-400">Tareas</p>
                      <p className="text-xl font-bold text-white">{area.pendingTasks}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs text-slate-400">Progreso</p>
                      <p className="text-xs font-semibold text-white">{area.progress}%</p>
                    </div>
                    <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${area.color} transition-all duration-500`}
                        style={{ width: `${area.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${area.color} text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all`}
                  >
                    Acceder
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/20 p-3 text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Tareas Rápidas</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
            </div>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/20 p-3 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Completadas</p>
                <p className="text-2xl font-bold text-white">156</p>
              </div>
            </div>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/20 p-3 text-orange-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Alertas</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/20 p-3 text-purple-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">En Proceso</p>
                <p className="text-2xl font-bold text-white">38</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
