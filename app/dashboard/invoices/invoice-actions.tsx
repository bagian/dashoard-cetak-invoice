"use client";

import {useState} from "react";
import Link from "next/link";
import {MoreVertical, Trash2, Edit2} from "lucide-react";
import {deleteInvoiceAction} from "@/app/actions";
import {useToast} from "@/components/providers/toast-provider";
import {useModal} from "@/components/providers/modal-provider";

interface InvoiceActionProps {
  id: string;
  onDelete?: () => void;
}

export default function InvoiceActions({id, onDelete}: InvoiceActionProps) {
  const {showToast} = useToast();
  const {openModal} = useModal();
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteClick = () => {
    openModal({
      title: "Hapus Invoice",
      message:
        "Apakah Anda yakin ingin menghapus invoice ini? Tindakan ini tidak dapat dibatalkan.",
      variant: "danger",
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      onConfirm: async () => {
        try {
          const result = await deleteInvoiceAction(id);
          if (result.error) {
            showToast(result.error, "error");
            return;
          }
          showToast("Invoice berhasil dihapus!", "success");
          onDelete?.();
        } catch (err) {
          const errMsg =
            err instanceof Error ? err.message : "Terjadi kesalahan";
          showToast(errMsg, "error");
        }
      },
    });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[#94d377] bg-[#B6F09C] rounded-lg transition-colors cursor-pointer"
      >
        <MoreVertical size={18} className="text-gray-900" />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <Link
              href={`/dashboard/invoices/${id}/edit`}
              className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-700 border-b border-gray-100 transition-colors"
            >
              <Edit2 size={16} />
              Edit Invoice
            </Link>
            <button
              onClick={handleDeleteClick}
              className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
            >
              <Trash2 size={16} />
              Hapus Invoice
            </button>
          </div>
        </>
      )}
    </div>
  );
}
