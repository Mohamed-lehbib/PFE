import { createClient } from '@supabase/supabase-js';

export async function getTablesByProjectId(project_id: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select("*")
      .eq('project_id', project_id)
      .order('name', { ascending: false });

    if (tablesError) {
      console.error('Supabase projects fetch error:', tablesError.message);
      return { status: 400, error: tablesError.message };
    }
    

    return { status: 200, tables };
  } catch (error: any) {
    console.error('Error fetching user tables:', error);
    return { status: 500, error: error.message || 'Internal server error' };
  }
}
