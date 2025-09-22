'use client';

import { useQuery } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

export function useReferencesStats() {
  return useQuery({
    queryKey: ['references-stats'],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();

      // Get total count
      const { count: total, error: totalError } = await supabase
        .from('service_references')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        throw new Error(`Error fetching total count: ${totalError.message}`);
      }

      // Get counts by status
      const { data: statusCounts, error: statusError } = await supabase
        .from('service_references')
        .select('status')
        .not('status', 'is', null);

      if (statusError) {
        throw new Error(`Error fetching status counts: ${statusError.message}`);
      }

      // Calculate stats
      const pending = statusCounts.filter(ref => ref.status === 'pending').length;
      const in_progress = statusCounts.filter(ref => ref.status === 'in_progress').length;
      const completed = statusCounts.filter(ref => ref.status === 'completed').length;
      const cancelled = statusCounts.filter(ref => ref.status === 'cancelled').length;
      const on_hold = statusCounts.filter(ref => ref.status === 'on_hold').length;

      return {
        total: total || 0,
        pending,
        in_progress,
        completed,
        cancelled,
        on_hold,
      };
    },
    refetchOnWindowFocus: false,
  });
}
