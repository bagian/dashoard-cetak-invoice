"use client";

import {useState, useMemo} from "react";
import Link from "next/link";
import {ChevronLeft, ChevronRight, FileText} from "lucide-react";
import InvoiceActions from "./invoice-actions";

const ITEMS_PER_PAGE = 10;

interface Invoice {
  id: string;
  customer_name: string;
  status: string;
  created_at: string;
  total_amount: number;
  invoice_date?: string;
  due_date?: string;
}

export default function InvoicesClient({
  invoices: initialInvoices,
}: {
  invoices: Invoice[];
}) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [currentPage, setCurrentPage] = useState(1);

  const {paginatedInvoices, totalPages} = useMemo(() => {
    const total = Math.ceil(invoices.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginated = invoices.slice(startIndex, endIndex);
    return {paginatedInvoices: paginated, totalPages: total};
  }, [invoices, currentPage]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  return (
    <>
      {invoices && invoices.length > 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-full">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto w-full">
            <table className="min-w-full text-left text-sm text-gray-600 border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Tanggal Invoice
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Tanggal Jatuh Tempo
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-[#1C1C1C]">
                      {inv.customer_name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          inv.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(inv.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      {inv.due_date
                        ? new Date(inv.due_date).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      Rp {inv.total_amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/invoice/${inv.id}`}
                          className="text-blue-600 hover:underline font-bold"
                        >
                          Invoices
                        </Link>
                        <InvoiceActions
                          id={inv.id}
                          onDelete={() => handleDelete(inv.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {paginatedInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1C1C1C] text-base mb-1 break-words">
                      {inv.customer_name}
                    </h3>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        inv.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/invoice/${inv.id}`}
                      className="text-blue-600 hover:underline font-bold text-sm whitespace-nowrap"
                    >
                      Invoices
                    </Link>
                    <InvoiceActions
                      id={inv.id}
                      onDelete={() => handleDelete(inv.id)}
                    />
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 flex-shrink-0">
                      Tanggal Invoice:
                    </span>
                    <span className="text-gray-900 font-medium text-right">
                      {new Date(inv.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500 flex-shrink-0">
                      Jatuh Tempo:
                    </span>
                    <span className="text-gray-900 font-medium text-right">
                      {inv.due_date
                        ? new Date(inv.due_date).toLocaleDateString("id-ID")
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 pt-2 border-t border-gray-100">
                    <span className="text-gray-500 font-bold flex-shrink-0">
                      Total:
                    </span>
                    <span className="text-[#1C1C1C] font-bold font-mono text-right break-all">
                      Rp {inv.total_amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION FOOTER */}
          <div className="bg-gray-50 border-t border-gray-100 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 font-medium text-center md:text-left">
              Menampilkan{" "}
              <span className="font-bold text-[#1C1C1C]">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              hingga{" "}
              <span className="font-bold text-[#1C1C1C]">
                {Math.min(currentPage * ITEMS_PER_PAGE, invoices.length)}
              </span>{" "}
              dari{" "}
              <span className="font-bold text-[#1C1C1C]">
                {invoices.length}
              </span>{" "}
              data
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="flex items-center justify-center gap-2 overflow-x-auto">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center gap-2 w-10 h-10 rounded-lg border border-gray-200 hover:bg-[#94d377] disabled:opacity-10 disabled:cursor-not-allowed transition-colors bg-[#B6F09C] text-black cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({length: totalPages}, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-bold transition-colors flex-shrink-0 cursor-pointer ${
                        currentPage === page
                          ? "bg-[#B6F09C] text-black"
                          : "border border-gray-200 text-gray-600 hover:bg-[#94d377]"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center gap-2 w-10 h-10 rounded-lg border border-gray-200 hover:bg-[#94d377] disabled:opacity-10 disabled:cursor-not-allowed transition-colors bg-[#B6F09C] text-black cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-300" size={32} />
          </div>
          <p className="text-gray-500">Belum ada invoice dibuat.</p>
        </div>
      )}
    </>
  );
}
