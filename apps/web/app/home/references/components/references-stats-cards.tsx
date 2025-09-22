'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useReferencesStats } from '../hooks/use-references-stats';

export function ReferencesStatsCards() {
  const { data: stats, isLoading } = useReferencesStats();

  const statsCards = [
    {
      title: 'Total Referencias',
      value: stats?.total ?? '--',
      description: 'Registradas en el sistema',
      icon: FileText,
    },
    {
      title: 'En Proceso',
      value: stats?.in_progress ?? '--',
      description: 'Operaciones activas',
      icon: AlertCircle,
    },
    {
      title: 'Completadas',
      value: stats?.completed ?? '--',
      description: 'Certificados listos',
      icon: CheckCircle,
    },
    {
      title: 'Pendientes',
      value: stats?.pending ?? '--',
      description: 'Esperando inicio',
      icon: Clock,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '--' : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? 'Cargando...' : stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}