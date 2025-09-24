import { getSupabaseAdminClient } from '../clients/browser-client';

/**
 * Manually create operation task for a reference
 */
export async function createOperationForReference(referenceId: string, referenceNumber: string) {
  const supabase = getSupabaseAdminClient();

  try {
    const { data, error } = await supabase
      .from('operations')
      .insert({
        reference_id: referenceId,
        operation_type: 'sampling',
        status: 'pending',
        priority: 'normal',
        created_at: new Date().toISOString(),
        notes: `Operación de muestreo para ${referenceNumber}`,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating operation: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createOperationForReference:', error);
    throw error;
  }
}

/**
 * Manually create lab analysis task for a reference
 */
export async function createLabAnalysisForReference(referenceId: string, referenceNumber: string) {
  const supabase = getSupabaseAdminClient();

  try {
    const { data, error } = await supabase
      .from('lab_analysis')
      .insert({
        reference_id: referenceId,
        analysis_type: ['general'],
        status: 'waiting_sample',
        priority: 'normal',
        created_at: new Date().toISOString(),
        notes: `Análisis de laboratorio para ${referenceNumber}`,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating lab analysis: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createLabAnalysisForReference:', error);
    throw error;
  }
}

/**
 * Create missing tasks for all references that don't have them
 */
export async function createMissingTasks() {
  const supabase = getSupabaseAdminClient();

  try {
    // Get all references
    const { data: references, error: refError } = await supabase
      .from('service_references')
      .select(`
        id,
        reference_number,
        operations(id),
        lab_analysis(id)
      `);

    if (refError) {
      throw new Error(`Error fetching references: ${refError.message}`);
    }

    const results = {
      operationsCreated: 0,
      labAnalysisCreated: 0,
      errors: [] as string[]
    };

    for (const ref of references || []) {
      // Create operation if missing
      if (!ref.operations || ref.operations.length === 0) {
        try {
          await createOperationForReference(ref.id, ref.reference_number);
          results.operationsCreated++;
        } catch (error) {
          results.errors.push(`Failed to create operation for ${ref.reference_number}: ${error}`);
        }
      }

      // Create lab analysis if missing
      if (!ref.lab_analysis || ref.lab_analysis.length === 0) {
        try {
          await createLabAnalysisForReference(ref.id, ref.reference_number);
          results.labAnalysisCreated++;
        } catch (error) {
          results.errors.push(`Failed to create lab analysis for ${ref.reference_number}: ${error}`);
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Error in createMissingTasks:', error);
    throw error;
  }
}