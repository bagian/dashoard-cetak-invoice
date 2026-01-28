"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useToast} from "@/components/providers/toast-provider";
import {
  Save,
  Loader2,
  AlertCircle,
  User,
  DollarSign,
  Calendar,
} from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface Invoice {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  items?: InvoiceItem[];
  created_at: string;
  invoice_date?: string;
  due_date?: string;
}

export default function EditInvoiceForm({invoice}: {invoice: Invoice}) {
  const router = useRouter();
  const {showToast} = useToast();
  const [customerName, setCustomerName] = useState(invoice.customer_name || "");
  const [totalAmount, setTotalAmount] = useState(invoice.total_amount || 0);
  const [status, setStatus] = useState(invoice.status || "PENDING");
  const [invoiceDate, setInvoiceDate] = useState(
    invoice.invoice_date ? invoice.invoice_date.split("T")[0] : "",
  );
  const [dueDate, setDueDate] = useState(
    invoice.due_date ? invoice.due_date.split("T")[0] : "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!customerName.trim()) {
        const errMsg = "Nama customer tidak boleh kosong";
        setError(errMsg);
        showToast(errMsg, "error");
        setIsLoading(false);
        return;
      }

      if (totalAmount <= 0) {
        const errMsg = "Total amount harus lebih dari 0";
        setError(errMsg);
        showToast(errMsg, "error");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/invoices/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: invoice.id,
          customer_name: customerName.trim(),
          total_amount: totalAmount,
          status: status,
          due_date: dueDate,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let result;
        try {
          result = JSON.parse(errorText);
        } catch {
          result = {error: `Error ${response.status}: ${response.statusText}`};
        }
        const errMsg = result.error || "Gagal mengupdate invoice";
        setError(errMsg);
        showToast(errMsg, "error");
        setIsLoading(false);
        return;
      }

      const result = await response.json();

      showToast("Invoice berhasil diperbarui!", "success");
      setTimeout(() => {
        router.refresh();
        router.push("/dashboard/invoices");
      }, 1500);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errMsg);
      showToast(errMsg, "error");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm mt-6 space-y-6"
    >
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle
            className="text-red-500 flex-shrink-0 mt-0.5"
            size={20}
          />
          <div>
            <p className="font-bold text-red-700">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* --- CUSTOMER NAME --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Customer
        </label>
        <div className="relative">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            disabled={isLoading}
            placeholder="Masukkan nama customer"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      {/* --- TOTAL AMOUNT --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Amount (Rp)
        </label>
        <div className="relative">
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            disabled={isLoading}
            placeholder="Masukkan total amount"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:[-moz-appearance:textfield]"
          />
          <DollarSign
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      {/* --- INVOICE DATE & DUE DATE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Invoice
          </label>
          <div className="relative">
            <input
              type="date"
              value={invoiceDate}
              disabled
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border border-gray-200 outline-none text-gray-600 cursor-not-allowed"
            />
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Tanggal dibuat otomatis, tidak dapat diubah
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Jatuh Tempo
          </label>
          <div className="relative">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
              // TRICK: Agar kalender terbuka saat area input diklik
              onClick={(e) => {
                try {
                  if ("showPicker" in HTMLInputElement.prototype) {
                    e.currentTarget.showPicker();
                  }
                } catch (err) {
                  console.log(err);
                }
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
              [&::-webkit-calendar-picker-indicator]:hidden
              [&::-webkit-inner-spin-button]:hidden"
            />
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* --- STATUS --- */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isLoading}
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-100 appearance-none cursor-pointer outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900"
        >
          <option value="UNPAID">Belum Lunas (Unpaid)</option>
          <option value="DP">Down Payment (DP)</option>
          <option value="PAID">Lunas (Paid)</option>
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-credit-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        >
          <rect width="20" height="14" x="2" y="5" rx="2"></rect>
          <line x1="2" x2="22" y1="10" y2="10"></line>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-6 rounded-xl font-bold bg-[#B6F09C] hover:bg-[#a3d98b] text-black transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={20} />
              Simpan Update
            </>
          )}
        </button>
      </div>
    </form>
  );
}
