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
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Mock data for operations
const mockOperations = [
  {
    id: '1',
    reference_number: 'REF-2025-002',
    client_name: 'Industria XYZ Ltda.',
    operation_type: 'muestreo',
    location: 'Planta Industrial, Bogotá',
    status: 'pending',
    assigned_to: null,
    created_at: '2025-09-22T17:09:20.840727+00:00',
  },
  {
    id: '2',
    reference_number: 'REF-2025-003',
    client_name: 'Compañía 123 S.A.S.',
    operation_type: 'muestreo',
    location: 'Puerto de Cartagena',
    status: 'pending',
    assigned_to: null,
    created_at: '2025-09-22T17:09:20.840727+00:00',
  }
];

function getStatusBadge(status: string) {
  const statusConfig = {
    pending: { label: 'Pendiente', variant: 'outline' as const, icon: Clock },
    in_progress: { label: 'En Proceso', variant: 'default' as const, icon: AlertCircle },
    completed: { label: 'Completado', variant: 'secondary' as const, icon: CheckCircle },
    failed: { label: 'Fallido', variant: 'destructive' as const, icon: AlertCircle },
    rescheduled: { label: 'Reprogramado', variant: 'outline' as const, icon: Clock },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Operaciones</h1>
        <p className="text-muted-foreground">
          Gestiona las tareas de campo y muestreos asignados
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Esperando asignación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Campo</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Técnicos trabajando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Muestreos finalizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">
              Promedio semanal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Operations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Operaciones Asignadas</CardTitle>
          <CardDescription>
            Tareas de campo pendientes y en proceso
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockOperations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-sm font-medium">No hay operaciones pendientes</div>
              <div className="text-sm text-muted-foreground mt-1">
                Todas las tareas están completadas o asignadas a otros técnicos
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOperations.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell className="font-medium">
                        {operation.reference_number}
                      </TableCell>
                      <TableCell>{operation.client_name}</TableCell>
                      <TableCell className="capitalize">
                        {operation.operation_type}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {operation.location}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(operation.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(operation.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          {operation.status === 'pending' ? 'Asignar a mí' : 'Ver Detalles'}
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