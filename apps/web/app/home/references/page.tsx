import { Button } from '@kit/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ReferencesTable } from './components/references-table';

export default function ReferencesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referencias</h1>
          <p className="text-muted-foreground">
            Gestiona todas las referencias de servicios de Incolab
          </p>
        </div>
        <Button asChild>
          <Link href="/home/references/create">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Referencia
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referencias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Cargando...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Cargando...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Cargando...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Cargando...
            </p>
          </CardContent>
        </Card>
      </div>

      {/* References Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Referencias</CardTitle>
          <CardDescription>
            Todas las referencias de servicios registradas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReferencesTable />
        </CardContent>
      </Card>
    </div>
  );
}