import { NextRequest, NextResponse } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';
import uploadOneFile from '@/queries/file/upload-file/upload-file';
import { insertProject } from '@/queries/project/create-start-project/create-project';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const project_logo = formData.get('project_logo') as File | null;

    const supabase = createClientForServer();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    const user_id = data.user.id;

    if (!name || !user_id) {
      console.log('Missing name or user_id');
      return NextResponse.json({ error: 'Missing name or user_id' }, { status: 400 });
    }

    let projectLogoUrl = '';
    if (project_logo) {
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
    };

    const response = await insertProject(project);
    return NextResponse.json(response, { status: response.status });
  } catch (e: any) {
    console.log('Internal server error:', e);
    return NextResponse.json({ error: 'Internal server error', details: e.toString() }, { status: 500 });
  }
}
