import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient} from "@supabase/supabase-js";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function createProjectClient(supabase_url: string, supabase_service_role: string) {
  return createSupabaseClient(supabase_url, supabase_service_role);
}