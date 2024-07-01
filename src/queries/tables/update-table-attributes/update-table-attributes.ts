import { createClient } from '@supabase/supabase-js';

interface AttributeData {
  name: string;
  type: string;
  read: boolean;
  create: boolean;
  update: boolean;
  metaType?: string;
  enumValues?: string[];
}

interface TableAttributes {
  id: string;
  attributes: AttributeData[];
}

export async function updateTableAttributes(project_id: string, tableAttributes: TableAttributes) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('tables')
      .update({ attributes: tableAttributes.attributes })
      .eq('id', tableAttributes.id);

    if (error) {
      console.error(`Error updating table with ID ${tableAttributes.id}:`, error.message);
      return { status: 500, error: error.message };
    }

    return { status: 200, data };
  } catch (error: any) {
    console.error('Error updating table attributes:', error);
    return { status: 500, error: error.message || 'Internal server error' };
  }
}
