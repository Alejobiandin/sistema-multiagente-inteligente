/**
 * Módulo de Contabilidad - Asientos, Balance, Estados Financieros\n */

import { useState } from "react";
import { BookOpen, BarChart3, FileCheck, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AccountingModule() {
  const [activeTab, setActiveTab] = useState("overview");

  const financialData = {
    assets: 1250000,
    liabilities: 450000,
    equity: 800000,
    revenue: 350000,
    expenses: 125000,
    profit: 225000
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Contabilidad</h1>
        <p className="text-slate-400">Gestiona asientos, balance y estados financieros</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="asientos">Asientos</TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="estados">Estados Financieros</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Activos</p>
                  <p className="text-2xl font-bold text-white">${financialData.assets.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-blue-500/20 p-3 text-blue-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Pasivos</p>
                  <p className="text-2xl font-bold text-white">${financialData.liabilities.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-red-500/20 p-3 text-red-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Patrimonio</p>
                  <p className="text-2xl font-bold text-green-400">${financialData.equity.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-green-500/20 p-3 text-green-400">
                  <FileCheck className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
              <p className="text-sm text-slate-400 mb-2">Ingresos</p>
              <p className="text-2xl font-bold text-white">${financialData.revenue.toLocaleString()}</p>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
              <p className="text-sm text-slate-400 mb-2">Gastos</p>
              <p className="text-2xl font-bold text-white">${financialData.expenses.toLocaleString()}</p>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
              <p className="text-sm text-slate-400 mb-2">Ganancia Neta</p>
              <p className="text-2xl font-bold text-green-400">${financialData.profit.toLocaleString()}</p>
            </Card>
          </div>

          {/* Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12">
              <BookOpen className="w-4 h-4 mr-2" />
              Nuevo Asiento
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white h-12">
              <FileCheck className="w-4 h-4 mr-2" />
              Generar Balance
            </Button>
          </div>
        </TabsContent>

        {/* Asientos Tab */}
        <TabsContent value="asientos" className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-4">Últimos Asientos</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="font-semibold text-white">Asiento #{1000 + i}</p>
                    <p className="text-sm text-slate-400">Fecha: 2026-07-{20 + i}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">$45,000</p>
                    <p className="text-sm text-green-400">Registrado</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
              Ver Todos los Asientos
            </Button>
          </Card>
        </TabsContent>

        {/* Balance Tab */}
        <TabsContent value="balance" className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-4">Balance General</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">ACTIVOS</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-white">
                    <span>Activos Circulantes</span>
                    <span>$450,000</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Activos Fijos</span>
                    <span>$800,000</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Descargar Balance en PDF
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Estados Financieros Tab */}
        <TabsContent value="estados" className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-4">Estados Financieros</h3>
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">
                <FileCheck className="w-4 h-4 mr-2" />
                Estado de Resultados
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start">
                <FileCheck className="w-4 h-4 mr-2" />
                Estado de Flujo de Caja
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white justify-start">
                <FileCheck className="w-4 h-4 mr-2" />
                Estado de Cambios en el Patrimonio
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
