import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, Zap, BarChart3, Settings, MessageSquare, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background overflow-hidden">
        {/* Fondo con gradiente moderno */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl text-center space-y-8 animate-fade-in-up">
            {/* Logo y Título */}
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center gap-2 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                SNISSI
              </h1>
              <p className="text-2xl font-semibold text-foreground">
                Sistema Multiagente Inteligente
              </p>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Automatiza y supervisa el ciclo completo de gestión contable, fiscal y financiera con inteligencia artificial avanzada
              </p>
            </div>

            {/* CTA Principal */}
            <Button
              onClick={() => { startLogin(); }}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Inicia Sesión
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Características rápidas */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground">Agentes IA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground">Automatizado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground">Disponible</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 space-y-4 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-primary">Bienvenido de vuelta</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground">
            Hola, {user?.name || "Usuario"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Accede a tu Centro de Control para gestionar todas tus áreas de trabajo con agentes inteligentes
          </p>
        </div>

        {/* Main CTA */}
        <Link href="/control-center">
          <div className="mb-12 cursor-pointer group">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 to-accent/90 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary/20">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Centro de Control</h2>
                  <p className="text-white/80">Accede al panel principal de gestión integrado</p>
                </div>
                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Quick Access Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Acceso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Centro de Control */}
            <Link href="/control-center">
              <div className="group cursor-pointer">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Centro de Control</h3>
                  <p className="text-sm text-muted-foreground">Gestiona todas tus áreas desde un único lugar</p>
                </div>
              </div>
            </Link>

            {/* Panel de Agentes */}
            <Link href="/agents">
              <div className="group cursor-pointer">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 group-hover:from-accent/30 group-hover:to-secondary/30 transition-all">
                      <Zap className="h-6 w-6 text-accent" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Panel de Agentes</h3>
                  <p className="text-sm text-muted-foreground">Monitorea el estado en tiempo real</p>
                </div>
              </div>
            </Link>

            {/* Diálogo con Agentes */}
            <Link href="/chat">
              <div className="group cursor-pointer">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 group-hover:from-secondary/30 group-hover:to-primary/30 transition-all">
                      <MessageSquare className="h-6 w-6 text-secondary" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Diálogo con Agentes</h3>
                  <p className="text-sm text-muted-foreground">Comunícate directamente con los agentes</p>
                </div>
              </div>
            </Link>

            {/* Asignación de Tareas */}
            <Link href="/tasks">
              <div className="group cursor-pointer">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Asignación de Tareas</h3>
                  <p className="text-sm text-muted-foreground">Designa tareas a agentes</p>
                </div>
              </div>
            </Link>

            {/* Cargar Nóminas */}
            <Link href="/payroll/upload">
              <div className="group cursor-pointer">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 group-hover:from-accent/30 group-hover:to-primary/30 transition-all">
                      <BarChart3 className="h-6 w-6 text-accent" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Cargar Nóminas</h3>
                  <p className="text-sm text-muted-foreground">Sube archivos para procesamiento</p>
                </div>
              </div>
            </Link>

            {/* Configuración */}
            <Link href="/settings">
              <div className="group cursor-pointer">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 group-hover:from-secondary/30 group-hover:to-accent/30 transition-all">
                      <Settings className="h-6 w-6 text-secondary" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Configuración</h3>
                  <p className="text-sm text-muted-foreground">Personaliza tu workspace</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Características Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Agentes IA Especializados</h3>
                  <p className="text-sm text-muted-foreground">5 agentes especializados que aprenden y se adaptan a tus necesidades</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card border border-border p-6 hover:border-accent/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 flex-shrink-0">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Procesamiento Masivo</h3>
                  <p className="text-sm text-muted-foreground">Procesa 100+ operaciones simultáneamente sin intervención humana</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card border border-border p-6 hover:border-secondary/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Trazabilidad Completa</h3>
                  <p className="text-sm text-muted-foreground">Log de auditoría detallado de cada acción y decisión tomada</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Normativa Argentina</h3>
                  <p className="text-sm text-muted-foreground">Integración completa de LCT, convenios y cargas sociales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
