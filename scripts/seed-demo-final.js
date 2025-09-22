const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hvndtryxhrkvvlwjwpls.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bmR0cnl4aHJrdnZsd2p3cGxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU1ODUyMCwiZXhwIjoyMDc0MTM0NTIwfQ.jjltLfXrC6PK75KpledTDaM8kFexLJiPbr50T5ArVfc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDemoData() {
  console.log('🌱 Starting demo data seeding (auto-generated UUIDs)...');

  try {
    // Clear existing demo data first
    console.log('🧹 Clearing existing demo data...');
    await supabase.from('lab_analysis').delete().like('reference_id', '%');
    await supabase.from('operations').delete().like('reference_id', '%');
    await supabase.from('service_references').delete().like('reference_number', 'REF-2025-%');

    // Insert service references (let DB generate UUIDs)
    console.log('📝 Inserting service references...');
    const { data: references, error: referencesError } = await supabase
      .from('service_references')
      .insert([
        {
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
          reference_number: 'REF-2025-006',
          client_name: 'Grupo Prodeco (Glencore)',
          client_contact: 'roberto.perez@prodeco.com.co',
          service_type: 'both',
          sample_description: 'Carbón metalúrgico para análisis de calidad y certificación de embarque',
          location: 'Mina Calenturitas, Cesar',
          status: 'pending',
          created_at: '2025-01-22T16:20:00.000Z'
        }
      ])
      .select();

    if (referencesError) {
      console.error('❌ References error:', referencesError);
      throw referencesError;
    }

    console.log(`✅ ${references.length} service references created`);

    // Insert operations for each reference
    console.log('⚙️ Inserting operations...');
    const operationsData = [
      {
        reference_id: references[0].id,
        operation_type: 'muestreo',
        status: 'completed',
        started_at: '2025-01-15T10:00:00.000Z',
        completed_at: '2025-01-15T12:30:00.000Z',
        notes: 'Muestreo completo realizado según protocolo ASTM D2013. Muestra representativa obtenida. Operador: Carlos Mendoza',
        created_at: '2025-01-15T08:30:00.000Z'
      },
      {
        reference_id: references[1].id,
        operation_type: 'muestreo',
        status: 'completed',
        started_at: '2025-01-18T16:00:00.000Z',
        completed_at: '2025-01-18T17:45:00.000Z',
        notes: 'Muestreo de biomasa pelletizada completado. Muestra homogénea obtenida. Operador: Andrea López',
        created_at: '2025-01-18T14:15:00.000Z'
      },
      {
        reference_id: references[2].id,
        operation_type: 'muestreo',
        status: 'in_progress',
        started_at: '2025-01-22T08:00:00.000Z',
        completed_at: null,
        notes: 'En puerto realizando muestreo. Proceso al 60%. Muestra de barcaza completada. Operador: Carlos Mendoza',
        created_at: '2025-01-22T06:00:00.000Z'
      },
      {
        reference_id: references[3].id,
        operation_type: 'muestreo',
        status: 'pending',
        started_at: null,
        completed_at: null,
        notes: 'Pendiente asignación de operador y coordinación de acceso a mina.',
        created_at: '2025-01-22T10:30:00.000Z'
      },
      {
        reference_id: references[4].id,
        operation_type: 'muestreo',
        status: 'pending',
        started_at: null,
        completed_at: null,
        notes: 'Asignado a Andrea López. Coordinando acceso a refinería.',
        created_at: '2025-01-22T13:45:00.000Z'
      },
      {
        reference_id: references[5].id,
        operation_type: 'muestreo',
        status: 'pending',
        started_at: null,
        completed_at: null,
        notes: 'URGENTE - Asignado a Carlos Mendoza. Debe completarse antes de medianoche.',
        created_at: '2025-01-22T16:20:00.000Z'
      }
    ];

    const { data: operations, error: operationsError } = await supabase
      .from('operations')
      .insert(operationsData)
      .select();

    if (operationsError) {
      console.error('❌ Operations error:', operationsError);
      throw operationsError;
    }

    console.log(`✅ ${operations.length} operations created`);

    // Insert lab analysis for each reference
    console.log('🧪 Inserting lab analysis...');
    const labAnalysisData = [
      {
        reference_id: references[0].id,
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
        reference_id: references[1].id,
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
        reference_id: references[2].id,
        status: 'in_analysis',
        sample_received_at: null,
        started_at: null,
        completed_at: null,
        results: null,
        notes: 'Esperando muestra del puerto. Dr. Patricia Morales asignada para análisis inmediato.',
        created_at: '2025-01-22T06:00:00.000Z'
      },
      {
        reference_id: references[3].id,
        status: 'waiting_sample',
        sample_received_at: null,
        started_at: null,
        completed_at: null,
        results: null,
        notes: 'Esperando recepción de muestra de operaciones.',
        created_at: '2025-01-22T10:30:00.000Z'
      },
      {
        reference_id: references[4].id,
        status: 'waiting_sample',
        sample_received_at: null,
        started_at: null,
        completed_at: null,
        results: null,
        notes: 'Ing. Roberto Castillo asignado. Esperando muestra de refinería.',
        created_at: '2025-01-22T13:45:00.000Z'
      },
      {
        reference_id: references[5].id,
        status: 'waiting_sample',
        sample_received_at: null,
        started_at: null,
        completed_at: null,
        results: null,
        notes: 'URGENTE - Dr. Patricia Morales en standby para análisis inmediato al recibir muestra.',
        created_at: '2025-01-22T16:20:00.000Z'
      }
    ];

    const { data: labAnalysis, error: labError } = await supabase
      .from('lab_analysis')
      .insert(labAnalysisData)
      .select();

    if (labError) {
      console.error('❌ Lab analysis error:', labError);
      throw labError;
    }

    console.log(`✅ ${labAnalysis.length} lab analysis records created`);

    console.log('🎉 Demo data seeded successfully!');
    console.log('📊 Summary:');
    console.log(`  - ${references.length} service references created`);
    console.log(`  - ${operations.length} operations created`);
    console.log(`  - ${labAnalysis.length} lab analysis records created`);
    console.log('  - Mix of completed, in_progress, and pending statuses');
    console.log('  - Realistic client data from Colombian mining industry');

    // Verify final state
    console.log('\n🔍 Verification:');
    const { data: finalData, error: finalError } = await supabase
      .from('service_references')
      .select('reference_number, client_name, status')
      .order('reference_number');

    if (finalError) {
      console.error('❌ Final verification error:', finalError);
    } else {
      console.log('✅ Final verification successful:');
      finalData.forEach(ref => {
        console.log(`  - ${ref.reference_number}: ${ref.client_name} (${ref.status})`);
      });
    }

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  }
}

console.log('🎯 Demo Data Seeder - Incolab System (Final Version)');
console.log('Using auto-generated UUIDs with service role access\n');

seedDemoData();