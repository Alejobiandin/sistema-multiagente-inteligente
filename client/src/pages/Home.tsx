import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, BarChart3, Users, Shield, FileText, Brain, BookOpen } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              SNISSI
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Sistema Operativo Cognitivo Multiagente para Estudios Profesionales
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
              Automatiza y supervisa el ciclo completo de liquidación de nómina con inteligencia artificial
              y control humano total sobre decisiones críticas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Brain className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">4 Agentes IA Especializados</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Interpretador Normativo, Preliquidador, Auditor y Comunicador trabajan en coordinación
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <Shield className="w-8 h-8 text-green-400 mb-2" />
                <CardTitle className="text-white">Supervisión Humana Total</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Panel de aprobación con conversión de decisiones en aprendizaje organizacional
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <FileText className="w-8 h-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">ADN Organizacional</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Repositorio de reglas, criterios, políticas y memoria institucional
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-orange-400 mb-2" />
                <CardTitle className="text-white">Trazabilidad Completa</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Log de auditoría detallado de cada acción, agente y decisión tomada
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Bienvenido, {user?.name || 'Usuario'}
          </h1>
          <p className="text-slate-600">
            Sistema Multiagente de Liquidación de Nómina
          </p>
        </div>

        {/* Módulos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => setLocation('/dashboard')}>
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Dashboard Principal</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Vista general del estado de agentes, casos activos y métricas operativas
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => setLocation('/cases')}>
            <CardHeader>
              <FileText className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Gestión de Casos</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Crear, seguir y administrar procesos de liquidación de nómina
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => setLocation('/news')}>
            <CardHeader>
              <Zap className="w-8 h-8 text-orange-600 mb-2" />
              <CardTitle>Bandeja de Novedades</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Ingrese y clasifique novedades laborales con soporte para documentos
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => setLocation('/approvals')}>
            <CardHeader>
              <Shield className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Supervisión Humana</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Apruebe, rechace o corrija resultados de agentes y registre aprendizaje
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => setLocation('/dna')}>
            <CardHeader>
              <FileText className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle>ADN Organizacional</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Gestione reglas, políticas, criterios y memoria institucional
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Características del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span><strong>Agentes IA Multiagente:</strong> Cuatro agentes especializados que operan en coordinación para cada caso</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Control Humano Total:</strong> Panel de supervisión con aprobación, rechazo o modificación de resultados</span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <span><strong>ADN Organizacional:</strong> Repositorio de reglas y políticas que mejora continuamente</span>
              </li>
              <li className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span><strong>Trazabilidad Completa:</strong> Log de auditoría de cada acción y decisión en el sistema</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
