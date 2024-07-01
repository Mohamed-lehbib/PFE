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

    // Map tables to the insert data structure
    const insertData = tables.map((table) => ({
      project_id: table.project_id,
      name: table.name,
      attributes: table.attributes,
      status: table.status,
    }));

    // Insert tables data
    const { data, error, status } = await supabase.from("tables").insert(insertData);

    if (error) {
      console.error("Error inserting tables:", error);
      return { status, error };
    }

    // Update project progress using the project_id from the first table
    const project_id = tables[0].project_id;
    const { error: errorProjectProgress } = await supabase
      .from("project")
      .update({ progress: 2 })
      .eq("id", project_id);

    if (errorProjectProgress) {
      console.error("Error updating project progress:", errorProjectProgress);
      return { status: 500, error: errorProjectProgress.message };
    }

    return { status, data };
  } catch (error) {
    console.error("Error inserting project:", error);
    return { status: 500, error: "Internal server error" };
  }
}
