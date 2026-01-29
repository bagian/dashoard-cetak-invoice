"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useModal} from "@/components/providers/modal-provider";
import {useToast} from "@/components/providers/toast-provider";
import {deleteCustomerAction} from "@/app/actions";
import Link from "next/link";
import {
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Trash2,
  Pencil,
  X,
  Building2,
  ArrowRight,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
}

export default function CustomerCard({customer}: {customer: Customer}) {
  const router = useRouter();
  const {openModal} = useModal();
  const {showToast} = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // LOGIC TOMBOL HAPUS
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);

    openModal({
      title: "Hapus Customer?",
      message: `Anda akan menghapus "${customer.name}". Semua data terkait customer ini akan hilang secara permanen.`,
      confirmText: "Ya, Hapus",
      variant: "danger",
      onConfirm: async () => {
        const res = await deleteCustomerAction(customer.id);
        if (res?.error) {
          showToast(res.error, "error");
        } else {
          showToast("Customer berhasil dihapus", "success");
        }
      },
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dashboard/customers/${customer.id}/edit`);
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
      href={`/dashboard/customers/${customer.id}`}
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
            <div className="w-10 h-10 rounded-xl bg-[#B6F09C] flex items-center justify-center font-bold text-green-900 text-sm">
              {customer.name
                ? customer.name.substring(0, 2).toUpperCase()
                : "CU"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#1C1C1C] truncate max-w-[150px]">
                {customer.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-500 truncate max-w-[150px]">
                <Building2 size={12} />
                <span>{customer.company || "Personal Client"}</span>
              </div>
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
                  onClick={handleEditClick}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-left"
                >
                  <Pencil size={16} className="text-blue-500" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors text-left"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Backdrop untuk menutup menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-10 pointer-events-auto"
            onClick={closeMenu}
          />
        )}

        {/* Info Content */}
        <div className="space-y-3 mt-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
            <Mail size={16} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-600 truncate">
              {customer.email || "No Email"}
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
            <Phone size={16} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-600">
              {customer.phone || "No Phone"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-gray-50 flex justify-between items-center text-xs">
          <span className="text-gray-400 font-medium">
            View Customer Profile
          </span>
          <div className="p-1.5 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-[#B6F09C] group-hover:text-green-900 transition-colors">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
