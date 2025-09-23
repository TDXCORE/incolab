import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { CreateReferenceForm } from './components/create-reference-form';

export default function CreateReferencePage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Nueva Referencia</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Crea una nueva referencia de servicio para Incolab
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Referencia</CardTitle>
            <CardDescription>
              Completa los datos del servicio y cliente. Los campos marcados con * son obligatorios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateReferenceForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}