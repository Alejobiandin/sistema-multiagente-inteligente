/**
 * Módulo de Facturación - Facturas, Recibos, Notas de Crédito
 */

import { useState } from "react";
import { FileText, Plus, Download, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BillingModule() {
  const [activeTab, setActiveTab] = useState("facturas");

  const invoices = [
    { id: "F-001", client: "Cliente A", amount: 15000, status: "paid", date: "2026-07-20" },
    { id: "F-002", client: "Cliente B", amount: 22500, status: "pending", date: "2026-07-21" },
    { id: "F-003", client: "Cliente C", amount: 18000, status: "paid", date: "2026-07-22" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Facturación</h1>
        <p className="text-slate-400">Gestiona facturas, recibos y notas de crédito</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="facturas">Facturas</TabsTrigger>
          <TabsTrigger value="recibos">Recibos</TabsTrigger>
          <TabsTrigger value="notascredito">Notas de Crédito</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>

        {/* Facturas Tab */}
        <TabsContent value="facturas" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Factura
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Descargar Lote
            </Button>
          </div>

          <div className="space-y-3">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="border-slate-700 bg-slate-800/50 backdrop-blur p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-white">{invoice.id} - {invoice.client}</p>
                    <p className="text-sm text-slate-400">{invoice.date}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-bold text-white">${invoice.amount.toLocaleString()}</p>
                    <p className={`text-sm font-semibold ${
                      invoice.status === "paid" ? "text-green-400" : "text-orange-400"
                    }`}>
                      {invoice.status === "paid" ? "Pagada" : "Pendiente"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recibos Tab */}
        <TabsContent value="recibos" className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recibos Emitidos</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="font-semibold text-white">Recibo #{5000 + i}</p>
                    <p className="text-sm text-slate-400">Monto: $5,000</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-slate-600">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
              Nuevo Recibo
            </Button>
          </Card>
        </TabsContent>

        {/* Notas de Crédito Tab */}
        <TabsContent value="notascredito" className="space-y-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
            <h3 className="text-lg font-bold text-white mb-4">Notas de Crédito</h3>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                  <div>
                    <p className="font-semibold text-white">NC-{2000 + i}</p>
                    <p className="text-sm text-slate-400">Monto: $2,500</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-slate-600">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
              Nueva Nota de Crédito
            </Button>
          </Card>
        </TabsContent>

        {/* Reportes Tab */}
        <TabsContent value="reportes" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Reporte de Facturas
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white h-12 justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Reporte de Recibos
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white h-12 justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Reporte de Ingresos
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white h-12 justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Reporte de Cobranzas
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
