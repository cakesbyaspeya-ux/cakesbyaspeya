import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client.
 *
 * Use inside Client Components ('use client') and client-side code.
 * - Uses the public anon key
 * - Stores auth session in cookies (managed by @supabase/ssr)
 * - Respects Row Level Security policies
 * - Safe to call multiple times (browser client is a singleton)
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
