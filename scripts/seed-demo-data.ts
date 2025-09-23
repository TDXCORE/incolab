const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hvndtryxhrkvvlwjwpls.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bmR0cnl4aHJrdnZsd2p3cGxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU1ODUyMCwiZXhwIjoyMDc0MTM0NTIwfQ.jjltLfXrC6PK75KpledTDaM8kFexLJiPbr50T5ArVfc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDemoData() {
  console.log('🌱 Starting demo data seed...')

  try {
    // 1. Clear existing data first
    console.log('🧹 Clearing existing data...')
    await supabase.from('lab_analysis').delete().like('created_at', '2025%')
    await supabase.from('operations').delete().like('created_at', '2025%')
    await supabase.from('service_references').delete().like('created_at', '2025%')

    // 2. Use fixed reference numbers
    const refNumbers = ['REF-2025-001', 'REF-2025-002', 'REF-2025-003', 'REF-2025-004', 'REF-2025-005', 'REF-2025-006']

    // 3. Crear referencias de servicio
    const { data: references, error: refError } = await supabase
      .from('service_references')
      .insert([
        {
          reference_number: refNumbers[0],
          client_name: 'Minera San Cristóbal',
          client_contact: 'carmen.rodriguez@sancristo.com',
          service_type: 'both',
          sample_description: 'Análisis de concentrado de zinc - Lote 2025-001',
          location: 'Potosí, Bolivia - Planta Concentradora',
          priority: 'high',
          status: 'completed',
          estimated_completion_date: '2025-01-25',
          actual_completion_date: '2025-09-23',
          notes: 'Muestras recibidas en excelente estado. Análisis expedito solicitado.',
          created_by: null
        },
        {
          reference_number: refNumbers[1],
          client_name: 'Compañía Minera del Sur',
          client_contact: 'jose.martinez@cms.bo',
          service_type: 'quality_analysis',
          sample_description: 'Análisis geoquímico de mineral de plata - Veta Principal',
          location: 'Oruro, Bolivia - Mina Santa Rita',
          priority: 'normal',
          status: 'in_progress',
          estimated_completion_date: '2025-01-25',
          notes: 'Requiere análisis completo de elementos traza.',
          created_by: null
        },
        {
          reference_number: refNumbers[2],
          client_name: 'Bolivian Gold Mining',
          client_contact: 'ana.lopez@bgm.com',
          service_type: 'quantity_certification',
          sample_description: 'Certificación de peso y pureza - Doré bars',
          location: 'La Paz, Bolivia - Refinería Central',
          priority: 'urgent',
          status: 'pending',
          estimated_completion_date: '2025-01-22',
          notes: 'Certificación para exportación. Documentación completa requerida.',
          created_by: null
        },
        {
          reference_number: refNumbers[3],
          client_name: 'Cooperativa Minera Itos',
          client_contact: 'ricardo.pena@itos.coop',
          service_type: 'both',
          sample_description: 'Análisis de mineral polimetálico - Pb-Zn-Ag',
          location: 'Potosí, Bolivia - Cerro Rico',
          priority: 'normal',
          status: 'in_progress',
          estimated_completion_date: '2025-01-26',
          notes: 'Muestra representativa de 500kg procesada.',
          created_by: null
        },
        {
          reference_number: refNumbers[4],
          client_name: 'Empresa Minera Huanuni',
          client_contact: 'miguel.torres@huanuni.gov.bo',
          service_type: 'quality_analysis',
          sample_description: 'Control de calidad - Concentrado de estaño',
          location: 'Oruro, Bolivia - Planta Huanuni',
          priority: 'high',
          status: 'pending',
          estimated_completion_date: '2025-01-24',
          notes: 'Análisis mensual de rutina. Requiere reporte detallado.',
          created_by: null
        },
        {
          reference_number: refNumbers[5],
          client_name: 'Minera Colquiri',
          client_contact: 'sandra.vargas@colquiri.com',
          service_type: 'both',
          sample_description: 'Análisis y certificación - Concentrado Pb-Zn',
          location: 'La Paz, Bolivia - Mina Colquiri',
          priority: 'normal',
          status: 'on_hold',
          estimated_completion_date: '2025-01-28',
          notes: 'Pendiente de documentación adicional del cliente.',
          created_by: null
        }
      ])
      .select()

    if (refError) {
      console.error('❌ Error inserting references:', refError)
      return
    }

    console.log('✅ Service references created:', references?.length)

    // 4. Crear operaciones basadas en las referencias
    if (references && references.length > 0) {
      const operations = [
        {
          reference_id: references[0].id,
          assigned_to: null,
          status: 'completed',
          assigned_at: '2025-01-15T08:00:00Z',
          started_at: '2025-01-15T09:30:00Z',
          completed_at: '2025-01-15T16:45:00Z',
          operation_type: 'muestreo',
          equipment_used: ['Muestreador automático MT-500', 'Balanza de precisión', 'Contenedores sellados'],
          sample_quantity: 15.5,
          sample_units: 'kg',
          actual_location: 'Planta Concentradora - Línea de producción A',
          weather_conditions: 'Despejado, 18°C, humedad 45%',
          environmental_notes: 'Condiciones ideales para muestreo. Sin contaminación aparente.',
          photos_urls: ['https://storage.supabase.co/v1/object/operations/ref-001-photo1.jpg'],
          notes: 'Muestreo realizado según protocolo ISO 3082. Muestra representativa obtenida.',
          quality_check_passed: true,
          supervisor_approval: true,
          supervisor_approved_by: null,
          supervisor_approved_at: '2025-01-15T17:00:00Z'
        },
        {
          reference_id: references[1].id,
          assigned_to: null,
          status: 'in_progress',
          assigned_at: '2025-01-20T07:00:00Z',
          started_at: '2025-01-20T08:15:00Z',
          operation_type: 'inspección',
          equipment_used: ['GPS diferencial', 'Analizador portátil XRF', 'Kit de muestreo geológico'],
          actual_location: 'Mina Santa Rita - Nivel 150, Veta Principal',
          weather_conditions: 'Nublado, 12°C, sin precipitaciones',
          environmental_notes: 'Ventilación adecuada. Implementadas medidas de seguridad.',
          notes: 'Inspección en progreso. Identificadas 3 zonas de muestreo prioritarias.',
          quality_check_passed: false,
          supervisor_approval: false
        },
        {
          reference_id: references[3].id,
          assigned_to: null,
          status: 'pending',
          assigned_at: '2025-01-21T06:00:00Z',
          operation_type: 'muestreo',
          notes: 'Operación programada para mañana. Equipo especializado requerido.'
        }
      ]

      const { data: opsData, error: opsError } = await supabase
        .from('operations')
        .insert(operations)
        .select()

      if (opsError) {
        console.error('❌ Error inserting operations:', opsError)
      } else {
        console.log('✅ Operations created:', opsData?.length)
      }

      // 5. Crear análisis de laboratorio
      const labAnalyses = [
        {
          reference_id: references[0].id,
          operation_id: opsData?.[0]?.id,
          analyst_id: null,
          status: 'completed',
          assigned_at: '2025-01-16T08:00:00Z',
          started_at: '2025-01-16T09:00:00Z',
          completed_at: '2025-01-18T15:30:00Z',
          sample_id: 'LAB-2025-001',
          sample_received_at: '2025-01-15T18:00:00Z',
          sample_condition: 'Excelente - Muestra seca, sin contaminación visible',
          analysis_type: ['XRF', 'AAS', 'ICP-MS', 'Gravimetría'],
          test_methods: ['ASTM E1085', 'ISO 751', 'ASTM E1601'],
          results: {
            "Zn": { "value": 58.4, "unit": "%", "method": "AAS" },
            "Pb": { "value": 12.3, "unit": "%", "method": "AAS" },
            "Ag": { "value": 890, "unit": "g/t", "method": "ICP-MS" },
            "Fe": { "value": 8.2, "unit": "%", "method": "XRF" },
            "SiO2": { "value": 15.1, "unit": "%", "method": "XRF" },
            "humedad": { "value": 0.8, "unit": "%", "method": "Gravimetría" }
          },
          qc_passed: true,
          qc_notes: 'Todas las mediciones dentro de parámetros de calidad. Duplicados con variación <2%.',
          certified_by: null,
          certified_at: '2025-01-18T16:00:00Z',
          certificate_number: 'CERT-2025-001',
          reports_urls: ['https://storage.supabase.co/v1/object/reports/cert-2025-001.pdf'],
          notes: 'Análisis completado satisfactoriamente. Certificado emitido.'
        },
        {
          reference_id: references[1].id,
          analyst_id: null,
          status: 'waiting_sample',
          assigned_at: '2025-01-20T14:00:00Z',
          sample_id: 'LAB-2025-002',
          analysis_type: ['XRF', 'Fire Assay', 'ICP-OES'],
          test_methods: ['ASTM E1019', 'ISO 11426'],
          notes: 'Esperando recepción de muestra desde operaciones de campo.'
        }
      ]

      const { data: labData, error: labError } = await supabase
        .from('lab_analysis')
        .insert(labAnalyses)
        .select()

      if (labError) {
        console.error('❌ Error inserting lab analyses:', labError)
      } else {
        console.log('✅ Lab analyses created:', labData?.length)
      }
    }

    console.log('🎉 Demo data seed completed successfully!')

    // Mostrar resumen
    const { data: summary } = await supabase
      .from('service_references')
      .select(`
        *,
        operations(count),
        lab_analysis(count)
      `)

    console.log('\n📊 Data Summary:')
    console.log(`- Service References: ${summary?.length || 0}`)
    console.log(`- Operations: ${summary?.reduce((acc, ref) => acc + (ref.operations?.[0]?.count || 0), 0)}`)
    console.log(`- Lab Analyses: ${summary?.reduce((acc, ref) => acc + (ref.lab_analysis?.[0]?.count || 0), 0)}`)

  } catch (error) {
    console.error('💥 Seed failed:', error)
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedDemoData()
}

module.exports = seedDemoData