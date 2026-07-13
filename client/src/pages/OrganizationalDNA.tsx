import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';

export default function OrganizationalDNA() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('POLICY');
  const [newRuleKey, setNewRuleKey] = useState('');
  const [newRuleValue, setNewRuleValue] = useState('');

  // Queries
  const { data: dnaRules, refetch: refetchDNA } = trpc.payroll.dna.listCategories.useQuery(undefined, { enabled: true });

  // Mutations
  const addRuleMutation = trpc.payroll.dna.updateRule.useMutation({
    onSuccess: () => {
      refetchDNA();
      setIsDialogOpen(false);
      setNewRuleKey('');
      setNewRuleValue('');
    },
  });

  const handleAddRule = () => {
    if (!newRuleKey.trim() || !newRuleValue.trim()) return;

    addRuleMutation.mutate({
      category: selectedCategory as any,
      key: newRuleKey,
      value: newRuleValue,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      POLICY: 'bg-blue-100 text-blue-800',
      RULE: 'bg-green-100 text-green-800',
      CRITERION: 'bg-purple-100 text-purple-800',
      TEMPLATE: 'bg-orange-100 text-orange-800',
      LEARNING: 'bg-red-100 text-red-800',
      BEST_PRACTICE: 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const groupedRules = (dnaRules as any[] | undefined)?.reduce(
    (acc: Record<string, any[]>, rule: any) => {
      if (!acc[rule.category]) {
        acc[rule.category] = [];
      }
      acc[rule.category].push(rule);
      return acc;
    },
    {}
  ) || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              ADN Organizacional
            </h1>
            <p className="text-slate-600 mt-1">
              Repositorio de reglas, políticas, criterios y memoria institucional
            </p>
          </div>

          {/* Botón agregar regla */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Regla
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Regla al ADN Organizacional</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Categoría
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POLICY">Política</SelectItem>
                      <SelectItem value="RULE">Regla</SelectItem>
                      <SelectItem value="CRITERION">Criterio</SelectItem>
                      <SelectItem value="TEMPLATE">Plantilla</SelectItem>
                      <SelectItem value="LEARNING">Aprendizaje</SelectItem>
                      <SelectItem value="BEST_PRACTICE">Mejor Práctica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Clave
                  </label>
                  <Input
                    placeholder="Ej: SALARY_CALCULATION_METHOD"
                    value={newRuleKey}
                    onChange={(e) => setNewRuleKey(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Valor / Descripción
                  </label>
                  <Textarea
                    placeholder="Describa la regla, política o criterio..."
                    value={newRuleValue}
                    onChange={(e) => setNewRuleValue(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleAddRule}
                  className="w-full"
                  disabled={addRuleMutation.isPending || !newRuleKey.trim() || !newRuleValue.trim()}
                >
                  {addRuleMutation.isPending ? 'Agregando...' : 'Agregar Regla'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Reglas por categoría */}
        <div className="space-y-8">
          {Object.entries(groupedRules).length > 0 ? (
            Object.entries(groupedRules).map(([category, rules]: [string, any]) => (
              <div key={category}>
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-semibold text-slate-900">{category}</h2>
                  <Badge className={getCategoryColor(category)}>
                    {(rules as any[]).length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {(rules as any[]).map((rule) => (
                    <Card key={rule.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getCategoryColor(rule.category)}>
                                {rule.category}
                              </Badge>
                            </div>
                            <p className="font-medium text-slate-900">{rule.key}</p>
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                              {rule.value}
                            </p>
                            <p className="text-xs text-slate-500 mt-3">
                              Versión: {rule.version} • Actualizado:{' '}
                              {new Date(rule.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No hay reglas en el ADN organizacional</p>
                <p className="text-sm text-slate-400 mt-1">
                  Agregue reglas, políticas y criterios para mejorar el sistema
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Información */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Acerca del ADN Organizacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700">
              El ADN Organizacional es el repositorio centralizado de conocimiento, reglas y políticas
              que guían el funcionamiento del sistema multiagente. Cada decisión tomada por los supervisores
              humanos que rechaza o modifica un resultado de agente se convierte automáticamente en aprendizaje
              organizacional.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-blue-900 uppercase mb-1">Políticas</p>
                <p className="text-sm text-blue-800">Directrices generales de la organización</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-green-900 uppercase mb-1">Reglas</p>
                <p className="text-sm text-green-800">Normas específicas para cálculos y decisiones</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-purple-900 uppercase mb-1">Criterios</p>
                <p className="text-sm text-purple-800">Estándares de validación y evaluación</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-red-900 uppercase mb-1">Aprendizajes</p>
                <p className="text-sm text-red-800">Conocimiento adquirido de supervisión humana</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
