import { createClient } from '@/utils/supabase/client';

export async function getUserEmailById(userId: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    if (error) {
      return { error: error.message, status: error.status };
    }
    const email = data?.user?.email;
    if (email) {
      return { email, status: 200 };
    }
    return { error: 'User not found', status: 404 };
  } catch (error: any) {
    console.error('Error fetching user email:', error);
    return { error: error.message || 'Internal server error', status: 500 };
  }
}
