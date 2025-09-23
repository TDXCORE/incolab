'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { getSupabaseAdminClient } from '@kit/supabase/browser-client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

// Schema de validación para el formulario
const editReferenceSchema = z.object({
  client_name: z.string().min(1, 'El nombre del cliente es requerido'),
  client_contact: z.string().optional(),
  service_type: z.enum(['quality_analysis', 'quantity_certification', 'both', 'custom'], {
    required_error: 'Selecciona un tipo de servicio',
  }),
  sample_description: z.string().min(1, 'La descripción de la muestra es requerida'),
  location: z.string().min(1, 'La ubicación es requerida'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'on_hold']).default('pending'),
  notes: z.string().optional(),
});

type EditReferenceFormData = z.infer<typeof editReferenceSchema>;

export default function EditReferencePage() {
  const router = useRouter();
  const params = useParams();
  const referenceId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);

  const { data: reference, isLoading: isLoadingReference, error } = useQuery({
    queryKey: ['reference', referenceId],
    queryFn: async () => {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from('service_references')
        .select('*')
        .eq('id', referenceId)
        .single();

      if (error) {
        throw new Error(`Error fetching reference: ${error.message}`);
      }

      return data;
    },
  });

  const form = useForm<EditReferenceFormData>({
    resolver: zodResolver(editReferenceSchema),
    defaultValues: {
      service_type: 'both',
      priority: 'normal',
      status: 'pending',
    },
    values: reference ? {
      client_name: reference.client_name || '',
      client_contact: reference.client_contact || '',
      service_type: reference.service_type || 'both',
      sample_description: reference.sample_description || '',
      location: reference.location || '',
      priority: reference.priority || 'normal',
      status: reference.status || 'pending',
      notes: reference.notes || '',
    } : undefined,
  });

  const onSubmit = async (data: EditReferenceFormData) => {
    setIsLoading(true);

    try {
      const supabase = getSupabaseAdminClient();

      const { data: updatedReference, error } = await supabase
        .from('service_references')
        .update({
          client_name: data.client_name,
          client_contact: data.client_contact || null,
          service_type: data.service_type,
          sample_description: data.sample_description,
          location: data.location,
          priority: data.priority,
          status: data.status,
          notes: data.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', referenceId)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating reference: ${error.message}`);
      }

      toast.success('Referencia actualizada exitosamente');
      router.push(`/home/references/${referenceId}`);
    } catch (error) {
      console.error('Error updating reference:', error);
      toast.error('Error al actualizar la referencia. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingReference) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-muted-foreground">Cargando referencia...</div>
      </div>
    );
  }

  if (error || !reference) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="text-sm text-muted-foreground">
          No se pudo cargar la referencia
        </div>
        <Button asChild variant="outline">
          <Link href="/home/references">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Referencias
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/home/references/${referenceId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Editar Referencia {reference.reference_number}
          </h1>
          <p className="text-muted-foreground">
            Modifica los detalles de la referencia de servicio
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Información del Cliente */}
          <div className="space-y-4">
            <div className="border-b border-border pb-2">
              <h3 className="text-lg font-medium">Información del Cliente</h3>
            </div>

            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Cliente *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Empresa ABC S.A." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="Email o teléfono de contacto" {...field} />
                  </FormControl>
                  <FormDescription>
                    Email o teléfono de contacto del cliente (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Información del Servicio */}
          <div className="space-y-4">
            <div className="border-b border-border pb-2">
              <h3 className="text-lg font-medium">Información del Servicio</h3>
            </div>

            <FormField
              control={form.control}
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Servicio *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de servicio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="quality_analysis">Análisis de Calidad</SelectItem>
                      <SelectItem value="quantity_certification">Certificación de Cantidad</SelectItem>
                      <SelectItem value="both">Ambos Servicios</SelectItem>
                      <SelectItem value="custom">Servicio Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sample_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción de la Muestra *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Carbón bituminoso para análisis completo de calidad..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe detalladamente qué se va a analizar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Mina El Cerrejón, La Guajira" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ubicación donde se realizará el muestreo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridad</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la prioridad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in_progress">En Proceso</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                      <SelectItem value="on_hold">En Espera</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Notas adicionales */}
          <div className="space-y-4">
            <div className="border-b border-border pb-2">
              <h3 className="text-lg font-medium">Información Adicional</h3>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observaciones adicionales, instrucciones especiales, etc..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Cualquier información adicional relevante para el servicio
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Actualizando...' : 'Actualizar Referencia'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}