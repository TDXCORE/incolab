'use client';

import { useQuery } from '@tanstack/react-query';
import { getReferencesStats } from '@kit/supabase/queries/references';

export function useReferencesStats() {
  return useQuery({
    queryKey: ['references-stats'],
    queryFn: getReferencesStats,
    refetchOnWindowFocus: false,
  });
}
