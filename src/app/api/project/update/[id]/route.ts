import { NextRequest, NextResponse } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';
import deleteFile from '@/queries/file/delete-file/delete-file';
import uploadOneFile from '@/queries/file/upload-file/upload-file';
import { updateProject } from '@/queries/project/edit-start-project/edit-project';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const project_logo = formData.get('project_logo') as File | null;
    const current_logo_url = formData.get('current_logo_url') as string | null;

    const supabase = createClientForServer();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    const user_id = userData.user.id;

    if (!name || !user_id) {
      console.log('Missing name or user_id');
      return NextResponse.json({ error: 'Missing name or user_id' }, { status: 400 });
    }

    let projectLogoUrl = current_logo_url ?? '';
    if (project_logo && current_logo_url) {
      // Delete the current logo
      await deleteFile(current_logo_url);

      // Upload the new logo
      projectLogoUrl = await uploadOneFile('project_logo', project_logo);
      if (!projectLogoUrl) {
        return NextResponse.json({ error: 'Error uploading project logo' }, { status: 500 });
      }
    }

    const project = {
      project_logo: projectLogoUrl,
      name,
      description,
      user_id,
      id: params.id,
    };

    const updateResult = await updateProject(project);
    return NextResponse.json({ message: 'Project updated successfully' }, { status: updateResult.status ?? 200 });
  } catch (e: any) {
    console.log('Internal server error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error', details: e.toString() }, { status: 500 });
  }
}