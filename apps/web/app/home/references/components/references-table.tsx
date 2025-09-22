'use client';

import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Card } from '@kit/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kit/ui/table';
import { Eye, Edit, FileText } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getReferences } from '@kit/supabase/queries/references';

// Mock data while we implement the API
const mockReferences = [
  {
    id: 'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86',
    reference_number: 'REF-2025-001',
    client_name: 'Empresa ABC S.A.',
    service_type: 'both',
    status: 'completed',
    created_at: '2025-09-22T17:09:20.840727+00:00',
    sample_description: 'Carbón bituminoso para análisis completo',
    location: 'Mina El Cerrejón, La Guajira'
  },
  {
    id: 'fc603d39-eece-4d77-986f-30163d78e349',
    reference_number: 'REF-2025-002',
    client_name: 'Industria XYZ Ltda.',
    service_type: 'quality_analysis',
    status: 'in_progress',
    created_at: '2025-09-22T17:09:20.840727+00:00',
    sample_description: 'Biomasa pelletizada',
    location: 'Planta Industrial, Bogotá'
  },
  {
    id: '86816cb9-443d-45d0-8aa4-7adb9c6d54ff',
    reference_number: 'REF-2025-003',
    client_name: 'Compañía 123 S.A.S.',
    service_type: 'quantity_certification',
    status: 'pending',
    created_at: '2025-09-22T17:09:20.840727+00:00',
    sample_description: 'Carbón térmico exportación',
    location: 'Puerto de Cartagena'
  }
];

function getStatusBadge(status: string) {
  const statusConfig = {
    pending: { label: 'Pendiente', variant: 'outline' as const },
    in_progress: { label: 'En Proceso', variant: 'default' as const },
    completed: { label: 'Completado', variant: 'secondary' as const },
    cancelled: { label: 'Cancelado', variant: 'destructive' as const },
    on_hold: { label: 'En Espera', variant: 'outline' as const },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function getServiceTypeBadge(serviceType: string) {
  const typeConfig = {
    quality_analysis: { label: 'Análisis Calidad', variant: 'outline' as const },
    quantity_certification: { label: 'Cert. Cantidad', variant: 'secondary' as const },
    both: { label: 'Ambos', variant: 'default' as const },
    custom: { label: 'Personalizado', variant: 'outline' as const },
  };

  const config = typeConfig[serviceType as keyof typeof typeConfig] || typeConfig.both;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function ReferencesTable() {
  const { data: references, isLoading, error } = useQuery({
    queryKey: ['references'],
    queryFn: () => getReferences({ limit: 50 }),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">Cargando referencias...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-sm text-muted-foreground">
          Error al cargar las referencias. Por favor, intenta de nuevo.
        </div>
      </Card>
    );
  }

  if (!references || references.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-sm font-medium">No hay referencias</div>
          <div className="text-sm text-muted-foreground mt-1">
            Crea tu primera referencia para comenzar
          </div>
          <Button asChild className="mt-4">
            <Link href="/home/references/create">
              Crear Primera Referencia
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Referencia</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo Servicio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {references.map((reference) => (
            <TableRow key={reference.id}>
              <TableCell className="font-medium">
                {reference.reference_number}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{reference.client_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {reference.sample_description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getServiceTypeBadge(reference.service_type)}
              </TableCell>
              <TableCell>
                {getStatusBadge(reference.status)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {reference.location}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(reference.created_at).toLocaleDateString('es-ES')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/home/references/${reference.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/api/references/${reference.id}/certificate`} target="_blank">
                      <FileText className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/home/references/${reference.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}