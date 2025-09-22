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

// Mock data for lab analysis
const mockAnalysis = [
  {
    id: '1',
    reference_number: 'REF-2025-002',
    client_name: 'Industria XYZ Ltda.',
    sample_description: 'Biomasa pelletizada',
    status: 'waiting_sample',
    analysis_type: ['humedad', 'cenizas'],
    assigned_at: '2025-09-22T17:09:20.840727+00:00',
  },
  {
    id: '2',
    reference_number: 'REF-2025-003',
    client_name: 'Compañía 123 S.A.S.',
    sample_description: 'Carbón térmico exportación',
    status: 'waiting_sample',
    analysis_type: ['poder_calorifico', 'azufre'],
    assigned_at: '2025-09-22T17:09:20.840727+00:00',
  }
];

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
            <div className="text-2xl font-bold">2</div>
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
            <div className="text-2xl font-bold">0</div>
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
            <div className="text-2xl font-bold">1</div>
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
            <div className="text-2xl font-bold">2.3h</div>
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
            <Button variant="outline" className="justify-start">
              <TestTube className="mr-2 h-4 w-4" />
              Registrar Muestra Recibida
            </Button>
            <Button variant="outline" className="justify-start">
              <FlaskConical className="mr-2 h-4 w-4" />
              Iniciar Análisis
            </Button>
            <Button variant="outline" className="justify-start">
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
          {mockAnalysis.length === 0 ? (
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
                  {mockAnalysis.map((analysis) => (
                    <TableRow key={analysis.id}>
                      <TableCell className="font-medium">
                        {analysis.reference_number}
                      </TableCell>
                      <TableCell>{analysis.client_name}</TableCell>
                      <TableCell className="text-sm">
                        {analysis.sample_description}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {analysis.analysis_type.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(analysis.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(analysis.assigned_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={analysis.status === 'waiting_sample'}
                        >
                          {analysis.status === 'waiting_sample'
                            ? 'Esperando...'
                            : 'Procesar'
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