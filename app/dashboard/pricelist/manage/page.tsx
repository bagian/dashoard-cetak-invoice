"use client";

import {useState, useEffect, useCallback} from "react";
import {
  getServicesAction,
  createServiceAction,
  deleteServiceAction,
} from "@/app/actions";
import {useToast} from "@/components/providers/toast-provider";
import {useModal} from "@/components/providers/modal-provider"; // Import Modal Provider
import {
  Plus,
  Trash2,
  Layout,
  Smartphone,
  Zap,
  Globe,
  Code,
  Palette,
  Save,
  Loader2,
  ArrowLeft,
  Monitor,
  Database,
  ShieldCheck,
  Layers,
  Cpu,
  PenTool,
  CreditCard,
  ChevronDown,
  Wallpaper,
} from "lucide-react";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
  icon: string;
  created_at?: string;
}

const ICON_OPTIONS = [
  {name: "Layout", icon: <Layout size={20} />},
  {name: "Monitor", icon: <Monitor size={20} />},
  {name: "Smartphone", icon: <Smartphone size={20} />},
  {name: "Palette", icon: <Palette size={20} />},
  {name: "PenTool", icon: <PenTool size={20} />},
  {name: "Code", icon: <Code size={20} />},
  {name: "Zap", icon: <Zap size={20} />},
  {name: "Database", icon: <Database size={20} />},
  {name: "ShieldCheck", icon: <ShieldCheck size={20} />},
  {name: "Globe", icon: <Globe size={20} />},
  {name: "Layers", icon: <Layers size={20} />},
  {name: "Cpu", icon: <Cpu size={20} />},
];

export default function ManageServicesPage() {
  const {showToast} = useToast();
  const {openModal} = useModal(); // Gunakan openModal
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("UI/UX");
  const [selectedIcon, setSelectedIcon] = useState("Layout");

  const loadData = useCallback(async () => {
    try {
      const res = await getServicesAction();
      if (res && res.data) {
        setServices(res.data as Service[]);
      }
    } catch (error) {
      console.error("Gagal memuat layanan:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: name,
      price: parseInt(price),
      category: category,
      icon: selectedIcon,
    };

    const res = await createServiceAction(payload);

    if (res?.error) {
      showToast(res.error, "error");
    } else {
      showToast("Layanan berhasil ditambahkan!", "success");
      setName("");
      setPrice("");
      loadData();
    }
    setIsSubmitting(false);
  };

  // --- REVISI LOGIC HAPUS MENGGUNAKAN MODAL ---
  const handleDelete = (id: string, serviceName: string) => {
    openModal({
      title: "Hapus Layanan?",
      message: `Anda akan menghapus layanan "${serviceName}". Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Ya, Hapus",
      variant: "danger",
      onConfirm: async () => {
        const res = await deleteServiceAction(id);
        if (res?.success) {
          showToast("Layanan berhasil dihapus", "success");
          loadData();
        } else if (res?.error) {
          showToast(res.error, "error");
        }
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8 font-sans animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <Link
          href="/dashboard/pricelist"
          className="flex items-center gap-2 text-gray-500 hover:text-black font-bold transition-all"
        >
          <ArrowLeft size={18} /> Kembali ke Kalkulator
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6 h-fit">
          <h2 className="text-xl font-black text-[#1C1C1C]">
            Tambah Layanan Baru
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Nama Layanan
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Desain Landing Page"
                  required
                  className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 text-sm"
                />
                <Monitor
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#72ac57]"
                  size={20}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Harga Layanan
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1.500.000"
                    value={price ? Number(price).toLocaleString("id-ID") : ""}
                    onChange={(e) =>
                      setPrice(e.target.value.replace(/\D/g, ""))
                    }
                    required
                    className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 text-sm"
                  />
                  <CreditCard
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#72ac57]"
                    size={20}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Layanan
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-100 appearance-none cursor-pointer outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 text-sm"
                  >
                    {/* PERBAIKAN: Value harus unik agar terbaca semua */}
                    <option value="UI/UX">UI/UX Design</option>
                    <option value="Web">Web Dev</option>
                    <option value="App">App Dev</option>
                    <option value="CMS">Custom CMS</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                  <Wallpaper
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
            </div>

            <div className="py-8">
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Pilih Icon
              </label>
              <div className="grid grid-cols-6 gap-2">
                {ICON_OPTIONS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedIcon(item.name)}
                    className={`p-4 rounded-xl flex items-center justify-center transition-all cursor-pointer ${selectedIcon === item.name ? "bg-[#B6F09C] text-black shadow-lg scale-105" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full py-4 text-black bg-[#B6F09C] hover:bg-[#a3d98b] rounded-xl font-bold transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Save size={20} /> Simpan Layanan
                </>
              )}
            </button>
          </form>
        </section>

        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900 ml-2">
            Daftar Layanan Saat Ini
          </h2>
          <div className="space-y-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="bg-white p-5 rounded-[24px] border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-900 group rounded-xl group-hover:bg-[#B6F09C] group-hover:text-gray-900 transition-colors">
                    {ICON_OPTIONS.find((i) => i.name === s.icon)?.icon || (
                      <Zap size={20} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C1C1C] text-sm">
                      {s.name}
                    </h4>
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(s.price)}
                    </p>
                  </div>
                </div>
                {/* Hapus menggunakan Modal */}
                <button
                  onClick={() => handleDelete(s.id, s.name)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
