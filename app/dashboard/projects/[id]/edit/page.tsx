import {createClient} from "@/utils/supabase/server";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import {redirect} from "next/navigation";
import EditProjectForm from "../edit-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const supabase = await createClient();
  const {id} = await params;

  // Ambil data project berdasarkan ID
  const {data: project} = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    redirect("/dashboard/projects");
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      {/* Header Back */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/projects"
          className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-900" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Edit Project</h1>
          <p className="text-gray-500 text-sm">Kelola status dan progress.</p>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-[#1C1C1C] mb-2">
          {project.name}
        </h2>
        <p className="text-gray-900 text-sm">Client : {project.client_name}</p>
      </div>

      {/* Edit Form */}
      <EditProjectForm project={project} />
    </div>
  );
}
