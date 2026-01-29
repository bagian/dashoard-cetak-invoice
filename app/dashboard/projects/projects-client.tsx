"use client";

import {useState, useMemo} from "react";
import Link from "next/link";
import {Plus, Search, Briefcase} from "lucide-react";
import ProjectCard from "./project-card";

interface Project {
  id: string;
  name: string;
  client_name: string;
  category: string;
  status: string;
  deadline: string | null;
  progress: number;
}

export default function ProjectsClient({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects berdasarkan search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialProjects;
    }

    const query = searchQuery.toLowerCase();
    return initialProjects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.client_name.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query),
    );
  }, [initialProjects, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#1C1C1C] tracking-tight">
            Projects
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola semua proyek berjalan dan arsip.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B6F09C] text-sm text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <Link
            href="/dashboard/projects/create"
            className="flex items-center gap-2 bg-[#1C1C1C] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#B6F09C] hover:text-black transition-all shadow-lg active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Project</span>
          </Link>
        </div>
      </div>

      {/* --- EMPTY STATE --- */}
      {(!filteredProjects || filteredProjects.length === 0) && (
        <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {searchQuery ? "Tidak ada project ditemukan" : "Belum ada Project"}
          </h3>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            {searchQuery
              ? "Coba cari dengan keyword lain"
              : "Mulai buat project pertama Anda."}
          </p>
        </div>
      )}

      {/* --- PROJECTS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {filteredProjects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
