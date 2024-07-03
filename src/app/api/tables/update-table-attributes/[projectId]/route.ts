import { NextRequest, NextResponse } from 'next/server';
import { updateTableAttributes } from '@/queries/tables/update-table-attributes/update-table-attributes';

export async function PUT(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const { tableId, attributes } = await req.json();
    if (!tableId || !attributes) {
      return NextResponse.json({ error: 'Missing tableId or attributes data' }, { status: 400 });
    }

    const response = await updateTableAttributes(params.projectId, { id: tableId, attributes });
    if ('error' in response) {
      return NextResponse.json({ status: response.status, error: response.error }, { status: response.status });
    }

    return NextResponse.json({ status: response.status, data: response.data }, { status: response.status });
  } catch (e: any) {
    console.log('Internal server error:', e);
    return NextResponse.json({ error: 'Internal server error', details: e.toString() }, { status: 500 });
  }
}
