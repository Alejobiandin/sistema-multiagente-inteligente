/**
 * Módulo de Facturación - Facturas, Recibos, Notas de Crédito
 * Integrado con Agentes IA
 */

import { useState } from "react";
import { FileText, Plus, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";

export default function BillingModule() {
  const [activeTab, setActiveTab] = useState("invoices");
  const [isLoading, setIsLoading] = useState(false);
  const [billingData, setBillingData] = useState<any>(null);

  const generateInvoiceMutation = trpc.billing.generateInvoice.useMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: (data) => {
      setBillingData(data);
      setIsLoading(false);
    },
    onError: () => setIsLoading(false),
  });

  const handleGenerateInvoice = () => {
    generateInvoiceMutation.mutate({
      clientId: 1,
      amount: 50000,
    });
  };

  const invoices = billingData?.output?.invoices || [
    { id: "FAC-001", client: "Cliente A", amount: 25000, date: "2026-07-20", status: "paid" },
    { id: "FAC-002", client: "Cliente B", amount: 35000, date: "2026-07-19", status: "pending" },
    { id: "FAC-003", client: "Cliente C", amount: 15000, date: "2026-07-18", status: "pending" },
  ];

  const getStatusColor = (status: string) => {
    return status === "paid" 
      ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
      : "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-primary">Facturación</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Facturación</h1>
          <p className="text-lg text-muted-foreground">Gestiona facturas, recibos y notas de crédito con IA</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="invoices">Facturas</TabsTrigger>
            <TabsTrigger value="receipts">Recibos</TabsTrigger>
            <TabsTrigger value="credits">Notas de Crédito</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-6 animate-fade-in-up">
            <div className="flex gap-4">
              <Button
                onClick={handleGenerateInvoice}
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white h-12 font-semibold rounded-lg transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Factura
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3">
              {invoices.map((invoice: any, i: number) => (
                <div key={i} className="rounded-xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <p className="font-bold text-foreground">{invoice.id}</p>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                          {invoice.status === "paid" ? "Pagada" : "Pendiente"}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{invoice.client} • {invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">${invoice.amount.toLocaleString()}</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Download className="w-4 h-4 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="receipts" className="space-y-6 animate-fade-in-up">
            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Recibos Emitidos</h3>
              <div className="space-y-3">
                {[
                  { id: "REC-001", client: "Cliente A", amount: 10000, date: "2026-07-20" },
                  { id: "REC-002", client: "Cliente B", amount: 15000, date: "2026-07-19" },
                  { id: "REC-003", client: "Cliente C", amount: 8000, date: "2026-07-18" },
                ].map((receipt, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border hover:border-accent/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{receipt.id}</p>
                        <p className="text-sm text-muted-foreground">{receipt.client} • {receipt.date}</p>
                      </div>
                      <p className="text-lg font-semibold text-foreground">${receipt.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="credits" className="space-y-6 animate-fade-in-up">
            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Notas de Crédito</h3>
              <div className="space-y-3">
                {[
                  { id: "NC-001", client: "Cliente A", amount: 5000, reason: "Devolución", date: "2026-07-20" },
                  { id: "NC-002", client: "Cliente B", amount: 3000, reason: "Descuento", date: "2026-07-19" },
                ].map((credit, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border hover:border-secondary/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{credit.id}</p>
                        <p className="text-sm text-muted-foreground">{credit.client} • {credit.reason} • {credit.date}</p>
                      </div>
                      <p className="text-lg font-semibold text-secondary">-${credit.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
