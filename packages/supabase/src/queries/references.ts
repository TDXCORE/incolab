import { getSupabaseBrowserClient } from '../clients/browser-client';
import type { ServiceReference, ServiceReferenceInsert, ServiceReferenceUpdate } from '../types/database';

/**
 * Get all service references with optional filtering
 */
export async function getReferences(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = getSupabaseBrowserClient();

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
  const supabase = getSupabaseBrowserClient();

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
  const supabase = getSupabaseBrowserClient();

  // Generate reference number using the database function
  const { data: refNumber, error: refError } = await supabase
    .rpc('generate_reference_number');

  if (refError) {
    throw new Error(`Error generating reference number: ${refError.message}`);
  }

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
    throw new Error(`Error creating reference: ${error.message}`);
  }

  return reference as ServiceReference;
}

/**
 * Update a service reference
 */
export async function updateReference(id: string, updates: ServiceReferenceUpdate) {
  const supabase = getSupabaseBrowserClient();

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
  const supabase = getSupabaseBrowserClient();

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
  const supabase = getSupabaseBrowserClient();

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