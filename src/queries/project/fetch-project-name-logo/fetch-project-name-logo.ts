import { createClient } from "@/utils/supabase/client";

interface Project {
  name: string;
  project_logo: string;
}

export async function fetchProject(projectId: string): Promise<{ data: Project | null; error: any }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project")
    .select("project_logo, name")
    .eq("id", projectId)
    .single();

  return { data: data || null, error };
}
