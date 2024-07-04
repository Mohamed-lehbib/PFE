import { createProjectClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

export async function uploadFile(
  supabaseUrl: string,
  supabaseServiceRoleKey: string,
  bucketName: string,
  file: any
) {
  const supabase = createProjectClient(supabaseUrl, supabaseServiceRoleKey);
  const validFileName = file.name.replace(/[^a-zA-Z0-9-._*'()&$@=;:+,?/ ]/g, "");
  const filePath = `public/${uuidv4()}/${validFileName}`;

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (error) {
    return { error };
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  return { data, error: null };
}
