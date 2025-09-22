import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = getSupabaseServerClient();

    console.log('🌱 Starting demo data seeding...');

    // Clear existing demo data first
    console.log('🧹 Clearing existing demo data...');

    // Delete demo records by reference pattern
    const demoRefIds = [
      'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86',
      'fc603d39-eece-4d77-986f-30163d78e349',
      '86816cb9-443d-45d0-8aa4-7adb9c6d54ff',
      'b7f23456-789a-4bcd-9e01-23456789abcd',
      'c8e34567-890b-4cde-af02-3456789bcdef',
      'd9f45678-901c-4def-b023-456789cdefab'
    ];

    await supabase.from('lab_analysis').delete().in('reference_id', demoRefIds);
    await supabase.from('operations').delete().in('reference_id', demoRefIds);
    await supabase.from('service_references').delete().in('id', demoRefIds);

    // Also clear by reference number pattern
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
          reference_id: 'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86',
          operation_type: 'muestreo',
          status: 'completed',
          started_at: '2025-01-15T10:00:00.000Z',
          completed_at: '2025-01-15T12:30:00.000Z',
          notes: 'Muestreo completo realizado según protocolo ASTM D2013. Muestra representativa obtenida. Operador: Carlos Mendoza',
          created_at: '2025-01-15T08:30:00.000Z'
        },
        {
          reference_id: 'fc603d39-eece-4d77-986f-30163d78e349',
          operation_type: 'muestreo',
          status: 'completed',
          started_at: '2025-01-18T16:00:00.000Z',
          completed_at: '2025-01-18T17:45:00.000Z',
          notes: 'Muestreo de biomasa pelletizada completado. Muestra homogénea obtenida. Operador: Andrea López',
          created_at: '2025-01-18T14:15:00.000Z'
        },
        {
          reference_id: '86816cb9-443d-45d0-8aa4-7adb9c6d54ff',
          operation_type: 'muestreo',
          status: 'in_progress',
          started_at: '2025-01-22T08:00:00.000Z',
          completed_at: null,
          notes: 'En puerto realizando muestreo. Proceso al 60%. Muestra de barcaza completada. Operador: Carlos Mendoza',
          created_at: '2025-01-22T06:00:00.000Z'
        },
        {
          reference_id: 'b7f23456-789a-4bcd-9e01-23456789abcd',
          operation_type: 'muestreo',
          status: 'pending',
          started_at: null,
          completed_at: null,
          notes: 'Pendiente asignación de operador y coordinación de acceso a mina.',
          created_at: '2025-01-22T10:30:00.000Z'
        },
        {
          reference_id: 'c8e34567-890b-4cde-af02-3456789bcdef',
          operation_type: 'muestreo',
          status: 'pending',
          started_at: null,
          completed_at: null,
          notes: 'Asignado a Andrea López. Coordinando acceso a refinería.',
          created_at: '2025-01-22T13:45:00.000Z'
        },
        {
          reference_id: 'd9f45678-901c-4def-b023-456789cdefab',
          operation_type: 'muestreo',
          status: 'pending',
          started_at: null,
          completed_at: null,
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
          reference_id: 'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86',
          status: 'completed',
          sample_received_at: '2025-01-15T13:00:00.000Z',
          started_at: '2025-01-16T08:00:00.000Z',
          completed_at: '2025-01-17T16:00:00.000Z',
          results: {
            "humedad": {"value": 8.2, "unit": "%", "method": "ISO 589"},
            "cenizas": {"value": 12.5, "unit": "%", "method": "ISO 1171"},
            "azufre": {"value": 0.65, "unit": "%", "method": "ISO 19579"},
            "poder_calorifico": {"value": 6250, "unit": "kcal/kg", "method": "ISO 1928"},
            "carbono_fijo": {"value": 43.5, "unit": "%"},
            "materia_volatil": {"value": 35.8, "unit": "%"},
            "observaciones": "Carbón de excelente calidad para exportación"
          },
          notes: 'Análisis completo realizado por Dr. Patricia Morales. Carbón de excelente calidad para exportación.',
          created_at: '2025-01-15T08:30:00.000Z'
        },
        {
          reference_id: 'fc603d39-eece-4d77-986f-30163d78e349',
          status: 'completed',
          sample_received_at: '2025-01-18T18:00:00.000Z',
          started_at: '2025-01-19T09:00:00.000Z',
          completed_at: '2025-01-20T15:30:00.000Z',
          results: {
            "humedad": {"value": 10.5, "unit": "%", "method": "ISO 589"},
            "cenizas": {"value": 4.2, "unit": "%", "method": "ISO 1171"},
            "azufre": {"value": 0.08, "unit": "%", "method": "ISO 19579"},
            "poder_calorifico": {"value": 4850, "unit": "kcal/kg", "method": "ISO 1928"},
            "carbono_fijo": {"value": 7.0, "unit": "%"},
            "materia_volatil": {"value": 78.3, "unit": "%"},
            "observaciones": "Biomasa de alta calidad, bajo contenido de azufre ideal para co-combustión"
          },
          notes: 'Análisis realizado por Ing. Roberto Castillo. Biomasa de alta calidad.',
          created_at: '2025-01-18T14:15:00.000Z'
        },
        {
          reference_id: '86816cb9-443d-45d0-8aa4-7adb9c6d54ff',
          status: 'in_analysis',
          sample_received_at: null,
          started_at: null,
          completed_at: null,
          results: null,
          notes: 'Esperando muestra del puerto. Dr. Patricia Morales asignada para análisis inmediato.',
          created_at: '2025-01-22T06:00:00.000Z'
        },
        {
          reference_id: 'b7f23456-789a-4bcd-9e01-23456789abcd',
          status: 'waiting_sample',
          sample_received_at: null,
          started_at: null,
          completed_at: null,
          results: null,
          notes: 'Esperando recepción de muestra de operaciones.',
          created_at: '2025-01-22T10:30:00.000Z'
        },
        {
          reference_id: 'c8e34567-890b-4cde-af02-3456789bcdef',
          status: 'waiting_sample',
          sample_received_at: null,
          started_at: null,
          completed_at: null,
          results: null,
          notes: 'Ing. Roberto Castillo asignado. Esperando muestra de refinería.',
          created_at: '2025-01-22T13:45:00.000Z'
        },
        {
          reference_id: 'd9f45678-901c-4def-b023-456789cdefab',
          status: 'waiting_sample',
          sample_received_at: null,
          started_at: null,
          completed_at: null,
          results: null,
          notes: 'URGENTE - Dr. Patricia Morales en standby para análisis inmediato al recibir muestra.',
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