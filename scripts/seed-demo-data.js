const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hsfwmzwspkbkmzwmpzmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzZndtend3c3BrYmttenttcHptaSIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3Mzc1MTMzMzQsImV4cCI6MjA1MzA4OTMzNH0.CsP_6GtLdg5TfUaJ3PSPUQ96JhcDdHH8i5nh3CG_Lns';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDemoData() {
  console.log('🌱 Starting demo data seeding...');

  try {
    // Clear existing data first
    console.log('🧹 Clearing existing data...');
    await supabase.from('lab_analysis').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('operations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('service_references').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('📝 Inserting service references...');
    // Insert service references
    const { error: referencesError } = await supabase
      .from('service_references')
      .insert([
        {
          id: 'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86',
          reference_number: 'REF-2025-001',
          client_name: 'Minera El Cerrejón S.A.',
          client_contact: 'Carlos Rodríguez',
          client_email: 'carlos.rodriguez@cerrejon.com',
          service_type: 'both',
          sample_description: 'Carbón bituminoso para análisis completo de calidad y certificación de cantidad para exportación',
          location: 'Mina El Cerrejón, La Guajira',
          sample_weight: 5000.0,
          urgent: false,
          special_instructions: 'Análisis completo proximate y ultimate, certificación para puerto de embarque',
          status: 'completed',
          created_at: '2025-01-15T08:30:00.000Z'
        },
        {
          id: 'fc603d39-eece-4d77-986f-30163d78e349',
          reference_number: 'REF-2025-002',
          client_name: 'Industria Carboquímica XYZ Ltda.',
          client_contact: 'María González',
          client_email: 'maria.gonzalez@carboquimica.com',
          service_type: 'quality_analysis',
          sample_description: 'Biomasa pelletizada para evaluación de poder calorífico y contenido de cenizas',
          location: 'Planta Industrial Bogotá, Cundinamarca',
          sample_weight: 1200.0,
          urgent: false,
          special_instructions: 'Evaluar viabilidad para mezcla con carbón térmico',
          status: 'completed',
          created_at: '2025-01-18T14:15:00.000Z'
        },
        {
          id: '86816cb9-443d-45d0-8aa4-7adb9c6d54ff',
          reference_number: 'REF-2025-003',
          client_name: 'Drummond Company Inc.',
          client_contact: 'James Patterson',
          client_email: 'j.patterson@drummondco.com',
          service_type: 'quantity_certification',
          sample_description: 'Carbón térmico para exportación - certificación de cantidad y calidad básica',
          location: 'Puerto de Ciénaga, Magdalena',
          sample_weight: 8500.0,
          urgent: true,
          special_instructions: 'URGENTE: Buque zarpa mañana, requiere certificado inmediato',
          status: 'in_progress',
          created_at: '2025-01-22T06:00:00.000Z'
        },
        {
          id: 'b7f23456-789a-4bcd-9e01-23456789abcd',
          reference_number: 'REF-2025-004',
          client_name: 'Carbones del Caribe S.A.S.',
          client_contact: 'Ana Martínez',
          client_email: 'ana.martinez@carbonescaribe.com',
          service_type: 'both',
          sample_description: 'Carbón térmico nacional para análisis de combustibilidad y certificación',
          location: 'Mina La Jagua, Cesar',
          sample_weight: 3200.0,
          urgent: false,
          special_instructions: 'Muestra representativa de lote de 50,000 toneladas',
          status: 'pending',
          created_at: '2025-01-22T10:30:00.000Z'
        },
        {
          id: 'c8e34567-890b-4cde-af02-3456789bcdef',
          reference_number: 'REF-2025-005',
          client_name: 'Ecopetrol S.A.',
          client_contact: 'Luis Fernando Silva',
          client_email: 'luis.silva@ecopetrol.com.co',
          service_type: 'quality_analysis',
          sample_description: 'Coque de petróleo para análisis elemental y poder calorífico',
          location: 'Refinería de Barrancabermeja, Santander',
          sample_weight: 800.0,
          urgent: false,
          special_instructions: 'Análisis para proceso de co-combustión en termoeléctricas',
          status: 'pending',
          created_at: '2025-01-22T13:45:00.000Z'
        },
        {
          id: 'd9f45678-901c-4def-b023-456789cdefab',
          reference_number: 'REF-2025-006',
          client_name: 'Grupo Prodeco (Glencore)',
          client_contact: 'Roberto Pérez',
          client_email: 'roberto.perez@prodeco.com.co',
          service_type: 'both',
          sample_description: 'Carbón metalúrgico para análisis de calidad y certificación de embarque',
          location: 'Mina Calenturitas, Cesar',
          sample_weight: 6800.0,
          urgent: true,
          special_instructions: 'URGENTE: Contrato internacional requiere certificación en 24 horas',
          status: 'pending',
          created_at: '2025-01-22T16:20:00.000Z'
        }
      ]);

    if (referencesError) {
      console.error('❌ Error inserting references:', referencesError);
      return;
    }

    console.log('⚙️ Inserting operations...');
    // Insert operations
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
      console.error('❌ Error inserting operations:', operationsError);
      return;
    }

    console.log('🧪 Inserting lab analysis...');
    // Insert lab analysis
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
      console.error('❌ Error inserting lab analysis:', labError);
      return;
    }

    console.log('✅ Demo data seeded successfully!');
    console.log('📊 Summary:');
    console.log('  - 6 service references created');
    console.log('  - 6 operations created');
    console.log('  - 6 lab analysis records created');
    console.log('  - Mix of completed, in_progress, and pending statuses');
    console.log('  - Realistic client data from Colombian mining industry');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  }
}

seedDemoData();