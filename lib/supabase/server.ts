import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function sanitizeSupabaseUrl(url: string | undefined): string {
  if (!url) return "";
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

function getSupabaseEnv(): { supabaseUrl: string; supabaseKey: string } {
  const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see .env.example)."
    );
  }
  return { supabaseUrl, supabaseKey };
}

/**
 * Public stateless client for SSG / ISR and public data fetching.
 * Does NOT access cookies, allowing Next.js routes to be prerendered statically at build time.
 */
export function createPublicClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseEnv();

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function createClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseEnv();

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
