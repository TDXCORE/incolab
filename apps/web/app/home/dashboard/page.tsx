import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
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

// Mock data for dashboard metrics
const dashboardData = {
  overview: {
    totalReferences: 3,
    inProgress: 1,
    completed: 1,
    pending: 1,
  },
  operations: {
    pendingTasks: 2,
    inField: 0,
    completedToday: 1,
  },
  laboratory: {
    waitingSample: 2,
    inAnalysis: 0,
    completedToday: 1,
  },
  recentActivity: [
    {
      id: '1',
      type: 'reference_created',
      description: 'Nueva referencia REF-2025-003 creada para Compañía 123 S.A.S.',
      time: '2 horas',
      icon: FileText,
    },
    {
      id: '2',
      type: 'operation_completed',
      description: 'Muestreo completado para REF-2025-001 en Mina El Cerrejón',
      time: '4 horas',
      icon: Truck,
    },
    {
      id: '3',
      type: 'analysis_completed',
      description: 'Análisis de calidad completado para REF-2025-001',
      time: '6 horas',
      icon: FlaskConical,
    },
  ],
};

export default function DashboardPage() {
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
            <div className="text-2xl font-bold">{dashboardData.overview.totalReferences}</div>
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
            <div className="text-2xl font-bold">{dashboardData.overview.inProgress}</div>
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
            <div className="text-2xl font-bold">{dashboardData.overview.completed}</div>
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
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">
              Promedio mensual
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
              <Badge variant="outline">{dashboardData.operations.pendingTasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">En Campo</span>
              <Badge variant="default">{dashboardData.operations.inField}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completadas Hoy</span>
              <Badge variant="secondary">{dashboardData.operations.completedToday}</Badge>
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
              <Badge variant="outline">{dashboardData.laboratory.waitingSample}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">En Análisis</span>
              <Badge variant="default">{dashboardData.laboratory.inAnalysis}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completados Hoy</span>
              <Badge variant="secondary">{dashboardData.laboratory.completedToday}</Badge>
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
              <span className="text-sm text-muted-foreground">Tiempo Promedio</span>
              <Badge variant="outline">2.5 días</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Servicios Completos</span>
              <Badge variant="secondary">33%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Satisfacción</span>
              <Badge variant="default">4.8/5</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas actividades en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">Hace {activity.time}</p>
                  </div>
                </div>
              );
            })}
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
                <p className="text-sm font-medium">Asignar Operación</p>
                <p className="text-xs text-muted-foreground">A técnico</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
              <FlaskConical className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Procesar Muestra</p>
                <p className="text-xs text-muted-foreground">En laboratorio</p>
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