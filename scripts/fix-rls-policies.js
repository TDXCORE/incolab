const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hvndtryxhrkvvlwjwpls.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bmR0cnl4aHJrdnZsd2p3cGxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU1ODUyMCwiZXhwIjoyMDc0MTM0NTIwfQ.jjltLfXrC6PK75KpledTDaM8kFexLJiPbr50T5ArVfc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies for public access...')

  try {
    // Drop existing restrictive policies
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Referencias visibles para usuarios autenticados" ON service_references;',
      'DROP POLICY IF EXISTS "Operaciones visibles para usuarios autenticados" ON operations;',
      'DROP POLICY IF EXISTS "Análisis visibles para usuarios autenticados" ON lab_analysis;',
      'DROP POLICY IF EXISTS "Enable read access for authenticated users" ON service_references;',
      'DROP POLICY IF EXISTS "Enable read access for authenticated users" ON operations;',
      'DROP POLICY IF EXISTS "Enable read access for authenticated users" ON lab_analysis;'
    ]

    for (const sql of dropPolicies) {
      const { error } = await supabase.rpc('exec', { sql })
      if (error && !error.message.includes('does not exist')) {
        console.log('Warning dropping policy:', error.message)
      }
    }

    // Create permissive policies for demo
    const createPolicies = [
      'CREATE POLICY "Allow public read access" ON service_references FOR SELECT TO public USING (true);',
      'CREATE POLICY "Allow public read access" ON operations FOR SELECT TO public USING (true);',
      'CREATE POLICY "Allow public read access" ON lab_analysis FOR SELECT TO public USING (true);'
    ]

    for (const sql of createPolicies) {
      const { error } = await supabase.rpc('exec', { sql })
      if (error) {
        console.log('Error creating policy:', error.message)
      } else {
        console.log('✅ Created policy:', sql.substring(0, 50) + '...')
      }
    }

    console.log('🎉 RLS policies updated successfully!')

  } catch (error) {
    console.error('💥 Failed to update policies:', error)
  }
}

// Alternative: Just disable RLS temporarily for development
async function disableRLSForDev() {
  console.log('🔧 Temporarily disabling RLS for development...')

  try {
    const tables = ['service_references', 'operations', 'lab_analysis']

    for (const table of tables) {
      const { error } = await supabase.rpc('exec', {
        sql: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`
      })
      if (error) {
        console.log(`Error disabling RLS on ${table}:`, error.message)
      } else {
        console.log(`✅ Disabled RLS on ${table}`)
      }
    }

    console.log('🎉 RLS disabled for development!')

  } catch (error) {
    console.error('💥 Failed to disable RLS:', error)
  }
}

// Execute if called directly
if (require.main === module) {
  disableRLSForDev()
}

module.exports = { fixRLSPolicies, disableRLSForDev }