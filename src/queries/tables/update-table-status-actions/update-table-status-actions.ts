import { createClient } from '@supabase/supabase-js';

interface TableStatusActions {
  id: string;
  status: string;
  actions: string[];
}

export async function updateTableStatusActions(project_id: string, tableStatusActions: TableStatusActions[]) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const errors: string[] = [];
    const updatedTables: any[] = [];

    for (const table of tableStatusActions) {
      const { data: updatedTable, error } = await supabase
        .from('tables')
        .update({ status: table.status, actions: table.actions })
        .eq('id', table.id);

      if (error) {
        console.error(`Error updating table with ID ${table.id}:`, error.message);
        errors.push(`Error updating table with ID ${table.id}: ${error.message}`);
      } else {
        updatedTables.push(updatedTable);
      }
    }

    if (errors.length > 0) {
      return { status: 400, error: errors.join(', ') };
    }

    // Update project progress using the project_id from the first table
    const { error: errorProjectProgress } = await supabase
      .from("project")
      .update({ progress: 3 })
      .eq("id", project_id);

    if (errorProjectProgress) {
      console.error("Error updating project progress:", errorProjectProgress);
      return { status: 500, error: errorProjectProgress.message };
    }

    return { status: 200, tables: updatedTables };
  } catch (error: any) {
    console.error('Error updating tables:', error);
    return { status: 500, error: error.message || 'Internal server error' };
  }
}
