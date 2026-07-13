import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Activity, History, FileText, Zap, Shield, Database, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative px-6 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">SNISSI</h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-8">
            Sistema Operativo Cognitivo Multiagente para Estudios Profesionales
          </p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Automatiza y supervisa el ciclo completo de liquidación de nómina con inteligencia artificial y control humano total
          </p>
        </div>
      </div>

      {/* Main Features */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card
            className="hover:shadow-2xl transition cursor-pointer bg-slate-800 border-slate-700 text-white"
            onClick={() => navigate("/payroll/upload")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Upload className="h-5 w-5 text-blue-400" />
                Cargar Nóminas
              </CardTitle>
              <CardDescription className="text-slate-400">Sube archivos para procesamiento automático</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">Carga masiva en CSV, Excel o JSON con validación automática</p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-2xl transition cursor-pointer bg-slate-800 border-slate-700 text-white"
            onClick={() => navigate("/payroll/monitoring")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-green-400" />
                Monitoreo en Tiempo Real
              </CardTitle>
              <CardDescription className="text-slate-400">Sigue el progreso de liquidaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">Visualiza 100+ liquidaciones simultáneas con métricas de rendimiento</p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-2xl transition cursor-pointer bg-slate-800 border-slate-700 text-white"
            onClick={() => navigate("/payroll/history")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <History className="h-5 w-5 text-purple-400" />
                Historial de Liquidaciones
              </CardTitle>
              <CardDescription className="text-slate-400">Accede a liquidaciones pasadas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">Descarga y revisa liquidaciones procesadas con filtros avanzados</p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-2xl transition cursor-pointer bg-slate-800 border-slate-700 text-white"
            onClick={() => navigate("/payroll/audit")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-orange-400" />
                Auditoría Completa
              </CardTitle>
              <CardDescription className="text-slate-400">Trazabilidad de todas las acciones</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">Log detallado de cada decisión, agente e intervención humana</p>
            </CardContent>
          </Card>
        </div>

        {/* Core Features */}
        <div className="mt-16 pt-12 border-t border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Características Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <Zap className="h-8 w-8 text-yellow-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">9 Agentes IA</h3>
              <p className="text-sm text-slate-400">Especializados en liquidación, impuestos, auditoría y comunicación</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <Shield className="h-8 w-8 text-green-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Supervisión Humana</h3>
              <p className="text-sm text-slate-400">Panel de aprobación con conversión de decisiones en aprendizaje</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <Database className="h-8 w-8 text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">ADN Organizacional</h3>
              <p className="text-sm text-slate-400">Repositorio de reglas, políticas y memoria institucional</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <Users className="h-8 w-8 text-purple-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Cargas Sociales</h3>
              <p className="text-sm text-slate-400">Cálculo automático de aportes, retenciones y fondos</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-white">
            <div className="text-4xl font-bold mb-2">100+</div>
            <p className="text-blue-100">Liquidaciones Simultáneas</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-8 text-white">
            <div className="text-4xl font-bold mb-2">0%</div>
            <p className="text-green-100">Intervención Manual Requerida</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-8 text-white">
            <div className="text-4xl font-bold mb-2">100%</div>
            <p className="text-purple-100">Trazabilidad Completa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
