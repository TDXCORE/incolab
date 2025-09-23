import { createBrowserClient } from '@supabase/ssr';

import { Database } from '../database.types';
import { getSupabaseClientKeys } from '../get-supabase-client-keys';

/**
 * @name getSupabaseBrowserClient
 * @description Get a Supabase client for use in the Browser
 */
export function getSupabaseBrowserClient<GenericSchema = Database>() {
  const keys = getSupabaseClientKeys();

  return createBrowserClient<GenericSchema>(keys.url, keys.anonKey);
}

/**
 * @name getSupabaseAdminClient
 * @description Get a Supabase admin client with service role key for demo data access
 */
export function getSupabaseAdminClient<GenericSchema = Database>() {
  const keys = getSupabaseClientKeys();

  // Use service role key for admin operations
  const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bmR0cnl4aHJrdnZsd2p3cGxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU1ODUyMCwiZXhwIjoyMDc0MTM0NTIwfQ.jjltLfXrC6PK75KpledTDaM8kFexLJiPbr50T5ArVfc';

  return createBrowserClient<GenericSchema>(keys.url, serviceRoleKey);
}
