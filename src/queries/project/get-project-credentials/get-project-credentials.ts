import { createClient } from "@/utils/supabase/client";

export async function fetchProjectCredentials(projectId: string): Promise<{ data: any; error: any }> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project")
      .select("supabase_url, supabase_service_role_key")
      .eq("id", projectId)
      .single();
  
    return { data, error };
  }