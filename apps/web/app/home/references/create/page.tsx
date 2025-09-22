import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { CreateReferenceForm } from './components/create-reference-form';

export default function CreateReferencePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Referencia</h1>
        <p className="text-muted-foreground">
          Crea una nueva referencia de servicio para Incolab
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
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