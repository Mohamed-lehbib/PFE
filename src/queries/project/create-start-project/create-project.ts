import { createClient } from "@/utils/supabase/client";

interface Project {
  project_logo?: string;
  name: string;
  description?: string | null;
  user_id: string;
}

export async function insertProject(project: Project) {
  try {
    const supabase = createClient();
    const { data, error, status } = await supabase.from("project").insert([
      {
        project_logo: project.project_logo,
        name: project.name,
        description: project.description,
        user_id: project.user_id,
      },
    ]);

    if (error) {
      return { status, error };
    }

    return { status, data };
  } catch (error) {
    console.error("Error inserting project:", error);
    return { status: 500, error: "Internal server error" };
  }
}
