import { NextRequest, NextResponse } from 'next/server';
import { updateTableStatusActions } from '@/queries/tables/update-table-status-actions/update-table-status-actions';

export async function PUT(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const { updatedTables } = await req.json();
    if (!updatedTables) {
      return NextResponse.json({ error: 'Missing updatedTables data' }, { status: 400 });
    }

    const response = await updateTableStatusActions(params.projectId, updatedTables);

    if ('error' in response) {
      return NextResponse.json({ status: response.status, error: response.error }, { status: response.status });
    }

    return NextResponse.json({ status: response.status, data: response.tables }, { status: response.status });
  } catch (e: any) {
    console.log('Internal server error:', e);
    return NextResponse.json({ error: 'Internal server error', details: e.toString() }, { status: 500 });
  }
}
