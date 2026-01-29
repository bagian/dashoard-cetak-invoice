"use client";

import {useState} from "react";
import AnimatedProgressBar from "./progress-bar";
import {deleteProjectAction} from "@/app/actions";
import Link from "next/link";
import {useModal} from "@/components/providers/modal-provider"; // 1. Import Hook Modal
import {useToast} from "@/components/providers/toast-provider"; // Optional: Toast
import {
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  X,
} from "lucide-react";

// ... Helper Functions Tetap Sama ...
const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700 border-green-200";
    case "DELAYED":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-blue-100 text-blue-700 border-blue-200";
  }
};

const getDaysLeft = (deadline: string | null) => {
  if (!deadline) return "No Date";
  const diff = new Date(deadline).getTime() - new Date().getTime();
  const days = Math.ceil(diff / (1000 * 3600 * 24));
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  return `${days} Days left`;
};

interface Project {
  id: string;
  name: string;
  client_name: string;
  category: string;
  status: string;
  deadline: string | null;
  progress: number;
}

export default function ProjectCard({project}: {project: Project}) {
  const {openModal} = useModal(); // 2. Init Modal
  const {showToast} = useToast(); // 2. Init Toast (jika ada)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // LOGIC TOMBOL HAPUS
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false); // Tutup dropdown menu

    // 3. PANGGIL GLOBAL MODAL
    openModal({
      title: "Hapus Project Ini?",
      message: `Anda akan menghapus project "${project.name}". Tindakan ini tidak bisa dibatalkan.`,
      confirmText: "Ya, Hapus",
      variant: "danger",
      onConfirm: async () => {
        // Logic Hapus dijalankan disini
        const res = await deleteProjectAction(project.id);
        if (res?.error) {
          showToast(res.error, "error");
        } else {
          showToast("Project berhasil dihapus", "success");
        }
      },
    });
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
  };

  return (
    <Link
      href={`/dashboard/projects/${project.id}/edit`}
      className="group block relative"
    >
      <div
        className={`bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm transition-all duration-300 relative h-full z-0 ${
          isMenuOpen
            ? "shadow-lg"
            : "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        }`}
      >
        {/* Header Card */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
              ${project.category === "App Development" ? "bg-yellow-100 text-yellow-700" : "bg-[#B6F09C] text-green-900"}
            `}
            >
              {project.name ? project.name.substring(0, 2).toUpperCase() : "PR"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#1C1C1C] truncate max-w-[110px] sm:max-w-[150px]">
                {project.name}
              </h3>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">
                {project.client_name}
              </p>
            </div>
          </div>

          {/* --- MENU DROPDOWN --- */}
          <div className="relative z-20">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-black transition-colors p-1 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              {isMenuOpen ? <X size={20} /> : <MoreHorizontal size={20} />}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 animate-in fade-in zoom-in-95 duration-200 z-50">
                <button
                  onClick={handleDeleteClick}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-left cursor-pointer"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Backdrop - Tutup menu saat click di area lain */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-10 pointer-events-none"
            onClick={closeMenu}
          />
        )}

        {/* ... SISA KONTEN SAMA ... */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusColor(project.status)}`}
          >
            {project.status}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100 flex items-center gap-1">
            <Calendar size={12} />
            {project.deadline
              ? new Date(project.deadline).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })
              : "-"}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
            <span>Progress</span>
            <span className="text-[#1C1C1C]">{project.progress || 0}%</span>
          </div>
          <AnimatedProgressBar progress={project.progress || 0} />
        </div>

        <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock size={14} />
            <span
              className={`${getDaysLeft(project.deadline) === "Overdue" ? "text-red-500 font-bold" : ""}`}
            >
              {getDaysLeft(project.deadline)}
            </span>
          </div>
          {project.progress === 100 ? (
            <span className="flex items-center gap-1 text-green-600 font-bold">
              <CheckCircle2 size={14} /> Done
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-600">
              <AlertCircle size={14} /> On Track
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
