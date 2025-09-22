const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hvndtryxhrkvvlwjwpls.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bmR0cnl4aHJrdnZsd2p3cGxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU1ODUyMCwiZXhwIjoyMDc0MTM0NTIwfQ.jjltLfXrC6PK75KpledTDaM8kFexLJiPbr50T5ArVfc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedMinimalData() {
  console.log('🌱 Starting minimal demo data seeding...');

  try {
    // Insert minimal service reference
    console.log('📝 Inserting service reference...');
    const { data: refData, error: refError } = await supabase
      .from('service_references')
      .insert({
        reference_number: 'REF-2025-TEST-001',
        client_name: 'Cliente de Prueba',
        service_type: 'both'
      })
      .select()
      .single();

    if (refError) {
      console.error('❌ Reference error:', refError);
      return;
    }

    console.log('✅ Service reference created:', refData.id);

    // Insert minimal operation
    console.log('⚙️ Inserting operation...');
    const { data: opData, error: opError } = await supabase
      .from('operations')
      .insert({
        reference_id: refData.id,
        operation_type: 'muestreo',
        status: 'completed'
      })
      .select()
      .single();

    if (opError) {
      console.error('❌ Operation error:', opError);
      return;
    }

    console.log('✅ Operation created:', opData.id);

    // Insert minimal lab analysis
    console.log('🧪 Inserting lab analysis...');
    const { data: labData, error: labError } = await supabase
      .from('lab_analysis')
      .insert({
        reference_id: refData.id,
        status: 'completed',
        results: {
          "humedad": {"value": 8.2, "unit": "%"},
          "cenizas": {"value": 12.5, "unit": "%"}
        }
      })
      .select()
      .single();

    if (labError) {
      console.error('❌ Lab analysis error:', labError);
      return;
    }

    console.log('✅ Lab analysis created:', labData.id);
    console.log('🎉 Minimal demo data seeded successfully!');

    // Verify data was inserted
    const { data: verifyData, error: verifyError } = await supabase
      .from('service_references')
      .select('reference_number, client_name, status')
      .eq('id', refData.id);

    if (verifyError) {
      console.error('❌ Verification error:', verifyError);
    } else {
      console.log('✅ Verification successful:', verifyData);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

console.log('🎯 Minimal Demo Data Seeder - Incolab System\n');
seedMinimalData();