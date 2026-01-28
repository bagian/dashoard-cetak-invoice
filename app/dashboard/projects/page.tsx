import {createClient} from "@/utils/supabase/server";
import ProjectsClient from "./projects-client";

interface Project {
  id: string;
  name: string;
  client_name: string;
  category: string;
  status: string;
  deadline: string | null;
  progress: number;
}

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  const {data: projects} = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user?.id)
    .order("deadline", {ascending: true});

  return <ProjectsClient initialProjects={(projects || []) as Project[]} />;
}
