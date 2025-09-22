'use client';

import { useQuery } from '@tanstack/react-query';
import { getReferencesStats } from '@kit/supabase/queries/references';

export function useReferencesStats() {
  return useQuery({
    queryKey: ['references-stats'],
    queryFn: getReferencesStats,
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
  });
}