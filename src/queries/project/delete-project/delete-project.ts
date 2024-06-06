import { createClient } from '@supabase/supabase-js';

export async function deleteProject(project_id: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('project')
      .delete()
      .eq('id', project_id);

    if (error) {
      console.error('Supabase project delete error:', error.message);
      return { status: 400, error: error.message };
    }

    return { status: 200, data };
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return { status: 500, error: error.message || 'Internal server error' };
  }
}
