import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { Skeleton } from '@kit/ui/skeleton';
import {
  FileText,
  Truck,
  FlaskConical,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
} from 'lucide-react';

import { getReferencesStats } from '@kit/supabase/queries/references';
import { getOperationsStats } from '@kit/supabase/queries/operations';
import { getLabAnalysisStats } from '@kit/supabase/queries/lab-analysis';

interface DashboardStats {
  references: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    on_hold: number;
  };
  operations: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
    rescheduled: number;
    completedToday: number;
  };
  laboratory: {
    total: number;
    waiting_sample: number;
    in_analysis: number;
    completed: number;
    failed: number;
    requires_retest: number;
    completedToday: number;
  };
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [referencesStats, operationsStats, labStats] = await Promise.all([
      getReferencesStats(),
      getOperationsStats(),
      getLabAnalysisStats(),
    ]);

    return {
      references: referencesStats,
      operations: operationsStats,
      laboratory: labStats,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values if there's an error
    return {
      references: { total: 0, pending: 0, in_progress: 0, completed: 0, cancelled: 0, on_hold: 0 },
      operations: { total: 0, pending: 0, in_progress: 0, completed: 0, failed: 0, rescheduled: 0, completedToday: 0 },
      laboratory: { total: 0, waiting_sample: 0, in_analysis: 0, completed: 0, failed: 0, requires_retest: 0, completedToday: 0 },
    };
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();

  // Calculate efficiency percentage
  const efficiency = stats.references.total > 0
    ? Math.round((stats.references.completed / stats.references.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Incolab</h1>
        <p className="text-muted-foreground">
          Vista general del estado de referencias y operaciones
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referencias</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.references.total}</div>
            <p className="text-xs text-muted-foreground">
              Registradas en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.references.in_progress}</div>
            <p className="text-xs text-muted-foreground">
              Operaciones activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.references.completed}</div>
            <p className="text-xs text-muted-foreground">
              Certificados listos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{efficiency}%</div>
            <p className="text-xs text-muted-foreground">
              Referencias completadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Area Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Operations Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Operaciones
            </CardTitle>
            <CardDescription>Estado de las tareas de campo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pendientes</span>
              <Badge variant="outline">{stats.operations.pending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">En Campo</span>
              <Badge variant="default">{stats.operations.in_progress}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completadas Hoy</span>
              <Badge variant="secondary">{stats.operations.completedToday}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Laboratory Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Laboratorio
            </CardTitle>
            <CardDescription>Estado de los análisis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Esperando Muestra</span>
              <Badge variant="outline">{stats.laboratory.waiting_sample}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">En Análisis</span>
              <Badge variant="default">{stats.laboratory.in_analysis}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completados Hoy</span>
              <Badge variant="secondary">{stats.laboratory.completedToday}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Rendimiento del Equipo
            </CardTitle>
            <CardDescription>Métricas del equipo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Referencias Activas</span>
              <Badge variant="outline">{stats.references.in_progress + stats.references.pending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Servicios Completos</span>
              <Badge variant="secondary">{efficiency}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">En Espera</span>
              <Badge variant="outline">{stats.references.on_hold}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Sistema</CardTitle>
          <CardDescription>
            Resumen general de todas las operaciones activas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.references.total}</div>
              <div className="text-sm text-muted-foreground">Referencias Totales</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.operations.total}</div>
              <div className="text-sm text-muted-foreground">Operaciones Totales</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.laboratory.total}</div>
              <div className="text-sm text-muted-foreground">Análisis Totales</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Acciones frecuentes para gestionar el flujo de trabajo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Nueva Referencia</p>
                <p className="text-xs text-muted-foreground">Crear servicio</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Ver Operaciones</p>
                <p className="text-xs text-muted-foreground">Gestionar tareas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
              <FlaskConical className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Laboratorio</p>
                <p className="text-xs text-muted-foreground">Ver análisis</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Generar Certificado</p>
                <p className="text-xs text-muted-foreground">Completar servicio</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}