import { NextRequest, NextResponse } from 'next/server';
import { getTablesByProjectId } from '@/queries/tables/get-tables-by-project-id/get-tables-by-project-id';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const response = await getTablesByProjectId(params.projectId);

    if ('error' in response) {
      return NextResponse.json({ status: response.status, error: response.error }, { status: response.status });
    }

    return NextResponse.json({ status: response.status, data: response.tables }, { status: response.status });
  } catch (e: any) {
    console.log('Internal server error:', e);
    return NextResponse.json({ error: 'Internal server error', details: e.toString() }, { status: 500 });
  }
}
