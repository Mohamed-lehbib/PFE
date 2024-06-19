import { createClient } from '@supabase/supabase-js';

export async function getAllUserProjects(user_id: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: projects, error: projectsError } = await supabase
      .from('project_user_view')
      .select(`
        project_id,
        project_name,
        project_description,
        project_logo,
        project_user_id,
        project_team_id,
        project_password,
        project_progress,
        project_created_at,
        user_email,
        user_metadata
      `)
      .eq('project_user_id', user_id)
      .order('project_updated_at', { ascending: false });

    if (projectsError) {
      console.error('Supabase projects fetch error:', projectsError.message);
      return { status: 400, error: projectsError.message };
    }

    return { status: 200, projects };
  } catch (error: any) {
    console.error('Error fetching user projects:', error);
    return { status: 500, error: error.message || 'Internal server error' };
  }
}
