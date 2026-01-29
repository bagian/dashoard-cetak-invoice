"use client";

import {Download, Printer} from "lucide-react";

export function InvoiceActions() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      <div className="flex gap-2 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <Download size={18} /> Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <Printer size={18} /> Print Invoice
        </button>
      </div>
    </>
  );
}
