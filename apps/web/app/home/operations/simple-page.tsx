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
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

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
  // Simple query without complex relations
  const { data: operations, isLoading, error } = useQuery({
    queryKey: ['operations-simple'],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();

      try {
        const { data, error } = await supabase
          .from('operations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        return data || [];
      } catch (err) {
        console.error('Query error:', err);
        throw err;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  const stats = {
    pending: operations?.filter(op => op.status === 'pending').length || 0,
    in_progress: operations?.filter(op => op.status === 'in_progress').length || 0,
    completed: operations?.filter(op => op.status === 'completed').length || 0,
    efficiency: '95%'
  };

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
            <div className="text-2xl font-bold">{stats.pending}</div>
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
            <div className="text-2xl font-bold">{stats.in_progress}</div>
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
            <div className="text-2xl font-bold">{stats.completed}</div>
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
            <div className="text-2xl font-bold">{stats.efficiency}</div>
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
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-sm text-muted-foreground">Cargando operaciones...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-sm font-medium text-red-600">Error al cargar operaciones</div>
              <div className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'Error desconocido'}
              </div>
            </div>
          ) : !operations || operations.length === 0 ? (
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
                    <TableHead>ID Operación</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operations.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell className="font-medium">
                        {operation.reference_id?.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="capitalize">
                        {operation.operation_type}
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