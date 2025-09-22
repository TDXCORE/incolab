import { Button } from '@kit/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ReferencesTable } from './components/references-table';
import { ReferencesStatsCards } from './components/references-stats-cards';

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
      <ReferencesStatsCards />

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