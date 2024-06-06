import { getUserEmailById } from '@/queries/user/get-user-email/get-user-email';
import { createClient } from '@supabase/supabase-js';

export async function getUserProjects(user_id: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: projects, error: projectsError } = await supabase
      .from('project')
      .select('name, description, project_logo, user_id')
      .eq('user_id', user_id);

    if (projectsError) {
      console.error('Supabase projects fetch error:', projectsError.message);
      return { status: 400, error: projectsError.message };
    }

    const projectsWithEmails = await Promise.all(
      projects.map(async project => {
        const emailResponse = await getUserEmailById(project.user_id);
        if ('error' in emailResponse) {
          return { ...project, email: null, emailError: emailResponse.error };
        }
        return { ...project, email: emailResponse.email };
      })
    );

    return { status: 200, projects: projectsWithEmails };
  } catch (error: any) {
    console.error('Error fetching user projects:', error);
    return { status: 500, error: error.message || 'Internal server error' };
  }
}
