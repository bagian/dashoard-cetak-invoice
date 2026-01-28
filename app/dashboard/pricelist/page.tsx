"use client";

import {useEffect, useState} from "react";
import {getServicesAction} from "@/app/actions";
import {
  Calculator,
  Plus,
  Trash2,
  FileText,
  Download,
  Zap,
  Layout,
  Smartphone,
  Globe,
  Code,
  Palette,
  Settings2,
} from "lucide-react";
import Link from "next/link";
// Import jsPDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ICON_MAP: Record<string, React.ReactNode> = {
  Layout: <Layout size={18} />,
  Smartphone: <Smartphone size={18} />,
  Zap: <Zap size={18} />,
  Globe: <Globe size={18} />,
  Code: <Code size={18} />,
  Palette: <Palette size={18} />,
};

interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
  icon: string;
}

export default function PricelistPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<
    (Service & {qty: number})[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const res = await getServicesAction();
      if (isMounted) {
        if (res?.data) setServices(res.data as Service[]);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const addService = (service: Service) => {
    const existing = selectedServices.find((s) => s.id === service.id);
    if (existing) {
      setSelectedServices(
        selectedServices.map((s) =>
          s.id === service.id ? {...s, qty: s.qty + 1} : s,
        ),
      );
    } else {
      setSelectedServices([...selectedServices, {...service, qty: 1}]);
    }
  };

  const removeService = (id: string) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== id));
  };

  const totalPrice = selectedServices.reduce(
    (acc, curr) => acc + curr.price * curr.qty,
    0,
  );

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  // --- FUNGSI GENERATE PDF ---
  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString("id-ID");

    // Header - Bagian Corps
    doc.setFontSize(20);
    doc.setTextColor(28, 28, 28);
    doc.text("BAGIAN CORPS", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Elevating Brands through Purposeful Design & Code", 14, 28);
    doc.text(`Tanggal: ${date}`, 14, 34);

    // Garis Pemisah
    doc.setDrawColor(182, 240, 156); // Warna #B6F09C
    doc.setLineWidth(1);
    doc.line(14, 40, 196, 40);

    doc.setFontSize(14);
    doc.setTextColor(28, 28, 28);
    doc.text("ESTIMASI PENAWARAN PROYEK", 14, 50);

    // Tabel Layanan
    autoTable(doc, {
      startY: 55,
      head: [["Layanan", "Kategori", "Qty", "Harga Satuan", "Subtotal"]],
      body: selectedServices.map((item) => [
        item.name,
        item.category,
        item.qty,
        formatRupiah(item.price),
        formatRupiah(item.price * item.qty),
      ]),
      headStyles: {fillColor: [28, 28, 28], textColor: [182, 240, 156]},
      foot: [["", "", "", "TOTAL ESTIMASI", formatRupiah(totalPrice)]],
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [28, 28, 28],
        fontStyle: "bold",
      },
    });

    const getTimestamp = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0"); // Perbaikan: gunakan getHours()
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}${month}${day}${hours}${minutes}${seconds}`;
    };

    const timestamp = getTimestamp();

    // Footer Note
    const finalY =
      (doc as jsPDF & {lastAutoTable: {finalY: number}}).lastAutoTable.finalY +
      10;
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      "* Harga di atas merupakan estimasi awal dan dapat berubah sesuai kompleksitas proyek.",
      14,
      finalY,
    );

    // Simpan PDF
    doc.save(`Quotation_BagianCorps_${timestamp}.pdf`);
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-sans text-gray-400 font-bold">
        Menyiapkan Layanan Bagian Corps...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight">
            Pricelist Generator
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Pilih layanan di bawah untuk membuat estimasi proyek.
          </p>
        </div>
        <Link
          href="/dashboard/pricelist/manage"
          className="flex items-center gap-2 bg-[#1C1C1C] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#B6F09C] hover:text-black transition-all shadow-lg active:scale-95"
        >
          <Settings2 size={18} /> Manage Services
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-gray-900">
            Available Services
          </h3>
          <div className="space-y-3">
            {services.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-gray-100 rounded-[32px] text-center">
                <p className="text-gray-400 text-sm font-bold">
                  Belum ada layanan.
                  <br />
                  Silahkan tambah di menu Manage.
                </p>
              </div>
            ) : (
              services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => addService(service)}
                  className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[24px] hover:border-[#B6F09C] hover:shadow-xl hover:shadow-green-50/50 transition-all group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-[#B6F09C] transition-colors text-gray-400 group-hover:text-green-900">
                      {ICON_MAP[service.icon] || <Zap size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#1C1C1C]">
                        {service.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        {service.category}
                      </p>
                      <p className="text-xs text-green-600 font-black mt-1">
                        {formatRupiah(service.price)}
                      </p>
                    </div>
                  </div>
                  <Plus
                    size={18}
                    className="text-gray-300 group-hover:text-black transition-transform group-active:scale-125"
                  />
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1C1C1C] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-5 text-[#B6F09C] pointer-events-none">
              <Calculator size={200} />
            </div>

            <h3 className="font-black text-lg mb-8 uppercase tracking-widest text-xs text-[#B6F09C]">
              Estimation Summary
            </h3>

            <div className="space-y-4 min-h-[300px]">
              {selectedServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-[32px]">
                  <Calculator size={48} className="text-white/10 mb-4" />
                  <p className="text-gray-500 font-bold italic">
                    Klik layanan di samping untuk menambah estimasi.
                  </p>
                </div>
              ) : (
                selectedServices.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 animate-in slide-in-from-left-2 duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 flex items-center justify-center bg-[#B6F09C] text-black font-black rounded-xl text-xs shadow-lg shadow-green-900/20">
                        {item.qty}x
                      </span>
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          {formatRupiah(item.price)} per unit
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-black text-[#B6F09C] text-lg">
                        {formatRupiah(item.price * item.qty)}
                      </p>
                      <button
                        onClick={() => removeService(item.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all relative z-10"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">
                  Total Quote Amount
                </p>
                <h2 className="text-5xl font-black text-[#B6F09C] tracking-tighter">
                  {formatRupiah(totalPrice)}
                </h2>
              </div>
              <button
                onClick={generatePDF} // HUBUNGKAN FUNGSI DI SINI
                disabled={selectedServices.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-[#B6F09C] text-black font-black rounded-2xl hover:bg-white hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100 active:scale-95 shadow-xl shadow-green-900/20 cursor-pointer disabled:cursor-not-allowed"
              >
                <Download size={22} /> Export to PDF
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="font-black text-[#1C1C1C] text-sm uppercase tracking-wider">
                Professional Quote
              </h4>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Gunakan estimasi ini sebagai dasar penawaran resmi untuk klien
                **Bagian Corps**.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
