'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSupabaseBrowserClient } from '../clients/browser-client';

/**
 * Hook to subscribe to real-time changes in service_references table
 * Automatically invalidates and refetches related queries when data changes
 */
export function useRealtimeReferences() {
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    // Subscribe to changes in service_references table
    const channel = supabase
      .channel('references_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'service_references',
        },
        (payload) => {
          console.log('Reference change detected:', payload);

          // Invalidate and refetch references-related queries
          queryClient.invalidateQueries({ queryKey: ['references'] });
          queryClient.invalidateQueries({ queryKey: ['references-stats'] });

          // If it's a specific reference change, invalidate that too
          if (payload.new?.id || payload.old?.id) {
            const referenceId = payload.new?.id || payload.old?.id;
            queryClient.invalidateQueries({
              queryKey: ['reference', referenceId]
            });
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [queryClient, supabase]);
}

/**
 * Hook to subscribe to real-time changes in operations table
 */
export function useRealtimeOperations() {
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const channel = supabase
      .channel('operations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'operations',
        },
        (payload) => {
          console.log('Operation change detected:', payload);

          // Invalidate operations queries
          queryClient.invalidateQueries({ queryKey: ['operations'] });
          queryClient.invalidateQueries({ queryKey: ['operations-stats'] });

          // Also invalidate references since operation status affects reference status
          queryClient.invalidateQueries({ queryKey: ['references'] });
          queryClient.invalidateQueries({ queryKey: ['references-stats'] });

          // If we know which reference this operation belongs to, invalidate that specific reference
          if (payload.new?.reference_id || payload.old?.reference_id) {
            const referenceId = payload.new?.reference_id || payload.old?.reference_id;
            queryClient.invalidateQueries({
              queryKey: ['reference', referenceId]
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient, supabase]);
}

/**
 * Hook to subscribe to real-time changes in lab_analysis table
 */
export function useRealtimeLabAnalysis() {
  const queryClient = useQueryClient();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const channel = supabase
      .channel('lab_analysis_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_analysis',
        },
        (payload) => {
          console.log('Lab analysis change detected:', payload);

          // Invalidate lab analysis queries
          queryClient.invalidateQueries({ queryKey: ['lab-analysis'] });
          queryClient.invalidateQueries({ queryKey: ['lab-analysis-stats'] });

          // Also invalidate references since lab analysis status affects reference status
          queryClient.invalidateQueries({ queryKey: ['references'] });
          queryClient.invalidateQueries({ queryKey: ['references-stats'] });

          // If we know which reference this analysis belongs to, invalidate that specific reference
          if (payload.new?.reference_id || payload.old?.reference_id) {
            const referenceId = payload.new?.reference_id || payload.old?.reference_id;
            queryClient.invalidateQueries({
              queryKey: ['reference', referenceId]
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient, supabase]);
}

/**
 * Master hook that subscribes to all real-time changes
 * Use this in your main layout or app component
 */
export function useRealtimeSubscriptions() {
  useRealtimeReferences();
  useRealtimeOperations();
  useRealtimeLabAnalysis();
}