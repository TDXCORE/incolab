import { getSupabaseAdminClient } from '../clients/browser-client';
import type { ServiceReference, ServiceReferenceInsert, ServiceReferenceUpdate } from '../types/database';

/**
 * Get all service references with optional filtering
 */
export async function getReferences(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = getSupabaseAdminClient();

  let query = supabase
    .from('service_references')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching references: ${error.message}`);
  }

  return data as ServiceReference[];
}

/**
 * Get a single service reference by ID with related data
 */
export async function getReferenceById(id: string) {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('service_references')
    .select(`
      *,
      operations (*),
      lab_analysis (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching reference: ${error.message}`);
  }

  return data;
}

/**
 * Create a new service reference
 * This will automatically trigger the creation of operations and lab_analysis entries
 */
export async function createReference(data: Omit<ServiceReferenceInsert, 'reference_number'>) {
  const supabase = getSupabaseAdminClient();

  try {
    console.log('Starting reference creation with admin client...');

    // Generate reference number using the database function
    const { data: refNumber, error: refError } = await supabase
      .rpc('generate_reference_number');

    if (refError) {
      console.error('Reference number generation error:', refError);
      throw new Error(`Error generating reference number: ${refError.message}`);
    }

    console.log('Generated reference number:', refNumber);

    // Create the reference with the generated number
    const { data: reference, error } = await supabase
      .from('service_references')
      .insert({
        ...data,
        reference_number: refNumber as string,
      })
      .select()
      .single();

    if (error) {
      console.error('Reference creation error:', error);
      throw new Error(`Error creating reference: ${error.message}`);
    }

    console.log('Reference created successfully:', reference);

    // Try to create operations and lab analysis separately, but don't fail if they fail
    try {
      console.log('Creating operation task...');
      const { data: operationData, error: operationError } = await supabase
        .from('operations')
        .insert({
          reference_id: reference.id,
          operation_type: 'sampling',
          status: 'pending',
          priority: data.priority || 'normal',
          created_at: new Date().toISOString(),
          notes: `Operación de muestreo para ${reference.reference_number}`,
        })
        .select()
        .single();

      if (operationError) {
        console.error('Operation creation error:', operationError);
        console.warn('Could not create operation task automatically. Operation will need to be created manually.');
      } else {
        console.log('Operation created successfully:', operationData);
      }
    } catch (opError) {
      console.error('Failed to create operation:', opError);
    }

    try {
      console.log('Creating lab analysis task...');
      const { data: labData, error: labError } = await supabase
        .from('lab_analysis')
        .insert({
          reference_id: reference.id,
          analysis_type: ['general'], // Default analysis type
          status: 'waiting_sample',
          priority: data.priority || 'normal',
          created_at: new Date().toISOString(),
          notes: `Análisis de laboratorio para ${reference.reference_number}`,
        })
        .select()
        .single();

      if (labError) {
        console.error('Lab analysis creation error:', labError);
        console.warn('Could not create lab analysis task automatically. Lab analysis will need to be created manually.');
      } else {
        console.log('Lab analysis created successfully:', labData);
      }
    } catch (labError) {
      console.error('Failed to create lab analysis:', labError);
    }

    // Return the reference regardless of whether operations/lab analysis creation succeeded
    return reference as ServiceReference;
  } catch (error) {
    console.error('Error in createReference:', error);
    throw error;
  }
}

/**
 * Update a service reference
 */
export async function updateReference(id: string, updates: ServiceReferenceUpdate) {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('service_references')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating reference: ${error.message}`);
  }

  return data as ServiceReference;
}

/**
 * Delete a service reference
 */
export async function deleteReference(id: string) {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from('service_references')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting reference: ${error.message}`);
  }

  return true;
}

/**
 * Get references statistics for dashboard
 */
export async function getReferencesStats() {
  const supabase = getSupabaseAdminClient();

  // Get total count
  const { count: total, error: totalError } = await supabase
    .from('service_references')
    .select('*', { count: 'exact', head: true });

  if (totalError) {
    throw new Error(`Error getting total count: ${totalError.message}`);
  }

  // Get count by status
  const { data: statusCounts, error: statusError } = await supabase
    .from('service_references')
    .select('status')
    .then(async (result) => {
      if (result.error) return result;

      const counts = result.data.reduce((acc, ref) => {
        acc[ref.status] = (acc[ref.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return { data: counts, error: null };
    });

  if (statusError) {
    throw new Error(`Error getting status counts: ${statusError.message}`);
  }

  return {
    total: total || 0,
    pending: statusCounts?.pending || 0,
    in_progress: statusCounts?.in_progress || 0,
    completed: statusCounts?.completed || 0,
    cancelled: statusCounts?.cancelled || 0,
    on_hold: statusCounts?.on_hold || 0,
  };
}