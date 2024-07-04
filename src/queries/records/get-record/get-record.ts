import { createProjectClient } from "@/utils/supabase/client";

export async function fetchRecordDetails(
  supabaseUrl: string,
  supabaseServiceRoleKey: string,
  tableName: string,
  recordId: string
) {
  const supabase = createProjectClient(supabaseUrl, supabaseServiceRoleKey);
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", recordId)
    .single();

  return { data, error };
}
