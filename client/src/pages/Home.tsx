import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, Zap, BarChart3, Settings, MessageSquare, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white">SNISSI</h1>
            <p className="text-2xl text-slate-300">
              Sistema Operativo Cognitivo Multiagente para Estudios Profesionales
            </p>
            <p className="text-slate-400 text-lg">
              Automatiza y supervisa el ciclo completo de liquidación de nómina con inteligencia artificial
            </p>
          </div>

          <Button
            onClick={() => { startLogin(); }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 text-lg"
          >
            Inicia Sesión
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Bienvenido, {user?.name || "Usuario"}</h1>
          <p className="text-slate-400 text-lg">
            Accede a tu Centro de Control para gestionar todas tus áreas de trabajo
          </p>
        </div>

        {/* Main CTA */}
        <Link href="/control-center">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Centro de Control</h2>
                  <p className="text-blue-100">Accede al panel principal de gestión</p>
                </div>
                <Zap className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Quick Access */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Acceso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/control-center">
              <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <Brain className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-white">Centro de Control</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    Gestiona todas tus áreas de trabajo desde un único lugar
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/agents">
              <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                      <Zap className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-white">Panel de Agentes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    Monitorea el estado y progreso de todos los agentes en tiempo real
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/chat">
              <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-white">Diálogo con Agentes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    Comunícate directamente con los agentes y gestiona tareas
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tasks">
              <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-white">Asignación de Tareas</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    Designa tareas a agentes o arrastra entre áreas
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/payroll/upload">
              <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-white">Cargar Nóminas</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    Sube archivos para procesamiento automático
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/settings">
              <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 text-white">
                      <Settings className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-white">Personalización</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    Adapta tu workspace según tus preferencias
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Características Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Agentes IA Especializados</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                9 agentes especializados que aprenden y se adaptan a tus necesidades
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Procesamiento Masivo</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Procesa 100+ liquidaciones simultáneamente sin intervención humana
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Trazabilidad Completa</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Log de auditoría detallado de cada acción y decisión tomada
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Normativa Argentina</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Integración completa de LCT, convenios y cargas sociales
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
