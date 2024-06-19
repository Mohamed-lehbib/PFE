import { extractFilePathFromUrl } from "@/utils/extract-filename-from-public-url/extract-file-path-from-url";
import { createClient } from "@supabase/supabase-js";

interface DeleteFileResponse {
  success: boolean;
  message: string;
}

export default async function deleteFile(
  publicUrl: string
): Promise<DeleteFileResponse> {
  try {
    const { bucketName, path } = extractFilePathFromUrl(publicUrl);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.storage.from(bucketName).remove([path]);

    if (error) {
      console.error("Error deleting file:", error);
      return { success: false, message: "Failed to delete file" };
    }

    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
