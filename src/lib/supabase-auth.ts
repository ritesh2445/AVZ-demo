import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl.trim() && supabaseAnonKey.trim()
);

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client for OTP authentication dispatch and verification.
 */
export function getSupabaseAuthClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl.trim(), supabaseAnonKey.trim(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseInstance;
}
