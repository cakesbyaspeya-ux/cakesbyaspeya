import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client.
 *
 * Use inside Server Components (no 'use client') and Server Actions.
 * - Uses the public anon key
 * - Reads/writes auth session from the request's cookies
 * - Respects Row Level Security policies
 * - MUST be awaited because `cookies()` is async in Next.js 15+
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — cannot mutate cookies here.
            // This is fine: middleware refreshes the session.
          }
        },
      },
    }
  );
}