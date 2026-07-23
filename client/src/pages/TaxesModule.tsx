/**
 * Módulo de Impuestos - Gestión de Ganancias, IVA, Retenciones
 */

import { useState } from "react";
import { DollarSign, TrendingDown, FileText, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TaxesModule() {
  const [activeTab, setActiveTab] = useState("overview");

  const taxSummary = [
    { name: "Impuesto a las Ganancias", amount: 125000, status: "pending" },
    { name: "IVA", amount: 85000, status: "pending" },
    { name: "Retenciones AFIP", amount: 45000, status: "completed" },
    { name: "Aportes Patronales", amount: 95000, status: "pending" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Gestión de Impuestos</h1>
        <p className="text-slate-400">Administra impuestos, retenciones y obligaciones fiscales</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="ganancias">Ganancias</TabsTrigger>
          <TabsTrigger value="iva">IVA</TabsTrigger>
          <TabsTrigger value="retenciones">Retenciones</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {taxSummary.map((tax, i) => (
              <Card key={i} className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-2">{tax.name}</p>
                    <p className="text-2xl font-bold text-white">${tax.amount.toLocaleString()}</p>
                  </div>
                  <div className={`rounded-lg p-3 ${
                    tax.status === "completed" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-orange-500/20 text-orange-400"
                  }`}>
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12">
              <FileText className="w-4 h-4 mr-2" />
              Generar Declaración Jurada
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white h-12">
              <TrendingDown className="w-4 h-4 mr-2" />
              Calcular Impuestos
            </Button>
          </div>
        </TabsContent>

        {/* Ganancias Tab */}
        <TabsContent value="ganancias" className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-4">Impuesto a las Ganancias</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-400">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-white">$850,000</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Deducciones</p>
                  <p className="text-2xl font-bold text-white">$125,000</p>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Calcular y Generar Liquidación
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* IVA Tab */}
        <TabsContent value="iva" className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-4">IVA</h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-400">IVA Ventas</p>
                  <p className="text-2xl font-bold text-white">$45,000</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">IVA Compras</p>
                  <p className="text-2xl font-bold text-white">$12,000</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">IVA a Pagar</p>
                  <p className="text-2xl font-bold text-green-400">$33,000</p>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Generar Declaración de IVA
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Retenciones Tab */}
        <TabsContent value="retenciones" className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-4">Retenciones AFIP</h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-orange-500/10 border border-orange-500/30 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-orange-400">Retenciones Pendientes</p>
                    <p className="text-sm text-slate-400 mt-1">Hay 3 retenciones sin procesar</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Procesar Retenciones
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
