import { createClient } from "@/utils/supabase/client";
import { AttributeWithEnum } from "@/utils/tableParser/tableParser";

interface Table {
  name: string;
  project_id: string;
  attributes: AttributeWithEnum[];
}

export async function insertTable(table: Table) {
  try {
    const supabase = createClient();
    const { data, error, status } = await supabase.from("tables").insert([
      {
        project_id: table.project_id,
        name: table.name,
        attributes: table.attributes,
      },
    ]);

    if (error) {
      return { status, error };
    }

    return { status, data };
  } catch (error) {
    console.error("Error inserting project:", error);
    return { status: 500, error: "Internal server error" };
  }
}
