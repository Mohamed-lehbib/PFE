import { NextRequest, NextResponse } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';
import { updateProjectCredentials } from '@/queries/project/update-project-credentials/update-project-credentials';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { supabase_url, supabase_service_role_key} = await req.json();
    if (!supabase_url || !supabase_service_role_key) {
        return NextResponse.json({ error: 'supabase credentials is required' }, { status: 404 });
      }

    const supabase = createClientForServer();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    const user_id = userData.user.id;

    if (!user_id) {
      console.log('user_id');
      return NextResponse.json({ error: 'user_id' }, { status: 400 });
    }

    const project = {
      supabase_url,
      supabase_service_role_key,
      id: params.id,
    };

    const updateResult = await updateProjectCredentials(project);
    return NextResponse.json({ message: 'Project updated successfully' }, { status: updateResult.status ?? 200 });
  } catch (e: any) {
    console.log('Internal server error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error', details: e.toString() }, { status: 500 });
  }
}