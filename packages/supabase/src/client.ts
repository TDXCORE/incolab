import { getSupabaseBrowserClient } from './clients/browser-client';

/**
 * Get Supabase client for use in React components
 * This is a convenience export that wraps the browser client
 */
export function getSupabaseClient() {
  return getSupabaseBrowserClient();
}

// Re-export for convenience
export { getSupabaseBrowserClient, getSupabaseAdminClient } from './clients/browser-client';