import { createClient } from "@/utils/supabase/client";

interface ProjectCredentials {
  id: string;
  supabase_url: string;
  supabase_service_role_key: string;
}

export async function updateProjectCredentials(projectCredentials: ProjectCredentials) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project")
      .update({
        supabase_url: projectCredentials.supabase_url,
        supabase_service_role_key: projectCredentials.supabase_service_role_key 
      })
      .eq("id", projectCredentials.id);

    if (error) {
      return { error, status: 500 };
    }

    return { data, status: 200 };
  } catch (error) {
    console.error("Error updating project:", error);
    return { error: "Internal server error", status: 500 };
  }
}