import { createBrowserClient } from "@supabase/ssr";

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

export function createClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseEnv();

  return createBrowserClient(supabaseUrl, supabaseKey);
}
