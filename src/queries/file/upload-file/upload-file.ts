import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export default async function uploadOneFile(buketName: string, file: File): Promise<string> {
  try {
    const validFileName = file.name.replace(/[^a-zA-Z0-9-._*'()&$@=;:+,?/ ]/g, '');
    if (validFileName !== file.name) {
      console.error('File name contains unauthorized characters');
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!);

    const { data, error } = await supabase.storage.from(buketName).upload(`/${uuidv4()}/${validFileName}`, file);

    if (error) {
      console.error('Error creating file:', error);
      return ''; // Return an empty string in case of an error
    }

    const { data: fileFromStorage } = supabase.storage.from(buketName).getPublicUrl(data.path);
    return fileFromStorage.publicUrl || ''; // Ensure a string is always returned
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return ''; // Return an empty string in case of an error
  }
}
