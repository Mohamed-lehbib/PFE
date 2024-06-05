import { getUserEmailById } from '@/queries/user/get-user-email/get-user-email';
import { createClient } from '@/utils/supabase/client';

export async function getUserProjects(user_id: string) {
  try {
    const supabase = createClient();
    const { data: projects, error: projectsError } = await supabase
      .from('project')
      .select('name, description, project_logo')
      .eq('user_id', user_id);

    if (projectsError) {
      return { status: 400, error: projectsError.message };
    }

    const { email, error: emailError } = await getUserEmailById(user_id);

    if (emailError) {
      return { status: 400, error: emailError };
    }

    return { status: 200, projects, email };
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return { status: 500, error: 'Internal server error' };
  }
}
