import { NextRequest, NextResponse } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';
import { deleteProject } from '@/queries/project/delete-project/delete-project';

export const revalidate = 0;

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClientForServer();
    const { data, error } = await supabase.auth.getUser();
    const user_id = data?.user?.id;

    if (error ?? !user_id) {
      console.log('User not authenticated:', error?.message ?? 'No user ID');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const response = await deleteProject(id);

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: response.status });
    }

    return NextResponse.json({ message: 'Project deleted successfully', data: response.data }, { status: 200 });
  } catch (e: any) {
    console.log('Internal server error:', e);
    return NextResponse.json({ error: 'Internal server error', details: e.toString() }, { status: 500 });
  }
}
