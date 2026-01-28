"use client";

import {createContext, useContext, useState, useEffect, ReactNode} from "react";
import {XCircle, CheckCircle2, X} from "lucide-react";

type ToastType = "success" | "error";

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({children}: {children: ReactNode}) {
  const [toast, setToast] = useState<{message: string; type: ToastType} | null>(
    null,
  );

  // Fungsi yang akan dipanggil dari mana saja
  const showToast = (message: string, type: ToastType) => {
    setToast({message, type});
  };

  // Timer auto-dismiss 3 detik
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}

      {/* --- GLOBAL UI COMPONENT --- */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-10 fade-in duration-300 border
          ${
            toast.type === "error"
              ? "bg-red-500 text-white border-red-600"
              : "bg-[#B6F09C] text-[#1C1C1C] border-[#a3d98b]"
          }
        `}
        >
          {toast.type === "error" ? (
            <XCircle size={24} />
          ) : (
            <CheckCircle2 size={24} className="text-green-600" />
          )}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider">
              {toast.type === "error" ? "Gagal" : "Berhasil"}
            </h4>
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

// Custom Hook agar mudah dipanggil
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
