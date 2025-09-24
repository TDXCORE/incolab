'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import { FlaskConical, Clock, CheckCircle, AlertTriangle, TestTube, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLabAnalysis, assignAnalysisToUser, updateLabAnalysis } from '@kit/supabase/queries/lab-analysis';
import { toast } from 'sonner';
import { useState } from 'react';


function getStatusBadge(status: string) {
  const statusConfig = {
    waiting_sample: { label: 'Esperando Muestra', variant: 'outline' as const, icon: Clock },
    in_analysis: { label: 'En Análisis', variant: 'default' as const, icon: FlaskConical },
    completed: { label: 'Completado', variant: 'secondary' as const, icon: CheckCircle },
    failed: { label: 'Fallido', variant: 'destructive' as const, icon: AlertTriangle },
    requires_retest: { label: 'Requiere Re-análisis', variant: 'outline' as const, icon: TestTube },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.waiting_sample;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function ResultsModal({ analysis }: { analysis: any }) {
  const [open, setOpen] = useState(false);

  if (!analysis || !analysis.results) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Ver Resultados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Resultados de Análisis - {analysis.service_references?.reference_number}
          </DialogTitle>
          <DialogDescription>
            Cliente: {analysis.service_references?.client_name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.results).map(([key, value]: [string, any]) => (
              <Card key={key}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {value.value} {value.unit}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {value.method}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {analysis.qc_notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Notas de Control de Calidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{analysis.qc_notes}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={analysis.qc_passed ? "secondary" : "destructive"}>
                    {analysis.qc_passed ? "QC Aprobado" : "QC Rechazado"}
                  </Badge>
                  {analysis.certified_by && (
                    <Badge variant="outline">
                      Certificado por: {analysis.certified_by}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-muted-foreground">
            Completado el: {new Date(analysis.completed_at).toLocaleString('es-ES')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LaboratoryPage() {
  const queryClient = useQueryClient();

  const { data: labAnalysis, isLoading, error } = useQuery({
    queryKey: ['lab_analysis'],
    queryFn: () => getLabAnalysis(),
    retry: 3,
    retryDelay: 1000,
  });

  const startAnalysisMutation = useMutation({
    mutationFn: async (analysisId: string) => {
      return updateLabAnalysis(analysisId, {
        status: 'in_analysis',
        started_at: new Date().toISOString(),
        sample_received_at: new Date().toISOString(),
        sample_condition: 'Muestra recibida en buenas condiciones'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab_analysis'] });
      toast.success('Análisis iniciado exitosamente');
    },
    onError: (error) => {
      console.error('Error starting analysis:', error);
      toast.error('Error al iniciar análisis');
    },
  });

  const completeAnalysisMutation = useMutation({
    mutationFn: async (analysisId: string) => {
      // Sample results for demo
      const sampleResults = {
        "Humedad": { "value": 12.5, "unit": "%", "method": "Gravimetría" },
        "Cenizas": { "value": 8.2, "unit": "%", "method": "ASTM D3174" },
        "Volátiles": { "value": 35.8, "unit": "%", "method": "ASTM D3175" },
        "Carbono_fijo": { "value": 43.5, "unit": "%", "method": "Calculado" },
        "Azufre": { "value": 0.75, "unit": "%", "method": "ASTM D4239" }
      };

      return updateLabAnalysis(analysisId, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        results: sampleResults,
        qc_passed: true,
        qc_notes: 'Análisis completado satisfactoriamente. Resultados dentro de parámetros por analista demo.',
        certified_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab_analysis'] });
      toast.success('Análisis completado exitosamente');
    },
    onError: (error) => {
      console.error('Error completing analysis:', error);
      toast.error('Error al completar análisis');
    },
  });

  const handleLabAction = (analysis: any) => {
    if (analysis.status === 'waiting_sample') {
      startAnalysisMutation.mutate(analysis.id);
    } else if (analysis.status === 'in_analysis') {
      completeAnalysisMutation.mutate(analysis.id);
    }
  };

  const stats = {
    waiting_sample: labAnalysis?.filter(lab => lab.status === 'waiting_sample').length || 0,
    in_analysis: labAnalysis?.filter(lab => lab.status === 'in_analysis').length || 0,
    completed: labAnalysis?.filter(lab => lab.status === 'completed').length || 0,
    avg_time: '2.3h'
  };
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Laboratorio</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Gestiona los análisis de laboratorio y resultados
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esperando Muestra</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waiting_sample}</div>
            <p className="text-xs text-muted-foreground">
              Pendientes de operaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Análisis</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.in_analysis}</div>
            <p className="text-xs text-muted-foreground">
              Actualmente procesando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Análisis finalizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avg_time}</div>
            <p className="text-xs text-muted-foreground">
              Por análisis completo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Acciones frecuentes para el flujo de laboratorio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                const waitingSample = labAnalysis?.find(lab => lab.status === 'waiting_sample');
                if (waitingSample) {
                  // Just register that sample was received - update sample_received_at
                  updateLabAnalysis(waitingSample.id, {
                    sample_received_at: new Date().toISOString(),
                    sample_condition: 'Muestra recibida en buenas condiciones'
                  }).then(() => {
                    queryClient.invalidateQueries({ queryKey: ['lab_analysis'] });
                    toast.success('Muestra registrada como recibida');
                  }).catch((error) => {
                    console.error('Error registering sample:', error);
                    toast.error('Error al registrar muestra');
                  });
                } else {
                  toast.info('No hay muestras esperando procesamiento');
                }
              }}
              disabled={!labAnalysis?.some(lab => lab.status === 'waiting_sample')}
            >
              <TestTube className="mr-2 h-4 w-4" />
              Registrar Muestra Recibida
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                const waitingSample = labAnalysis?.find(lab => lab.status === 'waiting_sample');
                if (waitingSample) {
                  startAnalysisMutation.mutate(waitingSample.id);
                } else {
                  toast.info('No hay muestras esperando análisis');
                }
              }}
              disabled={!labAnalysis?.some(lab => lab.status === 'waiting_sample') || startAnalysisMutation.isPending}
            >
              <FlaskConical className="mr-2 h-4 w-4" />
              Iniciar Análisis
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                const inAnalysis = labAnalysis?.find(lab => lab.status === 'in_analysis');
                if (inAnalysis) {
                  completeAnalysisMutation.mutate(inAnalysis.id);
                } else {
                  toast.info('No hay análisis en progreso para completar');
                }
              }}
              disabled={!labAnalysis?.some(lab => lab.status === 'in_analysis') || completeAnalysisMutation.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Cargar Resultados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cola de Análisis</CardTitle>
          <CardDescription>
            Análisis asignados y su estado actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-sm text-muted-foreground">Cargando análisis...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-sm font-medium text-red-600">Error al cargar análisis</div>
              <div className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'Error desconocido'}
              </div>
            </div>
          ) : !labAnalysis || labAnalysis.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-sm font-medium">No hay análisis pendientes</div>
              <div className="text-sm text-muted-foreground mt-1">
                Todos los análisis están completados o esperando muestras
              </div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden md:table-cell">Muestra</TableHead>
                    <TableHead className="hidden lg:table-cell">Análisis</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labAnalysis?.map((analysis) => (
                    <TableRow key={analysis.id}>
                      <TableCell className="font-medium">
                        {analysis.service_references?.reference_number}
                      </TableCell>
                      <TableCell>{analysis.service_references?.client_name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {analysis.service_references?.sample_description}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {analysis.analysis_type ? (
                            analysis.analysis_type.map((type: string) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              General
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(analysis.status)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {new Date(analysis.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-right">
                        {analysis.status === 'completed' ? (
                          <ResultsModal analysis={analysis} />
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLabAction(analysis)}
                            disabled={startAnalysisMutation.isPending || completeAnalysisMutation.isPending}
                          >
                            {analysis.status === 'waiting_sample'
                              ? 'Iniciar Análisis'
                              : 'Completar Análisis'
                            }
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}