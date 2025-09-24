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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Textarea } from '@kit/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { CheckCircle, Clock, AlertCircle, Truck, Thermometer, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOperations, assignOperationToUser, updateOperation } from '@kit/supabase/queries/operations';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


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

function SamplingDataModal({ operation, onComplete }: { operation: any, onComplete: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    scenario: '',
    placa_vehiculo: '',
    manifiesto_numero: '',
    temperatura_muestra: '',
    cantidad_muestra: '',
    unidades_muestra: 'kg',
    condiciones_muestra: '',
    observaciones: ''
  });

  const handleSubmit = () => {
    if (!formData.scenario || !formData.cantidad_muestra) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }

    onComplete({
      status: 'completed',
      completed_at: new Date().toISOString(),
      sample_quantity: parseFloat(formData.cantidad_muestra),
      sample_units: formData.unidades_muestra,
      sampling_data: {
        scenario: formData.scenario,
        placa_vehiculo: formData.placa_vehiculo,
        manifiesto_numero: formData.manifiesto_numero,
        temperatura_muestra: formData.temperatura_muestra,
        condiciones_muestra: formData.condiciones_muestra,
        observaciones: formData.observaciones,
        fecha_muestreo: new Date().toISOString()
      },
      notes: `Operación completada - Escenario: ${formData.scenario}, Cantidad: ${formData.cantidad_muestra} ${formData.unidades_muestra}`
    });

    setOpen(false);
    setFormData({
      scenario: '',
      placa_vehiculo: '',
      manifiesto_numero: '',
      temperatura_muestra: '',
      cantidad_muestra: '',
      unidades_muestra: 'kg',
      condiciones_muestra: '',
      observaciones: ''
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Completar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Datos de Muestreo - {operation.service_references?.reference_number}
            </DialogTitle>
            <DialogDescription>
              Complete los datos detallados del muestreo para finalizar la operación
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scenario">Escenario de Muestreo *</Label>
              <Select value={formData.scenario} onValueChange={(value) => setFormData(prev => ({ ...prev, scenario: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar escenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mina">Mina</SelectItem>
                  <SelectItem value="tren">Tren</SelectItem>
                  <SelectItem value="tractomula">Tractomula</SelectItem>
                  <SelectItem value="pila">Pila</SelectItem>
                  <SelectItem value="acopio">Acopio</SelectItem>
                  <SelectItem value="barco">Barco/Buque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placa">Placa Vehículo</Label>
              <Input
                id="placa"
                value={formData.placa_vehiculo}
                onChange={(e) => setFormData(prev => ({ ...prev, placa_vehiculo: e.target.value }))}
                placeholder="Ej: ABC-123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manifiesto">Número de Manifiesto</Label>
              <Input
                id="manifiesto"
                value={formData.manifiesto_numero}
                onChange={(e) => setFormData(prev => ({ ...prev, manifiesto_numero: e.target.value }))}
                placeholder="Ej: MAN-2025-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperatura" className="flex items-center gap-1">
                <Thermometer className="h-4 w-4" />
                Temperatura Muestra (°C)
              </Label>
              <Input
                id="temperatura"
                type="number"
                value={formData.temperatura_muestra}
                onChange={(e) => setFormData(prev => ({ ...prev, temperatura_muestra: e.target.value }))}
                placeholder="Ej: 25"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad Muestra *</Label>
              <Input
                id="cantidad"
                type="number"
                value={formData.cantidad_muestra}
                onChange={(e) => setFormData(prev => ({ ...prev, cantidad_muestra: e.target.value }))}
                placeholder="Ej: 50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unidades">Unidades</Label>
              <Select value={formData.unidades_muestra} onValueChange={(value) => setFormData(prev => ({ ...prev, unidades_muestra: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="ton">Toneladas</SelectItem>
                  <SelectItem value="lb">Libras</SelectItem>
                  <SelectItem value="g">Gramos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condiciones">Condiciones de la Muestra</Label>
            <Input
              id="condiciones"
              value={formData.condiciones_muestra}
              onChange={(e) => setFormData(prev => ({ ...prev, condiciones_muestra: e.target.value }))}
              placeholder="Ej: Muestra seca, sin contaminantes visibles"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              placeholder="Observaciones adicionales del muestreo..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Completar Operación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function OperationsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: operations, isLoading, error } = useQuery({
    queryKey: ['operations'],
    queryFn: () => getOperations(),
    retry: 3,
    retryDelay: 1000,
  });

  const assignOperationMutation = useMutation({
    mutationFn: async (operationId: string) => {
      // Update operation to in_progress without user assignment for demo
      return updateOperation(operationId, {
        status: 'in_progress',
        assigned_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        notes: 'Operación asignada desde el panel de control'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      toast.success('Operación asignada exitosamente');
    },
    onError: (error) => {
      console.error('Error assigning operation:', error);
      toast.error('Error al asignar operación');
    },
  });

  const completeOperationMutation = useMutation({
    mutationFn: async ({ operationId, data }: { operationId: string, data: any }) => {
      return updateOperation(operationId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      toast.success('Operación completada exitosamente');
    },
    onError: (error) => {
      console.error('Error completing operation:', error);
      toast.error('Error al completar operación');
    },
  });

  const handleCompleteOperation = (operationId: string, data: any) => {
    completeOperationMutation.mutate({ operationId, data });
  };

  const handleOperationAction = (operation: any) => {
    if (operation.status === 'pending') {
      assignOperationMutation.mutate(operation.id);
    } else if (operation.status === 'in_progress') {
      completeOperationMutation.mutate(operation.id);
    } else {
      // For completed operations, navigate to the reference detail page
      if (operation.reference_id) {
        router.push(`/home/references/${operation.reference_id}`);
      } else if (operation.service_references?.id) {
        router.push(`/home/references/${operation.service_references.id}`);
      } else {
        toast.error('No se pudo encontrar la referencia asociada');
        console.error('Operation data:', operation);
      }
    }
  };

  const stats = {
    pending: operations?.filter(op => op.status === 'pending').length || 0,
    in_progress: operations?.filter(op => op.status === 'in_progress').length || 0,
    completed: operations?.filter(op => op.status === 'completed').length || 0,
    efficiency: '95%'
  };
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Operaciones</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Gestiona las tareas de campo y muestreos asignados
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="hidden md:table-cell">Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operations?.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell className="font-medium">
                        {operation.service_references?.reference_number}
                      </TableCell>
                      <TableCell>{operation.service_references?.client_name}</TableCell>
                      <TableCell className="capitalize">
                        {operation.operation_type}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {operation.service_references?.location}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(operation.status)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {new Date(operation.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-right">
                        {operation.status === 'pending' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => assignOperationMutation.mutate(operation.id)}
                            disabled={assignOperationMutation.isPending}
                          >
                            Asignar a mí
                          </Button>
                        ) : operation.status === 'in_progress' ? (
                          <SamplingDataModal
                            operation={operation}
                            onComplete={(data) => handleCompleteOperation(operation.id, data)}
                          />
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOperationAction(operation)}
                          >
                            Ver Detalles
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