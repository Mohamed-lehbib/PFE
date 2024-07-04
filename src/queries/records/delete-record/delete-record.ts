import { createProjectClient } from "@/utils/supabase/client";

export const deleteRecord = async (
  supabaseUrl: string,
  supabaseServiceRoleKey: string,
  tableName: string,
  recordId: string
) => {
  const supabase = createProjectClient(supabaseUrl, supabaseServiceRoleKey);
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", recordId);

  return { error };
};
