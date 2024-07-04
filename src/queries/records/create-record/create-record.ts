import { createProjectClient } from "@/utils/supabase/client";

export async function createRecord(supabaseUrl: string, supabaseServiceRoleKey: string, tableName: string, dataToInsert: any) {
    const supabase = createProjectClient(supabaseUrl, supabaseServiceRoleKey);
    const { error } = await supabase.from(tableName).insert(dataToInsert);
    return { error };
  }