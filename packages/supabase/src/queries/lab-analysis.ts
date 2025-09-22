import { getSupabaseBrowserClient } from '../clients/browser-client';
import type { LabAnalysis, LabAnalysisInsert, LabAnalysisUpdate } from '../types/database';

/**
 * Get all lab analysis with optional filtering
 */
export async function getLabAnalysis(options?: {
  status?: string;
  analystId?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = getSupabaseBrowserClient();

  let query = supabase
    .from('lab_analysis')
    .select(`
      *,
      service_references (
        reference_number,
        client_name,
        sample_description,
        service_type
      ),
      operations (
        status,
        completed_at,
        sample_quantity,
        sample_units
      )
    `)
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.analystId) {
    query = query.eq('analyst_id', options.analystId);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching lab analysis: ${error.message}`);
  }

  return data;
}

/**
 * Get lab analysis assigned to current user
 */
export async function getMyLabAnalysis(userId: string) {
  return getLabAnalysis({ analystId: userId });
}

/**
 * Get lab analysis waiting for samples (operations completed)
 */
export async function getAnalysisWaitingSamples() {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('lab_analysis')
    .select(`
      *,
      service_references (
        reference_number,
        client_name,
        sample_description,
        service_type
      ),
      operations (
        status,
        completed_at,
        sample_quantity,
        sample_units
      )
    `)
    .eq('status', 'waiting_sample')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Error fetching analysis waiting for samples: ${error.message}`);
  }

  return data;
}

/**
 * Get lab analysis ready for processing (has samples)
 */
export async function getAnalysisReadyForProcessing() {
  const supabase = getSupabaseBrowserClient();

  // Get analysis where the related operation is completed
  const { data, error } = await supabase
    .from('lab_analysis')
    .select(`
      *,
      service_references (
        reference_number,
        client_name,
        sample_description,
        service_type
      ),
      operations (
        status,
        completed_at,
        sample_quantity,
        sample_units
      )
    `)
    .in('status', ['waiting_sample', 'in_analysis'])
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Error fetching analysis ready for processing: ${error.message}`);
  }

  // Filter only those where operations are completed
  const readyForProcessing = data?.filter(analysis =>
    analysis.operations?.some(op => op.status === 'completed')
  ) || [];

  return readyForProcessing;
}

/**
 * Assign analysis to an analyst
 */
export async function assignAnalysisToUser(analysisId: string, userId: string) {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('lab_analysis')
    .update({
      analyst_id: userId,
      assigned_at: new Date().toISOString(),
    })
    .eq('id', analysisId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error assigning analysis: ${error.message}`);
  }

  return data as LabAnalysis;
}

/**
 * Update analysis status and results
 */
export async function updateLabAnalysis(id: string, updates: LabAnalysisUpdate) {
  const supabase = getSupabaseBrowserClient();

  // If completing the analysis, set completion timestamp
  if (updates.status === 'completed' && !updates.completed_at) {
    updates.completed_at = new Date().toISOString();
  }

  // If starting the analysis, set start timestamp
  if (updates.status === 'in_analysis' && !updates.started_at) {
    updates.started_at = new Date().toISOString();
  }

  // If receiving sample, set received timestamp
  if (updates.sample_received_at && !updates.started_at) {
    updates.started_at = new Date().toISOString();
    updates.status = 'in_analysis';
  }

  const { data, error } = await supabase
    .from('lab_analysis')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating lab analysis: ${error.message}`);
  }

  return data as LabAnalysis;
}

/**
 * Update analysis results
 */
export async function updateAnalysisResults(
  id: string,
  results: Record<string, any>,
  options?: {
    qcPassed?: boolean;
    qcNotes?: string;
    certifiedBy?: string;
  }
) {
  const updates: LabAnalysisUpdate = {
    results,
    qc_passed: options?.qcPassed,
    qc_notes: options?.qcNotes,
    certified_by: options?.certifiedBy,
  };

  // If marking as certified, set timestamp
  if (options?.certifiedBy) {
    updates.certified_at = new Date().toISOString();
    updates.status = 'completed';
  }

  return updateLabAnalysis(id, updates);
}

/**
 * Get lab analysis statistics for dashboard
 */
export async function getLabAnalysisStats() {
  const supabase = getSupabaseBrowserClient();

  // Get total count
  const { count: total, error: totalError } = await supabase
    .from('lab_analysis')
    .select('*', { count: 'exact', head: true });

  if (totalError) {
    throw new Error(`Error getting total lab analysis count: ${totalError.message}`);
  }

  // Get count by status
  const { data: statusCounts, error: statusError } = await supabase
    .from('lab_analysis')
    .select('status')
    .then(async (result) => {
      if (result.error) return result;

      const counts = result.data.reduce((acc, analysis) => {
        acc[analysis.status] = (acc[analysis.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return { data: counts, error: null };
    });

  if (statusError) {
    throw new Error(`Error getting lab analysis status counts: ${statusError.message}`);
  }

  // Get today's completed analysis
  const today = new Date().toISOString().split('T')[0];
  const { count: completedToday, error: todayError } = await supabase
    .from('lab_analysis')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('completed_at', `${today}T00:00:00.000Z`)
    .lte('completed_at', `${today}T23:59:59.999Z`);

  if (todayError) {
    throw new Error(`Error getting today's completed analysis: ${todayError.message}`);
  }

  return {
    total: total || 0,
    waiting_sample: statusCounts?.waiting_sample || 0,
    in_analysis: statusCounts?.in_analysis || 0,
    completed: statusCounts?.completed || 0,
    failed: statusCounts?.failed || 0,
    requires_retest: statusCounts?.requires_retest || 0,
    completedToday: completedToday || 0,
  };
}