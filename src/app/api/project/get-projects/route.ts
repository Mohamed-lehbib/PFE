import { NextRequest, NextResponse } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';
import { getUserProjects } from '@/queries/project/get-project/get-project';

export const revalidate = 0
export async function GET(req: NextRequest) {
  try {
    const supabase = createClientForServer();
    const { data, error } = await supabase.auth.getUser();
    const user_id = data?.user?.id;
    if (error ?? !user_id) {
      console.log('User not authenticated:', error?.message ?? 'No user ID');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    const response = await getUserProjects(user_id);
    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: response.status });
    }
    return NextResponse.json({ status: 200, projects: response.projects });
  } catch (e: any) {
    console.log('Internal server error:', e);
    return NextResponse.json({ error: 'Internal server error', details: e.toString() }, { status: 500 });
  }
}
