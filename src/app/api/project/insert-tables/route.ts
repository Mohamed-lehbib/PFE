import { NextRequest, NextResponse } from 'next/server';
import { insertTables } from '@/queries/tables/create-table/create-table';

export async function POST(req: NextRequest) {
  try {
    const { tablesWithAttributes } = await req.json();
    if (!tablesWithAttributes) {
      return NextResponse.json({ error: 'Missing tablesWithAttributes data' }, { status: 400 });
    }

    const response = await insertTables(tablesWithAttributes);
    return NextResponse.json(response, { status: response.status });
  } catch (e: any) {
    console.log('Internal server error:', e);
    return NextResponse.json({ error: 'Internal server error', details: e.toString() }, { status: 500 });
  }
}
