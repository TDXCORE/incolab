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
        throw new Error(`Error getting total count: ${totalError.message}`);
      }

      // Get count by status
      const { data: statusData, error: statusError } = await supabase
        .from('service_references')
        .select('status');

      if (statusError) {
        throw new Error(`Error getting status counts: ${statusError.message}`);
      }

      const statusCounts = statusData.reduce((acc, ref) => {
        acc[ref.status] = (acc[ref.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: total || 0,
        pending: statusCounts?.pending || 0,
        in_progress: statusCounts?.in_progress || 0,
        completed: statusCounts?.completed || 0,
        cancelled: statusCounts?.cancelled || 0,
        on_hold: statusCounts?.on_hold || 0,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
  });
}