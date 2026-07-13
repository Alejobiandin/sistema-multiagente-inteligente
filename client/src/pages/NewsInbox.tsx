import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function NewsInbox() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newsType, setNewsType] = useState('OTHER');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('MANUAL');

  // Queries
  const { data: newsItems, refetch: refetchNews } = trpc.payroll.news.list.useQuery({
    processed: false,
    limit: 50,
  });

  // Mutations
  const createNewsMutation = trpc.payroll.news.create.useMutation({
    onSuccess: () => {
      refetchNews();
      setIsDialogOpen(false);
      setContent('');
      setNewsType('OTHER');
      setSource('MANUAL');
    },
  });

  const classifyNewsMutation = trpc.payroll.news.classify.useMutation({
    onSuccess: () => {
      refetchNews();
    },
  });

  const handleCreateNews = () => {
    if (!content.trim()) return;

    createNewsMutation.mutate({
      newsType: newsType as any,
      content,
      source: source as any,
      priority: 'MEDIUM',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      SALARY_CHANGE: 'bg-blue-100 text-blue-800',
      HIRING: 'bg-green-100 text-green-800',
      TERMINATION: 'bg-red-100 text-red-800',
      BENEFIT_CHANGE: 'bg-purple-100 text-purple-800',
      TAX_UPDATE: 'bg-indigo-100 text-indigo-800',
      REGULATORY_CHANGE: 'bg-orange-100 text-orange-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Bandeja de Novedades Laborales
            </h1>
            <p className="text-slate-600 mt-1">
              Ingrese y clasifique cambios laborales, normativas y novedades
            </p>
          </div>

          {/* Botón nueva novedad */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Novedad
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Novedad Laboral</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Tipo de Novedad
                  </label>
                  <Select value={newsType} onValueChange={setNewsType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SALARY_CHANGE">Cambio de Salario</SelectItem>
                      <SelectItem value="HIRING">Contratación</SelectItem>
                      <SelectItem value="TERMINATION">Terminación</SelectItem>
                      <SelectItem value="BENEFIT_CHANGE">Cambio de Beneficios</SelectItem>
                      <SelectItem value="TAX_UPDATE">Actualización Fiscal</SelectItem>
                      <SelectItem value="REGULATORY_CHANGE">Cambio Normativo</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Fuente
                  </label>
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANUAL">Manual</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="DOCUMENT">Documento</SelectItem>
                      <SelectItem value="OFFICIAL_ORGANISM">Organismo Oficial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Contenido de la Novedad
                  </label>
                  <Textarea
                    placeholder="Describa la novedad laboral en detalle..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                  />
                </div>

                <Button
                  onClick={handleCreateNews}
                  className="w-full"
                  disabled={createNewsMutation.isPending || !content.trim()}
                >
                  {createNewsMutation.isPending ? 'Registrando...' : 'Registrar Novedad'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Novedades pendientes */}
        <div className="space-y-4">
          {newsItems && newsItems.length > 0 ? (
            newsItems.map((news: any) => (
              <Card key={news.id} className="hover:shadow-md transition">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTypeColor(news.newsType)}>
                            {news.newsType}
                          </Badge>
                          <Badge className={getPriorityColor(news.priority)}>
                            {news.priority}
                          </Badge>
                          <Badge variant="outline">
                            {news.source}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500">
                          Creada: {new Date(news.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {news.processed && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Procesada</span>
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {news.content}
                      </p>
                    </div>

                    {/* Clasificación */}
                    {news.classification && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-xs font-medium text-blue-900 mb-1">
                          Clasificación Automática:
                        </p>
                        <p className="text-sm text-blue-800">
                          {news.classification}
                        </p>
                      </div>
                    )}

                    {/* Acciones */}
                    {!news.processed && (
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            classifyNewsMutation.mutate({
                              newsItemId: news.id,
                              classification: news.newsType,
                            });
                          }}
                          disabled={classifyNewsMutation.isPending}
                        >
                          Marcar como Procesada
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-slate-500">No hay novedades pendientes</p>
                <p className="text-sm text-slate-400 mt-1">
                  Todas las novedades han sido procesadas
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
