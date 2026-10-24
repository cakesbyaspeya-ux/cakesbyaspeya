import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client — SERVER ONLY.
 *
 * 🚨 Uses the SERVICE ROLE key which BYPASSES all Row Level Security.
 * 🚨 NEVER import this into a file with 'use client'.
 * 🚨 NEVER expose its output to the browser.
 *
 * Use only in:
 * - /app/api/** route handlers that must bypass RLS (e.g. public order creation)
 * - /app/api/cron/** jobs (daily baking sheet)
 * - Server-side scripts and migrations
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,   // no cookie/session management
        autoRefreshToken: false, // no background token refresh
      },
    }
  );
}
