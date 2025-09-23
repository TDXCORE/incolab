'use client';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { Separator } from '@kit/ui/separator';
import { ArrowLeft, Calendar, FileText, MapPin, User, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSupabaseAdminClient } from '@kit/supabase/browser-client';

function getStatusBadge(status: string) {
  const statusConfig = {
    pending: { label: 'Pendiente', variant: 'outline' as const },
    in_progress: { label: 'En Proceso', variant: 'default' as const },
    completed: { label: 'Completado', variant: 'secondary' as const },
    cancelled: { label: 'Cancelado', variant: 'destructive' as const },
    on_hold: { label: 'En Espera', variant: 'outline' as const },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function getServiceTypeBadge(serviceType: string) {
  const typeConfig = {
    quality_analysis: { label: 'Análisis de Calidad', variant: 'outline' as const },
    quantity_certification: { label: 'Certificación de Cantidad', variant: 'secondary' as const },
    both: { label: 'Análisis + Certificación', variant: 'default' as const },
    custom: { label: 'Personalizado', variant: 'outline' as const },
  };

  const config = typeConfig[serviceType as keyof typeof typeConfig] || typeConfig.both;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default function ReferenceDetailPage() {
  const params = useParams();
  const referenceId = params.id as string;

  const { data: reference, isLoading, error } = useQuery({
    queryKey: ['reference', referenceId],
    queryFn: async () => {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from('service_references')
        .select(`
          *,
          operations(*),
          lab_analysis(*)
        `)
        .eq('id', referenceId)
        .single();

      if (error) {
        throw new Error(`Error fetching reference: ${error.message}`);
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">Cargando referencia...</div>
      </div>
    );
  }

  if (error || !reference) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="text-sm text-muted-foreground">
          No se pudo cargar la referencia
        </div>
        <Button asChild variant="outline">
          <Link href="/home/references">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Referencias
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/home/references">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {reference.reference_number}
            </h1>
            <p className="text-muted-foreground">
              Detalles de la referencia de servicio
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href={`/api/references/${reference.id}/certificate`} target="_blank">
              <FileText className="h-4 w-4 mr-2" />
              Generar Certificado
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>
                Detalles básicos de la referencia de servicio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{reference.client_name}</div>
                    <div className="text-sm text-muted-foreground">Cliente</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {getServiceTypeBadge(reference.service_type)}
                    </div>
                    <div className="text-sm text-muted-foreground">Tipo de Servicio</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{reference.location}</div>
                    <div className="text-sm text-muted-foreground">Ubicación</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {new Date(reference.created_at).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-sm text-muted-foreground">Fecha de Creación</div>
                  </div>
                </div>
              </div>

              {reference.client_contact && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium">Contacto</div>
                    <div className="text-sm text-muted-foreground">{reference.client_contact}</div>
                  </div>
                </>
              )}

              <Separator />
              <div>
                <div className="text-sm font-medium">Descripción de la Muestra</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {reference.sample_description}
                </div>
              </div>

              {reference.notes && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium">Notas</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {reference.notes}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Operations */}
          <Card>
            <CardHeader>
              <CardTitle>Operaciones de Campo</CardTitle>
              <CardDescription>
                Estado de las operaciones de muestreo e inspección
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reference.operations && reference.operations.length > 0 ? (
                <div className="space-y-3">
                  {reference.operations.map((operation: any) => (
                    <div key={operation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{operation.operation_type}</div>
                        <Badge variant={operation.status === 'completed' ? 'secondary' : 'outline'}>
                          {operation.status === 'completed' ? 'Completado' :
                           operation.status === 'in_progress' ? 'En Proceso' : 'Pendiente'}
                        </Badge>
                      </div>
                      {operation.notes && (
                        <div className="text-sm text-muted-foreground">
                          {operation.notes}
                        </div>
                      )}
                      {operation.completed_at && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Completado: {new Date(operation.completed_at).toLocaleString('es-ES')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No hay operaciones registradas
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lab Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Laboratorio</CardTitle>
              <CardDescription>
                Resultados y estado de los análisis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reference.lab_analysis && reference.lab_analysis.length > 0 ? (
                <div className="space-y-3">
                  {reference.lab_analysis.map((analysis: any) => (
                    <div key={analysis.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Análisis de Laboratorio</div>
                        <Badge variant={analysis.status === 'completed' ? 'secondary' : 'outline'}>
                          {analysis.status === 'completed' ? 'Completado' :
                           analysis.status === 'in_analysis' ? 'En Análisis' : 'Esperando Muestra'}
                        </Badge>
                      </div>

                      {analysis.results && (
                        <div className="mt-3">
                          <div className="text-sm font-medium mb-2">Resultados:</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(analysis.results).map(([key, value]: [string, any]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key.replace('_', ' ')}:</span>
                                <span>
                                  {typeof value === 'object' && value.value
                                    ? `${value.value} ${value.unit || ''}`
                                    : String(value)
                                  }
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysis.notes && (
                        <div className="text-sm text-muted-foreground mt-2">
                          {analysis.notes}
                        </div>
                      )}

                      {analysis.completed_at && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Completado: {new Date(analysis.completed_at).toLocaleString('es-ES')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No hay análisis registrados
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                {getStatusBadge(reference.status)}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Cronología</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-sm">
                  <div className="font-medium">Referencia Creada</div>
                  <div className="text-muted-foreground">
                    {new Date(reference.created_at).toLocaleString('es-ES')}
                  </div>
                </div>
              </div>

              {reference.operations?.some((op: any) => op.started_at) && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-sm">
                    <div className="font-medium">Operación Iniciada</div>
                    <div className="text-muted-foreground">
                      {new Date(reference.operations.find((op: any) => op.started_at)?.started_at).toLocaleString('es-ES')}
                    </div>
                  </div>
                </div>
              )}

              {reference.lab_analysis?.some((lab: any) => lab.completed_at) && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="text-sm">
                    <div className="font-medium">Análisis Completado</div>
                    <div className="text-muted-foreground">
                      {new Date(reference.lab_analysis.find((lab: any) => lab.completed_at)?.completed_at).toLocaleString('es-ES')}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}