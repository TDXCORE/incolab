'use client';

import { useRealtimeSubscriptions } from '@kit/supabase/hooks/use-realtime-references';

/**
 * Component that sets up real-time subscriptions for the entire app
 * Should be placed high in the component tree
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  // Set up all real-time subscriptions
  useRealtimeSubscriptions();

  return <>{children}</>;
}