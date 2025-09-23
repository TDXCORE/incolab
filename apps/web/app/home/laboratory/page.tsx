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
import { FlaskConical, Clock, CheckCircle, AlertTriangle, TestTube } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLabAnalysis, assignAnalysisToUser, updateLabAnalysis } from '@kit/supabase/queries/lab-analysis';
import { toast } from 'sonner';


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
        qc_notes: 'Análisis completado satisfactoriamente. Resultados dentro de parámetros.',
        certified_by: 'demo-analyst-001',
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laboratorio</h1>
        <p className="text-muted-foreground">
          Gestiona los análisis de laboratorio y resultados
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          <div className="grid gap-3 md:grid-cols-3">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                const waitingSample = labAnalysis?.find(lab => lab.status === 'waiting_sample');
                if (waitingSample) {
                  startAnalysisMutation.mutate(waitingSample.id);
                } else {
                  toast.info('No hay muestras esperando procesamiento');
                }
              }}
              disabled={!labAnalysis?.some(lab => lab.status === 'waiting_sample') || startAnalysisMutation.isPending}
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Muestra</TableHead>
                    <TableHead>Análisis</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
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
                      <TableCell className="text-sm">
                        {analysis.service_references?.sample_description}
                      </TableCell>
                      <TableCell>
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
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(analysis.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLabAction(analysis)}
                          disabled={startAnalysisMutation.isPending || completeAnalysisMutation.isPending || analysis.status === 'completed'}
                        >
                          {analysis.status === 'waiting_sample'
                            ? 'Iniciar Análisis'
                            : analysis.status === 'completed'
                            ? 'Ver Resultados'
                            : 'Completar Análisis'
                          }
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}