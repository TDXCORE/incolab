import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = getSupabaseServerClient();

    console.log('🌱 Starting demo data seeding...');

    // Clear existing demo data first
    console.log('🧹 Clearing existing demo data...');
    await supabase.from('lab_analysis').delete().like('id', 'lab%');
    await supabase.from('operations').delete().like('id', 'op%');
    await supabase.from('service_references').delete().like('reference_number', 'REF-2025-%');

    console.log('📝 Inserting service references...');
    const { error: referencesError } = await supabase
      .from('service_references')
      .insert([
        {
          id: 'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86',
          reference_number: 'REF-2025-001',
          client_name: 'Minera El Cerrejón S.A.',
          client_contact: 'carlos.rodriguez@cerrejon.com',
          service_type: 'both',
          sample_description: 'Carbón bituminoso para análisis completo de calidad y certificación de cantidad para exportación',
          location: 'Mina El Cerrejón, La Guajira',
          status: 'completed',
          created_at: '2025-01-15T08:30:00.000Z'
        },
        {
          id: 'fc603d39-eece-4d77-986f-30163d78e349',
          reference_number: 'REF-2025-002',
          client_name: 'Industria Carboquímica XYZ Ltda.',
          client_contact: 'maria.gonzalez@carboquimica.com',
          service_type: 'quality_analysis',
          sample_description: 'Biomasa pelletizada para evaluación de poder calorífico y contenido de cenizas',
          location: 'Planta Industrial Bogotá, Cundinamarca',
          status: 'completed',
          created_at: '2025-01-18T14:15:00.000Z'
        },
        {
          id: '86816cb9-443d-45d0-8aa4-7adb9c6d54ff',
          reference_number: 'REF-2025-003',
          client_name: 'Drummond Company Inc.',
          client_contact: 'j.patterson@drummondco.com',
          service_type: 'quantity_certification',
          sample_description: 'Carbón térmico para exportación - certificación de cantidad y calidad básica',
          location: 'Puerto de Ciénaga, Magdalena',
          status: 'in_progress',
          created_at: '2025-01-22T06:00:00.000Z'
        },
        {
          id: 'b7f23456-789a-4bcd-9e01-23456789abcd',
          reference_number: 'REF-2025-004',
          client_name: 'Carbones del Caribe S.A.S.',
          client_contact: 'ana.martinez@carbonescaribe.com',
          service_type: 'both',
          sample_description: 'Carbón térmico nacional para análisis de combustibilidad y certificación',
          location: 'Mina La Jagua, Cesar',
          status: 'pending',
          created_at: '2025-01-22T10:30:00.000Z'
        },
        {
          id: 'c8e34567-890b-4cde-af02-3456789bcdef',
          reference_number: 'REF-2025-005',
          client_name: 'Ecopetrol S.A.',
          client_contact: 'luis.silva@ecopetrol.com.co',
          service_type: 'quality_analysis',
          sample_description: 'Coque de petróleo para análisis elemental y poder calorífico',
          location: 'Refinería de Barrancabermeja, Santander',
          status: 'pending',
          created_at: '2025-01-22T13:45:00.000Z'
        },
        {
          id: 'd9f45678-901c-4def-b023-456789cdefab',
          reference_number: 'REF-2025-006',
          client_name: 'Grupo Prodeco (Glencore)',
          client_contact: 'roberto.perez@prodeco.com.co',
          service_type: 'both',
          sample_description: 'Carbón metalúrgico para análisis de calidad y certificación de embarque',
          location: 'Mina Calenturitas, Cesar',
          status: 'pending',
          created_at: '2025-01-22T16:20:00.000Z'
        }
      ]);

    if (referencesError) {
      throw referencesError;
    }

    console.log('⚙️ Inserting operations...');
    const { error: operationsError } = await supabase
      .from('operations')
      .insert([
        {
          id: 'op001',
          reference_id: 'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86',
          operation_type: 'muestreo',
          assigned_operator: 'Carlos Mendoza',
          status: 'completed',
          scheduled_date: '2025-01-15T10:00:00.000Z',
          completed_date: '2025-01-15T12:30:00.000Z',
          notes: 'Muestreo completo realizado según protocolo ASTM D2013. Muestra representativa obtenida.',
          created_at: '2025-01-15T08:30:00.000Z'
        },
        {
          id: 'op002',
          reference_id: 'fc603d39-eece-4d77-986f-30163d78e349',
          operation_type: 'muestreo',
          assigned_operator: 'Andrea López',
          status: 'completed',
          scheduled_date: '2025-01-18T16:00:00.000Z',
          completed_date: '2025-01-18T17:45:00.000Z',
          notes: 'Muestreo de biomasa pelletizada completado. Muestra homogénea obtenida.',
          created_at: '2025-01-18T14:15:00.000Z'
        },
        {
          id: 'op003',
          reference_id: '86816cb9-443d-45d0-8aa4-7adb9c6d54ff',
          operation_type: 'muestreo',
          assigned_operator: 'Carlos Mendoza',
          status: 'in_progress',
          scheduled_date: '2025-01-22T08:00:00.000Z',
          completed_date: null,
          notes: 'En puerto realizando muestreo. Proceso al 60%. Muestra de barcaza completada.',
          created_at: '2025-01-22T06:00:00.000Z'
        },
        {
          id: 'op004',
          reference_id: 'b7f23456-789a-4bcd-9e01-23456789abcd',
          operation_type: 'muestreo',
          assigned_operator: null,
          status: 'pending',
          scheduled_date: '2025-01-23T09:00:00.000Z',
          completed_date: null,
          notes: 'Pendiente asignación de operador y coordinación de acceso a mina.',
          created_at: '2025-01-22T10:30:00.000Z'
        },
        {
          id: 'op005',
          reference_id: 'c8e34567-890b-4cde-af02-3456789bcdef',
          operation_type: 'muestreo',
          assigned_operator: 'Andrea López',
          status: 'assigned',
          scheduled_date: '2025-01-23T14:00:00.000Z',
          completed_date: null,
          notes: 'Asignado a Andrea López. Coordinando acceso a refinería.',
          created_at: '2025-01-22T13:45:00.000Z'
        },
        {
          id: 'op006',
          reference_id: 'd9f45678-901c-4def-b023-456789cdefab',
          operation_type: 'muestreo',
          assigned_operator: 'Carlos Mendoza',
          status: 'urgent',
          scheduled_date: '2025-01-22T18:00:00.000Z',
          completed_date: null,
          notes: 'URGENTE - Asignado a Carlos Mendoza. Debe completarse antes de medianoche.',
          created_at: '2025-01-22T16:20:00.000Z'
        }
      ]);

    if (operationsError) {
      throw operationsError;
    }

    console.log('🧪 Inserting lab analysis...');
    const { error: labError } = await supabase
      .from('lab_analysis')
      .insert([
        {
          id: 'lab001',
          reference_id: 'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86',
          assigned_analyst: 'Dr. Patricia Morales',
          status: 'completed',
          sample_received_date: '2025-01-15T13:00:00.000Z',
          analysis_start_date: '2025-01-16T08:00:00.000Z',
          analysis_completion_date: '2025-01-17T16:00:00.000Z',
          moisture_content: 8.2,
          ash_content: 12.5,
          volatile_matter: 35.8,
          fixed_carbon: 43.5,
          sulfur_content: 0.65,
          calorific_value: 6250.0,
          lab_notes: 'Análisis completo realizado. Carbón de excelente calidad para exportación.',
          created_at: '2025-01-15T08:30:00.000Z'
        },
        {
          id: 'lab002',
          reference_id: 'fc603d39-eece-4d77-986f-30163d78e349',
          assigned_analyst: 'Ing. Roberto Castillo',
          status: 'completed',
          sample_received_date: '2025-01-18T18:00:00.000Z',
          analysis_start_date: '2025-01-19T09:00:00.000Z',
          analysis_completion_date: '2025-01-20T15:30:00.000Z',
          moisture_content: 10.5,
          ash_content: 4.2,
          volatile_matter: 78.3,
          fixed_carbon: 7.0,
          sulfur_content: 0.08,
          calorific_value: 4850.0,
          lab_notes: 'Biomasa de alta calidad. Bajo contenido de azufre ideal para co-combustión.',
          created_at: '2025-01-18T14:15:00.000Z'
        },
        {
          id: 'lab003',
          reference_id: '86816cb9-443d-45d0-8aa4-7adb9c6d54ff',
          assigned_analyst: 'Dr. Patricia Morales',
          status: 'in_analysis',
          sample_received_date: null,
          analysis_start_date: null,
          analysis_completion_date: null,
          moisture_content: null,
          ash_content: null,
          volatile_matter: null,
          fixed_carbon: null,
          sulfur_content: null,
          calorific_value: null,
          lab_notes: 'Esperando muestra del puerto. Análisis programado para inicio inmediato.',
          created_at: '2025-01-22T06:00:00.000Z'
        },
        {
          id: 'lab004',
          reference_id: 'b7f23456-789a-4bcd-9e01-23456789abcd',
          assigned_analyst: null,
          status: 'waiting_sample',
          sample_received_date: null,
          analysis_start_date: null,
          analysis_completion_date: null,
          moisture_content: null,
          ash_content: null,
          volatile_matter: null,
          fixed_carbon: null,
          sulfur_content: null,
          calorific_value: null,
          lab_notes: 'Esperando recepción de muestra de operaciones.',
          created_at: '2025-01-22T10:30:00.000Z'
        },
        {
          id: 'lab005',
          reference_id: 'c8e34567-890b-4cde-af02-3456789bcdef',
          assigned_analyst: 'Ing. Roberto Castillo',
          status: 'waiting_sample',
          sample_received_date: null,
          analysis_start_date: null,
          analysis_completion_date: null,
          moisture_content: null,
          ash_content: null,
          volatile_matter: null,
          fixed_carbon: null,
          sulfur_content: null,
          calorific_value: null,
          lab_notes: 'Analista asignado. Esperando muestra de refinería.',
          created_at: '2025-01-22T13:45:00.000Z'
        },
        {
          id: 'lab006',
          reference_id: 'd9f45678-901c-4def-b023-456789cdefab',
          assigned_analyst: 'Dr. Patricia Morales',
          status: 'waiting_sample',
          sample_received_date: null,
          analysis_start_date: null,
          analysis_completion_date: null,
          moisture_content: null,
          ash_content: null,
          volatile_matter: null,
          fixed_carbon: null,
          sulfur_content: null,
          calorific_value: null,
          lab_notes: 'URGENTE - Dr. Morales en standby para análisis inmediato al recibir muestra.',
          created_at: '2025-01-22T16:20:00.000Z'
        }
      ]);

    if (labError) {
      throw labError;
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully!',
      summary: {
        references: 6,
        operations: 6,
        lab_analysis: 6
      }
    });

  } catch (error) {
    console.error('Error seeding demo data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}