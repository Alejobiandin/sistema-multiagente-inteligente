/**
 * Módulo de Impuestos - Gestión de Ganancias, IVA, Retenciones
 * Integrado con Agentes IA
 */

import { useState } from "react";
import { DollarSign, TrendingDown, FileText, AlertTriangle, Loader2, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";

export default function TaxesModule() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedData, setCalculatedData] = useState<any>(null);

  // Llamar agente de impuestos
  const calculateTaxesMutation = trpc.taxes.calculate.useMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: (data) => {
      setCalculatedData(data);
      setIsLoading(false);
    },
    onError: () => setIsLoading(false),
  });

  const taxSummary = calculatedData?.output?.taxes || [
    { type: "ganancias", amount: 35000, rate: 35, status: "pending" },
    { type: "iva", amount: 21000, rate: 21, status: "pending" },
    { type: "retenciones", amount: 17000, rate: 17, status: "pending" },
    { type: "aportes", amount: 16000, rate: 16, status: "pending" }
  ];

  const handleCalculate = () => {
    calculateTaxesMutation.mutate({
      clientId: 1,
      periodo: "2026-07",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400";
      case "pending":
        return "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400";
      default:
        return "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-primary">Gestión Fiscal</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Gestión de Impuestos</h1>
          <p className="text-lg text-muted-foreground">Administra impuestos, retenciones y obligaciones fiscales con agentes IA</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="ganancias">Ganancias</TabsTrigger>
            <TabsTrigger value="iva">IVA</TabsTrigger>
            <TabsTrigger value="retenciones">Retenciones</TabsTrigger>
            <TabsTrigger value="aportes">Aportes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in-up">
            {/* Tax Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {taxSummary.map((tax: any, i: number) => (
                <div key={i} className="group">
                  <div className="rounded-xl bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                        <DollarSign className="w-6 h-6 text-primary" />
                      </div>
                      {getStatusIcon(tax.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{tax.type?.toUpperCase() || tax.name}</p>
                    <p className="text-3xl font-bold text-foreground mb-2">${tax.amount?.toLocaleString() || 0}</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tax.status)}`}>
                      {getStatusIcon(tax.status)}
                      {tax.status === "completed" ? "Completado" : "Pendiente"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="grid gap-4 md:grid-cols-2">
              <Button
                onClick={handleCalculate}
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white h-12 font-semibold rounded-lg transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Calcular Impuestos con IA
                  </>
                )}
              </Button>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 font-semibold rounded-lg transition-all duration-300">
                <FileText className="w-4 h-4 mr-2" />
                Generar Declaración Jurada
              </Button>
            </div>

            {/* Results */}
            {calculatedData && (
              <div className="rounded-xl bg-card border border-border p-6 animate-fade-in-up">
                <h3 className="text-lg font-bold text-foreground mb-4">Resultados del Cálculo</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">Monto Total de Impuestos</p>
                      <p className="text-2xl font-bold text-primary">${calculatedData.output?.total_tax_amount?.toLocaleString() || 0}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                      <p className="text-sm text-muted-foreground mb-1">Tasa Efectiva</p>
                      <p className="text-2xl font-bold text-accent">{calculatedData.output?.effective_rate?.toFixed(2) || 0}%</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Razonamiento del Agente IA:</p>
                    <p className="text-foreground">{calculatedData.reasoning}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Ganancias Tab */}
          <TabsContent value="ganancias" className="space-y-6 animate-fade-in-up">
            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Impuesto a las Ganancias</h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-foreground">$100,000</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Tasa Aplicable</p>
                    <p className="text-2xl font-bold text-primary">35%</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Impuesto Calculado</p>
                  <p className="text-3xl font-bold text-primary">$35,000</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* IVA Tab */}
          <TabsContent value="iva" className="space-y-6 animate-fade-in-up">
            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">IVA (Impuesto al Valor Agregado)</h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Base Imponible</p>
                    <p className="text-2xl font-bold text-foreground">$100,000</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Tasa Aplicable</p>
                    <p className="text-2xl font-bold text-accent">21%</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-2">IVA Calculado</p>
                  <p className="text-3xl font-bold text-accent">$21,000</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Retenciones Tab */}
          <TabsContent value="retenciones" className="space-y-6 animate-fade-in-up">
            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Retenciones AFIP</h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Monto Sujeto a Retención</p>
                    <p className="text-2xl font-bold text-foreground">$100,000</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Tasa Aplicable</p>
                    <p className="text-2xl font-bold text-secondary">17%</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                  <p className="text-sm text-muted-foreground mb-2">Retención Calculada</p>
                  <p className="text-3xl font-bold text-secondary">$17,000</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Aportes Tab */}
          <TabsContent value="aportes" className="space-y-6 animate-fade-in-up">
            <div className="rounded-xl bg-card border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Aportes Patronales</h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Masa Salarial</p>
                    <p className="text-2xl font-bold text-foreground">$100,000</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Tasa Aplicable</p>
                    <p className="text-2xl font-bold text-primary">16%</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Aportes Calculados</p>
                  <p className="text-3xl font-bold text-primary">$16,000</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
