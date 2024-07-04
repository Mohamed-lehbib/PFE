import { createProjectClient } from "@/utils/supabase/client";

export async function updateRecord(
  supabaseUrl: string,
  supabaseServiceRoleKey: string,
  tableName: string,
  recordId: string,
  dataToUpdate: any
) {
  const supabase = createProjectClient(supabaseUrl, supabaseServiceRoleKey);
  const { error } = await supabase
    .from(tableName)
    .update(dataToUpdate)
    .eq("id", recordId);

  return { error };
}
