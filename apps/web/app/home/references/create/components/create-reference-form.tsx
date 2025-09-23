'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Loader2 } from 'lucide-react';
import { getSupabaseAdminClient } from '@kit/supabase/browser-client';

// Schema de validación para el formulario
const createReferenceSchema = z.object({
  client_name: z.string().min(1, 'El nombre del cliente es requerido'),
  client_contact: z.string().optional(),
  service_type: z.enum(['quality_analysis', 'quantity_certification', 'both', 'custom'], {
    required_error: 'Selecciona un tipo de servicio',
  }),
  sample_description: z.string().min(1, 'La descripción de la muestra es requerida'),
  location: z.string().min(1, 'La ubicación es requerida'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  notes: z.string().optional(),
});

type CreateReferenceFormData = z.infer<typeof createReferenceSchema>;

export function CreateReferenceForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateReferenceFormData>({
    resolver: zodResolver(createReferenceSchema),
    defaultValues: {
      service_type: 'both',
      priority: 'normal',
    },
  });

  const onSubmit = async (data: CreateReferenceFormData) => {
    setIsLoading(true);

    try {
      const supabase = getSupabaseAdminClient();

      // Generate reference number using the database function
      const { data: refNumber, error: refError } = await supabase
        .rpc('generate_reference_number');

      if (refError) {
        throw new Error(`Error generating reference number: ${refError.message}`);
      }

      // Create the reference with the generated number
      const { data: reference, error } = await supabase
        .from('service_references')
        .insert({
          reference_number: refNumber as string,
          client_name: data.client_name,
          client_contact: data.client_contact || null,
          service_type: data.service_type,
          sample_description: data.sample_description,
          location: data.location,
          priority: data.priority,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating reference: ${error.message}`);
      }

      toast.success(`Referencia ${reference.reference_number} creada exitosamente`);
      router.push('/home/references');
    } catch (error) {
      console.error('Error creating reference:', error);

      // Show detailed error message
      let errorMessage = 'Error al crear la referencia. Por favor, intenta de nuevo.';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            {isLoading ? 'Creando...' : 'Crear Referencia'}
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
  );
}