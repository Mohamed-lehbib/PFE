import { createClient } from "@/utils/supabase/client";

interface TableIdName {
  id: number;
  name: string;
  actions: string[];
}

export async function fetchTables(projectId: string): Promise<{ data: TableIdName[]; error: any }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tables")
    .select("id, name, actions") // Include actions in the query
    .eq("project_id", projectId)
    .contains("actions", ["read"])
    .order("name", { ascending: true });

  return { data: data || [], error };
}
