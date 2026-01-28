import {createClient} from "@/utils/supabase/server";
import {notFound, redirect} from "next/navigation";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  Globe,
  Server,
  Database,
  PenTool,
  Shield,
  Smartphone,
} from "lucide-react";

type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
  icon?: string;
};

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
const formatDate = (dateStr: string) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

const IconDisplay = ({type}: {type?: string}) => {
  const props = {size: 18, className: "text-gray-600"};
  switch (type) {
    case "server":
      return <Server {...props} />;
    case "database":
      return <Database {...props} />;
    case "design":
      return <PenTool {...props} />;
    case "security":
      return <Shield {...props} />;
    case "mobile":
      return <Smartphone {...props} />;
    default:
      return <Globe {...props} />;
  }
};

const getStatusColor = (status: string) => {
  if (status === "PAID") return "bg-green-100 text-green-800 border-green-200";
  if (status === "DP") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-red-100 text-red-800 border-red-200";
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const {data: invoice, error} = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !invoice) notFound();

  const items: InvoiceItem[] = Array.isArray(invoice.items)
    ? (invoice.items as unknown as InvoiceItem[])
    : JSON.parse(invoice.items || "[]");

  return (
    <div className="bg-gray-100 min-h-screen p-8 print:p-0 print:bg-white print:min-h-0">
      {/* CSS Print: Reset Margin Browser */}
      <style type="text/css" media="print">{`
        @page { size: A4; margin: 0; } 
        body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}</style>

      {/* NAVIGASI */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={18} /> Kembali
        </Link>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm cursor-default">
          <Printer size={18} /> Ctrl + P
        </button>
      </div>

      {/* KERTAS INVOICE */}
      <div className="max-w-[210mm] mx-auto bg-white p-10 rounded-xl shadow-lg border border-gray-200 print:shadow-none print:border-none print:max-w-none print:w-full print:p-[10mm] print:rounded-none">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#1C1C1C] text-[#B6F09C] rounded-lg flex items-center justify-center font-bold text-xl print:bg-black print:text-gray-200">
                B
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
                Bagian Corps
              </h1>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Sidokare Indah
              <br />
              Kota Sidoarjo, Jawa Timur, 61214
              <br />
              support@bagian.web.id
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-gray-800 mb-2 tracking-widest">
              INVOICE
            </h2>
            <p className="font-mono text-gray-600 mb-4">
              #{invoice.id.slice(0, 8).toUpperCase()}
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-end gap-4">
                <span className="text-gray-500">Tanggal:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(invoice.created_at)}
                </span>
              </div>
              {invoice.due_date && (
                <div className="flex justify-end gap-4">
                  <span className="text-gray-500">Jatuh Tempo:</span>
                  <span className="font-medium text-red-600">
                    {formatDate(invoice.due_date)}
                  </span>
                </div>
              )}
              <div className="flex justify-end gap-4 items-center mt-2">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getStatusColor(invoice.status)} print:border-gray-300`}
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* INFO CLIENT (FIX PADDING & BORDER) */}
        {/* 'print:p-6' -> Agar teks tidak nempel border saat diprint */}
        <div className="mb-10 bg-gray-50 p-6 rounded-xl print:bg-transparent print:p-6 print:border print:border-gray-100 break-inside-avoid">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
            Ditagihkan Kepada:
          </p>
          <h3 className="text-xl font-bold text-gray-900">
            {invoice.customer_name}
          </h3>
          {invoice.customer_address && (
            <p className="text-gray-600 text-sm mt-1">
              {invoice.customer_address}
            </p>
          )}
          {invoice.customer_email && (
            <p className="text-gray-500 text-sm mt-1">
              {invoice.customer_email}
            </p>
          )}
        </div>

        {/* TABEL ITEM */}
        <div className="mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="py-3 px-6 font-semibold">Deskripsi Layanan</th>
                <th className="py-3 px-6 text-center w-24">Qty</th>
                <th className="py-3 px-6 text-right w-36">Harga</th>
                <th className="py-3 px-6 text-right w-36">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {items.map((item, index) => (
                <tr key={index} className="break-inside-avoid">
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center gap-3">
                      {/* FIX: Hapus class 'print:hidden' agar icon tetap muncul saat diprint */}
                      <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <IconDisplay type={item.icon} />
                      </div>
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-6 text-right text-gray-500">
                    {new Intl.NumberFormat("id-ID").format(item.price)}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-gray-900">
                    {new Intl.NumberFormat("id-ID").format(
                      item.quantity * item.price,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER & TOTAL */}
        <div className="break-inside-avoid">
          <div className="flex justify-end border-t border-gray-200 pt-6 mb-12">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatRupiah(invoice.total_amount)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-2">
                <span className="font-bold text-lg text-gray-900">
                  Total Tagihan
                </span>
                <span className="font-bold text-xl text-blue-600 print:text-black">
                  {formatRupiah(invoice.total_amount)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-dashed border-gray-300 flex justify-between items-end">
            <div className="text-xs text-gray-500 max-w-sm">
              <p className="font-bold text-gray-700 mb-1">
                Catatan Pembayaran:
              </p>
              <p className="whitespace-pre-line leading-relaxed">
                {invoice.notes || "Terima kasih atas kerjasamanya."}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-16">Hormat Kami,</p>
              <div className="h-px w-40 bg-gray-400"></div>
              <p className="text-xs font-bold text-gray-700 mt-2">
                Bagian Corps Web Services
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
