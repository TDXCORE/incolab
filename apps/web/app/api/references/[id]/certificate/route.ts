import { NextRequest, NextResponse } from 'next/server';
import { getReferenceById } from '@kit/supabase/queries/references';

/**
 * Generate and download a certificate PDF for a reference
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const referenceId = params.id;

    // Get the reference with all related data
    const reference = await getReferenceById(referenceId);

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference not found' },
        { status: 404 }
      );
    }

    // For now, we'll generate a simple HTML certificate
    // In a real implementation, you'd use a PDF library like puppeteer or jsPDF
    const certificateHtml = generateCertificateHtml(reference);

    return new NextResponse(certificateHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="certificado-${reference.reference_number}.html"`,
      },
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Error generating certificate' },
      { status: 500 }
    );
  }
}

function generateCertificateHtml(reference: any): string {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get operation and lab analysis status
  const operationStatus = reference.operations?.[0]?.status || 'pending';
  const labStatus = reference.lab_analysis?.[0]?.status || 'waiting_sample';
  const isCompleted = operationStatus === 'completed' && labStatus === 'completed';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificado ${reference.reference_number}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            background-color: #f8f9fa;
        }
        .certificate {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border: 3px solid #2563eb;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 30px;
        }
        .logo {
            font-size: 2.5em;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .title {
            font-size: 1.8em;
            color: #374151;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #6b7280;
            font-size: 1.1em;
        }
        .content {
            margin-bottom: 40px;
        }
        .reference-info {
            background: #f8fafc;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 5px solid #2563eb;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            align-items: center;
        }
        .info-label {
            font-weight: bold;
            color: #374151;
            min-width: 150px;
        }
        .info-value {
            color: #6b7280;
            flex: 1;
            text-align: right;
        }
        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-completed {
            background: #dcfce7;
            color: #166534;
        }
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        .status-in-progress {
            background: #dbeafe;
            color: #1e40af;
        }
        .operations-section, .lab-section {
            margin-bottom: 25px;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        .section-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #374151;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .section-icon {
            margin-right: 10px;
            font-size: 1.3em;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
        }
        .certification-note {
            background: #fef9e7;
            border: 1px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .certification-note.completed {
            background: #f0fdf4;
            border-color: #10b981;
        }
        @media print {
            body { background-color: white; padding: 20px; }
            .certificate { box-shadow: none; border: 2px solid #2563eb; }
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="logo">INCOLAB</div>
            <div class="title">Certificado de Servicio</div>
            <div class="subtitle">Laboratorio Acreditado ISO 17025</div>
        </div>

        <div class="content">
            <div class="reference-info">
                <div class="info-row">
                    <span class="info-label">Número de Referencia:</span>
                    <span class="info-value"><strong>${reference.reference_number}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Cliente:</span>
                    <span class="info-value">${reference.client_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tipo de Servicio:</span>
                    <span class="info-value">${getServiceTypeLabel(reference.service_type)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Descripción:</span>
                    <span class="info-value">${reference.sample_description || 'No especificada'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Ubicación:</span>
                    <span class="info-value">${reference.location || 'No especificada'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Fecha de Creación:</span>
                    <span class="info-value">${new Date(reference.created_at).toLocaleDateString('es-ES')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Estado General:</span>
                    <span class="info-value">
                        <span class="status-badge ${getStatusClass(reference.status)}">
                            ${getStatusLabel(reference.status)}
                        </span>
                    </span>
                </div>
            </div>

            <div class="operations-section">
                <div class="section-title">
                    <span class="section-icon">🚛</span>
                    Estado de Operaciones
                </div>
                <div class="info-row">
                    <span class="info-label">Estado:</span>
                    <span class="info-value">
                        <span class="status-badge ${getStatusClass(operationStatus)}">
                            ${getStatusLabel(operationStatus)}
                        </span>
                    </span>
                </div>
                ${reference.operations?.[0]?.completed_at ? `
                <div class="info-row">
                    <span class="info-label">Completado:</span>
                    <span class="info-value">${new Date(reference.operations[0].completed_at).toLocaleDateString('es-ES')}</span>
                </div>
                ` : ''}
            </div>

            <div class="lab-section">
                <div class="section-title">
                    <span class="section-icon">🔬</span>
                    Estado de Laboratorio
                </div>
                <div class="info-row">
                    <span class="info-label">Estado:</span>
                    <span class="info-value">
                        <span class="status-badge ${getStatusClass(labStatus)}">
                            ${getStatusLabel(labStatus)}
                        </span>
                    </span>
                </div>
                ${reference.lab_analysis?.[0]?.completed_at ? `
                <div class="info-row">
                    <span class="info-label">Completado:</span>
                    <span class="info-value">${new Date(reference.lab_analysis[0].completed_at).toLocaleDateString('es-ES')}</span>
                </div>
                ` : ''}
            </div>

            <div class="certification-note ${isCompleted ? 'completed' : ''}">
                ${isCompleted
                  ? `✅ <strong>Certificación Completa:</strong> Este servicio ha sido completado satisfactoriamente. Todos los análisis han sido realizados y verificados según los estándares ISO 17025.`
                  : `⏳ <strong>Certificación Pendiente:</strong> Este servicio está en proceso. El certificado final será emitido una vez completadas todas las operaciones y análisis.`
                }
            </div>
        </div>

        <div class="footer">
            <p><strong>INCOLAB - Laboratorio de Análisis</strong></p>
            <p>Acreditado bajo ISO 17025 para análisis de combustibles sólidos</p>
            <p>Generado el ${currentDate}</p>
            <p style="font-size: 0.9em; margin-top: 20px;">
                Este certificado es válido únicamente para el servicio especificado y fue generado automáticamente por el sistema Incolab.
            </p>
        </div>
    </div>

    <script>
        // Auto-print functionality
        if (window.location.search.includes('print=true')) {
            window.print();
        }
    </script>
</body>
</html>
  `;
}

function getServiceTypeLabel(type: string): string {
  const labels = {
    quality_analysis: 'Análisis de Calidad',
    quantity_certification: 'Certificación de Cantidad',
    both: 'Análisis Completo',
    custom: 'Servicio Personalizado',
  };
  return labels[type as keyof typeof labels] || type;
}

function getStatusLabel(status: string): string {
  const labels = {
    pending: 'Pendiente',
    in_progress: 'En Proceso',
    completed: 'Completado',
    cancelled: 'Cancelado',
    on_hold: 'En Espera',
    waiting_sample: 'Esperando Muestra',
    in_analysis: 'En Análisis',
    failed: 'Fallido',
    requires_retest: 'Requiere Re-análisis',
    rescheduled: 'Reprogramado',
  };
  return labels[status as keyof typeof labels] || status;
}

function getStatusClass(status: string): string {
  const classes = {
    pending: 'status-pending',
    in_progress: 'status-in-progress',
    completed: 'status-completed',
    waiting_sample: 'status-pending',
    in_analysis: 'status-in-progress',
    failed: 'status-pending',
    cancelled: 'status-pending',
    on_hold: 'status-pending',
    requires_retest: 'status-pending',
    rescheduled: 'status-pending',
  };
  return classes[status as keyof typeof classes] || 'status-pending';
}