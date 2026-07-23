/**
 * Módulo de Economía - Análisis Económico, Presupuestos, Indicadores
 * Integrado con Agentes IA
 */

import { useState } from "react";
import { TrendingUp, PieChart, Target, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";

export default function EconomyModule() {
  const [activeTab, setActiveTab] = useState("indicators");
  const [isLoading, setIsLoading] = useState(false);
  const [economyData, setEconomyData] = useState<any>(null);

  const calculateEconomyMutation = trpc.economy.analyze.useMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: (data) => {
      setEconomyData(data);
      setIsLoading(false);
    },
    onError: () => setIsLoading(false),
  });

  const handleAnalyze = () => {
    calculateEconomyMutation.mutate({
      clientId: 1,
      periodo: "2026-07",
    });
  };

  const indicators = economyData?.output?.indicators || {
    roi: 28.5,
    margin: 64.3,
    cashFlow: 225000,
    profitability: 18.2,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-primary">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-accent">Análisis Económico</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Análisis Económico</h1>
          <p className="text-lg text-muted-foreground">Indicadores, presupuestos y análisis financiero con IA</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="indicators">Indicadores</TabsTrigger>
            <TabsTrigger value="budgets">Presupuestos</TabsTrigger>
            <TabsTrigger value="projections">Proyecciones</TabsTrigger>
          </TabsList>

          <TabsContent value="indicators" className="space-y-6 animate-fade-in-up">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="group">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 group-hover:from-accent/30 group-hover:to-primary/30 transition-all">
                      <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">ROI</p>
                  <p className="text-3xl font-bold text-foreground">{(indicators.roi || 0).toFixed(1)}%</p>
                </div>
              </div>

              <div className="group">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                      <PieChart className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Margen Bruto</p>
                  <p className="text-3xl font-bold text-foreground">{(indicators.margin || 0).toFixed(1)}%</p>
                </div>
              </div>

              <div className="group">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 group-hover:from-secondary/30 group-hover:to-accent/30 transition-all">
                      <Target className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Flujo de Caja</p>
                  <p className="text-3xl font-bold text-foreground">${(indicators.cashFlow || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="group">
                <div className="rounded-xl bg-card border border-border p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 group-hover:from-accent/30 group-hover:to-secondary/30 transition-all">
                      <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Rentabilidad</p>
                  <p className="text-3xl font-bold text-foreground">{(indicators.profitability || 0).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white h-12 font-semibold rounded-lg transition-all duration-300 w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analizar con IA
                </>
              )}
            </Button>

            {economyData && (
              <div className="rounded-xl bg-card border border-border p-6 animate-fade-in-up">
                <h3 className="text-lg font-bold text-foreground mb-4">Análisis Detallado</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Razonamiento del Agente IA:</p>
                    <p className="text-foreground">{economyData.reasoning}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6 animate-fade-in-up">
            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Presupuestos por Área</h3>
              <div className="space-y-3">
                {[
                  { area: "Operaciones", budget: 150000, spent: 125000, percentage: 83 },
                  { area: "Marketing", budget: 50000, spent: 35000, percentage: 70 },
                  { area: "Tecnología", budget: 80000, spent: 72000, percentage: 90 },
                  { area: "Recursos Humanos", budget: 100000, spent: 95000, percentage: 95 },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">{item.area}</p>
                      <p className="text-sm text-muted-foreground">${item.spent.toLocaleString()} / ${item.budget.toLocaleString()}</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6 animate-fade-in-up">
            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Proyecciones Futuras</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-2">Proyección Q3 2026</p>
                  <p className="text-2xl font-bold text-accent">$425,000</p>
                  <p className="text-xs text-muted-foreground mt-1">+21.4% vs Q2</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Proyección Q4 2026</p>
                  <p className="text-2xl font-bold text-primary">$510,000</p>
                  <p className="text-xs text-muted-foreground mt-1">+20% vs Q3</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
