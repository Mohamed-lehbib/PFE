import { createClient } from "@/utils/supabase/client";
import { AttributeWithEnum } from "@/utils/tableParser/tableParser";

interface Table {
  name: string;
  project_id: string;
  attributes: AttributeWithEnum[];
  status: string;
}

export async function insertTables(tables: Table[]) {
  try {
    const supabase = createClient();
    const insertData = tables.map((table) => ({
      project_id: table.project_id,
      name: table.name,
      attributes: table.attributes,
      status: table.status
    }));
    const { data, error, status } = await supabase.from("tables").insert(insertData);

    if (error) {
      return { status, error };
    }

    return { status, data };
  } catch (error) {
    console.error("Error inserting project:", error);
    return { status: 500, error: "Internal server error" };
  }
}