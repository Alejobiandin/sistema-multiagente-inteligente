/**
 * Módulo de Economía - Análisis, Reportes Financieros, Presupuestos
 */

import { useState } from "react";
import { TrendingUp, PieChart, BarChart3, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EconomyModule() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Economía</h1>
        <p className="text-slate-400">Análisis financiero, reportes y presupuestos</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analisis">Análisis</TabsTrigger>
          <TabsTrigger value="presupuesto">Presupuesto</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Margen Bruto</p>
                  <p className="text-2xl font-bold text-white">64.3%</p>
                </div>
                <div className="rounded-lg bg-green-500/20 p-3 text-green-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">ROI</p>
                  <p className="text-2xl font-bold text-white">28.1%</p>
                </div>
                <div className="rounded-lg bg-blue-500/20 p-3 text-blue-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Flujo de Caja</p>
                  <p className="text-2xl font-bold text-green-400">+$125,000</p>
                </div>
                <div className="rounded-lg bg-purple-500/20 p-3 text-purple-400">
                  <PieChart className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Proyección</p>
                  <p className="text-2xl font-bold text-white">+15% Q3</p>
                </div>
                <div className="rounded-lg bg-orange-500/20 p-3 text-orange-400">
                  <Target className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generar Análisis
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white h-12">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Tendencias
            </Button>
          </div>
        </TabsContent>

        {/* Análisis Tab */}
        <TabsContent value="analisis" className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-4">Análisis Financiero</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-700/30">
                <p className="font-semibold text-white mb-2">Rentabilidad</p>
                <div className="h-2 rounded-full bg-slate-600 overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-green-500 to-emerald-500" />
                </div>
                <p className="text-sm text-slate-400 mt-2">64.3% - Excelente</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-700/30">
                <p className="font-semibold text-white mb-2">Liquidez</p>
                <div className="h-2 rounded-full bg-slate-600 overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-cyan-500" />
                </div>
                <p className="text-sm text-slate-400 mt-2">1.8 - Bueno</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-700/30">
                <p className="font-semibold text-white mb-2">Endeudamiento</p>
                <div className="h-2 rounded-full bg-slate-600 overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-orange-500 to-red-500" />
                </div>
                <p className="text-sm text-slate-400 mt-2">0.56 - Moderado</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Presupuesto Tab */}
        <TabsContent value="presupuesto" className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-4">Presupuesto 2026</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-700/30">
                <span className="text-white">Ingresos Proyectados</span>
                <span className="font-bold text-green-400">$1,200,000</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-700/30">
                <span className="text-white">Gastos Proyectados</span>
                <span className="font-bold text-red-400">$450,000</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-700/30">
                <span className="text-white">Ganancia Esperada</span>
                <span className="font-bold text-blue-400">$750,000</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
              Ajustar Presupuesto
            </Button>
          </Card>
        </TabsContent>

        {/* Reportes Tab */}
        <TabsContent value="reportes" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              Reporte Mensual
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white h-12 justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              Reporte Trimestral
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white h-12 justify-start">
              <PieChart className="w-4 h-4 mr-2" />
              Reporte Anual
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white h-12 justify-start">
              <Target className="w-4 h-4 mr-2" />
              Análisis Comparativo
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
