import {createClient} from "@/utils/supabase/server";
import Link from "next/link";
import {Plus} from "lucide-react";
import InvoicesClient from "./invoices-client";

export default async function InvoicesPage() {
  const supabase = await createClient();
  const {data: invoices} = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", {ascending: false});

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1C1C1C]">Invoices</h1>
          <p className="text-gray-500">Kelola semua tagihan client.</p>
        </div>
        {/* TOMBOL CREATE INVOICE DISINI */}
        <Link
          href="/dashboard/invoices/create"
          className="flex items-center gap-2 bg-[#1C1C1C] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#B6F09C] hover:text-black transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} /> Buat Invoice Baru
        </Link>
      </div>
      {/* RENDER CLIENT COMPONENT UNTUK PAGINATION */}
      <InvoicesClient invoices={invoices || []} />
    </div>
  );
}
