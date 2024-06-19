import { createClient } from "@/utils/supabase/client";

interface Project {
  id: string;
  project_logo?: string;
  name: string;
  description?: string | null;
  user_id: string;
}

export async function updateProject(project: Project) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project")
      .update({
        project_logo: project.project_logo,
        name: project.name,
        description: project.description,
      })
      .eq("id", project.id);

    if (error) {
      return { error, status: 500 };
    }

    return { data, status: 200 };
  } catch (error) {
    console.error("Error updating project:", error);
    return { error: "Internal server error", status: 500 };
  }
}