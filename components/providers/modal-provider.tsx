"use client";

import {createContext, useContext, useState, ReactNode} from "react";
import {AlertTriangle, Trash2, X} from "lucide-react";

interface ModalOptions {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>; // Fungsi yang akan dijalankan saat Confirm
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "info"; // Bisa merah (hapus) atau biru (info)
}

interface ModalContextType {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({children}: {children: ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ModalOptions>({
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "danger",
  });

  const openModal = (opts: ModalOptions) => {
    setOptions({
      confirmText: "Ya, Lanjutkan",
      cancelText: "Batal",
      variant: "danger",
      ...opts,
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await options.onConfirm(); // Jalankan fungsi hapus/aksi yang dikirim
      closeModal();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <ModalContext.Provider value={{openModal, closeModal}}>
      {children}

      {/* --- GLOBAL MODAL UI --- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={closeModal} // Klik background tutup modal
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Stop klik tembus
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto 
              ${options.variant === "danger" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
            >
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              {options.title}
            </h3>

            <p className="text-sm text-gray-500 text-center mb-6">
              {options.message}
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {options.cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-colors shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed
                  ${
                    options.variant === "danger"
                      ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                      : "bg-blue-500 hover:bg-blue-600 shadow-blue-200"
                  }`}
              >
                {isLoading ? "Memproses..." : options.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

// Hook Custom
export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
