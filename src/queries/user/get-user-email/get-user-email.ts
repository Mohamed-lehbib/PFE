import { createClient } from '@/utils/supabase/client';

export async function getUserEmailById(userId: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      return { error: error.message, status: error.status };
    }

    if (data && data.user) {
      return { email: data.user.email, status: 200 };
    }

    return { error: 'User not found', status: 404 };
  } catch (error) {
    console.error('Error fetching user email:', error);
    return { error: 'Internal server error', status: 500 };
  }
}
