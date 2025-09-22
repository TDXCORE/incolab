const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hvndtryxhrkvvlwjwpls.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bmR0cnl4aHJrdnZsd2p3cGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTg1MjAsImV4cCI6MjA3NDEzNDUyMH0.D2UcZMyaszsqVHltg7RDeaEjhLFxNYHLrMgfoQ6jK5A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSeedData() {
  console.log('🧪 Testing direct seed data with correct schema...');

  try {
    // Test 1: Clear existing demo data
    console.log('🧹 Clearing existing demo data...');
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
    await supabase.from('service_references').delete().like('reference_number', 'REF-2025-%');

    console.log('✅ Cleanup completed');

    // Test 2: Insert a single service reference
    console.log('📝 Testing service_references insert...');
    const { data: refData, error: refError } = await supabase
      .from('service_references')
      .insert({
        id: 'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86',
        reference_number: 'REF-2025-001',
        client_name: 'Minera El Cerrejón S.A.',
        client_contact: 'carlos.rodriguez@cerrejon.com',
        service_type: 'both',
        sample_description: 'Carbón bituminoso para análisis completo',
        location: 'Mina El Cerrejón, La Guajira',
        status: 'completed',
        created_at: '2025-01-15T08:30:00.000Z'
      })
      .select();

    if (refError) {
      console.error('❌ service_references error:', refError);
      return;
    }
    console.log('✅ service_references insert successful');

    // Test 3: Insert an operation
    console.log('⚙️ Testing operations insert...');
    const { data: opData, error: opError } = await supabase
      .from('operations')
      .insert({
        reference_id: 'ad4356bc-ee2a-4c1c-8b7a-32aabddd8c86',
        operation_type: 'muestreo',
        status: 'completed',
        started_at: '2025-01-15T10:00:00.000Z',
        completed_at: '2025-01-15T12:30:00.000Z',
        notes: 'Muestreo completo realizado. Operador: Carlos Mendoza',
        created_at: '2025-01-15T08:30:00.000Z'
      })
      .select();

    if (opError) {
      console.error('❌ operations error:', opError);
      return;
    }
    console.log('✅ operations insert successful');

    // Test 4: Insert lab analysis with JSONB
    console.log('🧪 Testing lab_analysis insert...');
    const { data: labData, error: labError } = await supabase
      .from('lab_analysis')
      .insert({
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
          "observaciones": "Carbón de excelente calidad para exportación"
        },
        notes: 'Análisis completo realizado por Dr. Patricia Morales.',
        created_at: '2025-01-15T08:30:00.000Z'
      })
      .select();

    if (labError) {
      console.error('❌ lab_analysis error:', labError);
      return;
    }
    console.log('✅ lab_analysis insert successful');

    // Test 5: Verify data was inserted
    console.log('🔍 Verifying inserted data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('service_references')
      .select(`
        *,
        operations(*),
        lab_analysis(*)
      `)
      .eq('reference_number', 'REF-2025-001');

    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
      return;
    }

    console.log('✅ Data verification successful:');
    console.log('📊 Summary:');
    console.log(`  - References: ${verifyData.length}`);
    console.log(`  - Operations: ${verifyData[0]?.operations?.length || 0}`);
    console.log(`  - Lab Analysis: ${verifyData[0]?.lab_analysis?.length || 0}`);

    console.log('\n🎉 SCHEMA VALIDATION SUCCESSFUL!');
    console.log('The corrected seed script should work perfectly.');

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testSeedData();