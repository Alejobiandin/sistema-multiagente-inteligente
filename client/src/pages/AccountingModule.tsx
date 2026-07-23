/**
 * Módulo de Contabilidad - Asientos, Balance, Estados Financieros
 * Integrado con Agentes IA
 */

import { useState } from "react";
import { BookOpen, TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";

export default function AccountingModule() {
  const [activeTab, setActiveTab] = useState("balance");
  const [isLoading, setIsLoading] = useState(false);
  const [balanceData, setBalanceData] = useState<any>(null);

  const generateBalanceMutation = trpc.accounting.generateBalance.useMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: (data) => {
      setBalanceData(data);
      setIsLoading(false);
    },
    onError: () => setIsLoading(false),
  });

  const handleGenerateBalance = () => {
    generateBalanceMutation.mutate({
      clientId: 1,
      periodo: "2026-07",
    });
  };

  const balance = balanceData?.output?.balance_sheet || {
    assets: 1250000,
    liabilities: 450000,
    equity: 800000,
    revenue: 350000,
    expenses: 125000,
    profit: 225000,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-secondary to-primary">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-secondary">Contabilidad</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Contabilidad</h1>
          <p className="text-lg text-muted-foreground">Gestiona asientos contables, balances y estados financieros con IA</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="balance">Balance General</TabsTrigger>
            <TabsTrigger value="entries">Asientos</TabsTrigger>
            <TabsTrigger value="statements">Estados Financieros</TabsTrigger>
          </TabsList>

          <TabsContent value="balance" className="space-y-6 animate-fade-in-up">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="group">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 group-hover:from-secondary/30 group-hover:to-primary/30 transition-all">
                      <TrendingUp className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Activos</p>
                  <p className="text-3xl font-bold text-foreground">${(balance.assets || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="group">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 group-hover:from-accent/30 group-hover:to-secondary/30 transition-all">
                      <BarChart3 className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Pasivos</p>
                  <p className="text-3xl font-bold text-foreground">${(balance.liabilities || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="group">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Patrimonio</p>
                  <p className="text-3xl font-bold text-foreground">${(balance.equity || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerateBalance}
              disabled={isLoading}
              className="bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 text-white h-12 font-semibold rounded-lg transition-all duration-300 w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generando Balance...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generar Balance con IA
                </>
              )}
            </Button>

            {balanceData && (
              <div className="rounded-xl bg-card border border-border p-6 animate-fade-in-up">
                <h3 className="text-lg font-bold text-foreground mb-4">Resumen Financiero</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Ingresos</p>
                    <p className="text-2xl font-bold text-primary">${(balance.revenue || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <p className="text-sm text-muted-foreground mb-1">Gastos</p>
                    <p className="text-2xl font-bold text-accent">${(balance.expenses || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                    <p className="text-sm text-muted-foreground mb-1">Ganancia</p>
                    <p className="text-2xl font-bold text-secondary">${(balance.profit || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="entries" className="space-y-6 animate-fade-in-up">
            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Asientos Contables Recientes</h3>
              <div className="space-y-3">
                {[
                  { description: "Ingresos por ventas", debit: 50000, credit: 0, date: "2026-07-20" },
                  { description: "Gastos operativos", debit: 0, credit: 15000, date: "2026-07-19" },
                  { description: "Impuestos a pagar", debit: 0, credit: 8500, date: "2026-07-18" },
                ].map((entry, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{entry.description}</p>
                        <p className="text-sm text-muted-foreground">{entry.date}</p>
                      </div>
                      <div className="flex gap-4">
                        {entry.debit > 0 && <p className="text-primary font-semibold">${entry.debit.toLocaleString()}</p>}
                        {entry.credit > 0 && <p className="text-accent font-semibold">${entry.credit.toLocaleString()}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="statements" className="space-y-6 animate-fade-in-up">
            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Estados Financieros</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Estado de Resultados</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-foreground">Ingresos:</span>
                      <span className="font-semibold text-primary">$350,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground">Gastos:</span>
                      <span className="font-semibold text-accent">-$125,000</span>
                    </div>
                    <div className="border-t border-primary/20 pt-2 flex justify-between">
                      <span className="text-foreground font-semibold">Ganancia Neta:</span>
                      <span className="font-bold text-secondary">$225,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
