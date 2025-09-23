import { Button } from '@kit/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ReferencesTable } from './components/references-table';
import { ReferencesStatsCards } from './components/references-stats-cards';

export default function ReferencesPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Referencias</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Gestiona todas las referencias de servicios de Incolab
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
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