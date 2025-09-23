import { getSupabaseAdminClient } from '../clients/browser-client';
import type { Operation, OperationInsert, OperationUpdate } from '../types/database';

/**
 * Get all operations with optional filtering
 */
export async function getOperations(options?: {
  status?: string;
  assignedTo?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = getSupabaseAdminClient();

  let query = supabase
    .from('operations')
    .select(`
      *,
      service_references (
        reference_number,
        client_name,
        sample_description,
        location
      )
    `)
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.assignedTo) {
    query = query.eq('assigned_to', options.assignedTo);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching operations: ${error.message}`);
  }

  return data;
}

/**
 * Get operations assigned to current user
 */
export async function getMyOperations(userId: string) {
  return getOperations({ assignedTo: userId });
}

/**
 * Get pending operations (not assigned to anyone)
 */
export async function getPendingOperations() {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('operations')
    .select(`
      *,
      service_references (
        reference_number,
        client_name,
        sample_description,
        location
      )
    `)
    .eq('status', 'pending')
    .is('assigned_to', null)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Error fetching pending operations: ${error.message}`);
  }

  return data;
}

/**
 * Assign an operation to a user
 */
export async function assignOperationToUser(operationId: string, userId: string) {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('operations')
    .update({
      assigned_to: userId,
      assigned_at: new Date().toISOString(),
      status: 'in_progress',
    })
    .eq('id', operationId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error assigning operation: ${error.message}`);
  }

  return data as Operation;
}

/**
 * Update operation status and details
 */
export async function updateOperation(id: string, updates: OperationUpdate) {
  const supabase = getSupabaseAdminClient();

  // If completing the operation, set completion timestamp
  if (updates.status === 'completed' && !updates.completed_at) {
    updates.completed_at = new Date().toISOString();
  }

  // If starting the operation, set start timestamp
  if (updates.status === 'in_progress' && !updates.started_at) {
    updates.started_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('operations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating operation: ${error.message}`);
  }

  return data as Operation;
}

/**
 * Get operations statistics for dashboard
 */
export async function getOperationsStats() {
  const supabase = getSupabaseAdminClient();

  // Get total count
  const { count: total, error: totalError } = await supabase
    .from('operations')
    .select('*', { count: 'exact', head: true });

  if (totalError) {
    throw new Error(`Error getting total operations count: ${totalError.message}`);
  }

  // Get count by status
  const { data: statusCounts, error: statusError } = await supabase
    .from('operations')
    .select('status')
    .then(async (result) => {
      if (result.error) return result;

      const counts = result.data.reduce((acc, op) => {
        acc[op.status] = (acc[op.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return { data: counts, error: null };
    });

  if (statusError) {
    throw new Error(`Error getting operations status counts: ${statusError.message}`);
  }

  // Get today's completed operations
  const today = new Date().toISOString().split('T')[0];
  const { count: completedToday, error: todayError } = await supabase
    .from('operations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('completed_at', `${today}T00:00:00.000Z`)
    .lte('completed_at', `${today}T23:59:59.999Z`);

  if (todayError) {
    throw new Error(`Error getting today's completed operations: ${todayError.message}`);
  }

  return {
    total: total || 0,
    pending: statusCounts?.pending || 0,
    in_progress: statusCounts?.in_progress || 0,
    completed: statusCounts?.completed || 0,
    failed: statusCounts?.failed || 0,
    rescheduled: statusCounts?.rescheduled || 0,
    completedToday: completedToday || 0,
  };
}