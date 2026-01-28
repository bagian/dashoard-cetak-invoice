"use client";

import {useState, useRef} from "react"; // Tambah useRef
import {createInvoiceAction} from "@/app/actions";
import {useRouter} from "next/navigation";
import {
  Plus,
  Save,
  ArrowLeft,
  Calculator,
  Globe,
  Server,
  Database,
  PenTool,
  Shield,
  Smartphone,
  User,
  CreditCard,
  ChevronDown,
  PackageOpen,
  Calendar,
  MapPin,
  Mail,
  FileText,
  Trash2,
} from "lucide-react";
import Link from "next/link";

type IconType =
  | "globe"
  | "server"
  | "database"
  | "design"
  | "security"
  | "mobile";

type ItemRow = {
  name: string;
  quantity: number;
  price: number;
  icon: IconType;
};

export default function CreateInvoicePage() {
  const router = useRouter();

  // Ref untuk input date agar bisa dipanggil manual
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [status, setStatus] = useState("UNPAID");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<ItemRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addItem = () =>
    setItems([...items, {name: "", quantity: 1, price: 0, icon: "globe"}]);
  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = (
    index: number,
    field: keyof ItemRow,
    value: string | number,
  ) => {
    const newItems = [...items];
    // @ts-expect-error: Dynamic key access for rapid development
    newItems[index][field] = value;
    setItems(newItems);
  };

  const grandTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const formatRupiah = (num: number) => "Rp " + num.toLocaleString("id-ID");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return alert("Isi minimal satu layanan.");

    setIsLoading(true);
    const formData = new FormData();

    formData.append("customerName", customerName);
    formData.append("customerEmail", customerEmail);
    formData.append("customerAddress", customerAddress);
    formData.append("status", status);
    formData.append("dueDate", dueDate);
    formData.append("notes", notes);
    formData.append("items", JSON.stringify(items));
    formData.append("totalAmount", grandTotal.toString());

    try {
      const result = await createInvoiceAction(formData);
      if (result?.id) router.push(`/invoice/${result.id}`);
      else {
        alert(result?.error || "Gagal.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const renderIcon = (type: IconType, size = 18) => {
    const icons = {
      globe: Globe,
      server: Server,
      database: Database,
      design: PenTool,
      security: Shield,
      mobile: Smartphone,
    };
    const Icon = icons[type] || Globe;
    return <Icon size={size} />;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#F5F6FA]">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Invoice Baru</h1>
          <p className="text-gray-500 text-sm">
            Lengkapi data invoice secara detail.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          {/* INFO CLIENT */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-[#1C1C1C] mb-6 border-l-4 border-[#B6F09C] pl-3">
              Informasi Client
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Perusahaan / Client
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT. Mencari Cinta Sejati"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 placeholder:text-gray-400"
                  />
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Client
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="email@client.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 placeholder:text-gray-400"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Jln. Sudirman No. 1..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 placeholder:text-gray-400"
                  />
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DETAIL PEMBAYARAN */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-[#1C1C1C] mb-6 border-l-4 border-[#B6F09C] pl-3">
              Detail Pembayaran
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Pembayaran
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-100 appearance-none cursor-pointer outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900"
                  >
                    <option value="UNPAID">Belum Lunas (Unpaid)</option>
                    <option value="DP">Down Payment (DP)</option>
                    <option value="PAID">Lunas (Paid)</option>
                  </select>
                  <CreditCard
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>

              {/* --- FIX KALENDER FINAL (No Error + Clickable) --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jatuh Tempo (Due Date)
                </label>
                <div className="relative">
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    // HANYA trigger showPicker saat KLIK. Jangan taruh di onFocus.
                    onClick={(e) => {
                      try {
                        // Ini memaksa kalender muncul dimanapun user klik di kotak ini
                        e.currentTarget.showPicker();
                      } catch (error) {
                        // Fallback aman jika browser jadul (jarang terjadi)
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 cursor-pointer
                    
                    /* 1. Sembunyikan Icon Bawaan Chrome/Edge/Safari (Webkit) */
                    [&::-webkit-calendar-picker-indicator]:hidden 
                    [&::-webkit-inner-spin-button]:hidden
                    
                    /* 2. Reset Appearance untuk Firefox agar lebih bersih (tapi icon mungkin tetap ada kecil) */
                    appearance-none"
                  />

                  {/* Icon Custom Kita (Visual) */}
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
              {/* -------------------- */}
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan / Info Pembayaran
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] resize-none text-gray-900 placeholder:text-gray-400"
                  placeholder="Masukkan detail rekening bank atau catatan lain..."
                ></textarea>
                <FileText
                  className="absolute left-3 top-4 text-gray-400"
                  size={18}
                />
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1C1C1C] border-l-4 border-[#B6F09C] pl-3">
                Rincian Layanan
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-bold text-green-700 bg-green-100 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
              >
                <Plus size={14} /> Tambah Item
              </button>
            </div>
            <div className="space-y-3">
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                    <PackageOpen size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    Belum ada layanan
                  </p>
                  <button
                    type="button"
                    onClick={addItem}
                    className="mt-2 text-xs text-blue-600 hover:underline"
                  >
                    Klik untuk tambah
                  </button>
                </div>
              )}
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-start relative hover:z-20 z-0 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex-1 relative group">
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r border-gray-200 z-10">
                      <div className="relative group/icon cursor-pointer p-2 h-full flex items-center justify-center">
                        <div className="text-gray-500 hover:text-black transition-colors">
                          {renderIcon(item.icon)}
                        </div>
                        <div className="hidden group-hover/icon:block absolute top-full left-0 mt-1 bg-white shadow-2xl border border-gray-100 rounded-xl p-1.5 flex flex-col gap-1 w-40 z-50 animate-in fade-in zoom-in-95 duration-200">
                          <p className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1">
                            Pilih Icon
                          </p>
                          {(
                            [
                              "globe",
                              "server",
                              "database",
                              "design",
                              "security",
                              "mobile",
                            ] as IconType[]
                          ).map((ic) => (
                            <div
                              key={ic}
                              onClick={() => updateItem(index, "icon", ic)}
                              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-xs cursor-pointer transition-colors ${item.icon === ic ? "bg-green-50 text-green-700 font-bold" : "text-gray-600"}`}
                            >
                              {renderIcon(ic, 16)}{" "}
                              <span className="capitalize">{ic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Nama Layanan"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value)
                      }
                      required
                      className="w-full pl-14 pr-3 py-3 rounded-xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-[#B6F09C] text-sm transition-all text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      required
                      className="w-full px-3 py-3 rounded-xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-[#B6F09C] text-sm transition-all text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="w-40">
                    <input
                      type="number"
                      min="0"
                      placeholder="Harga"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "price",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      required
                      className="w-full px-3 py-3 rounded-xl bg-gray-50 border border-transparent outline-none focus:bg-white focus:border-[#B6F09C] text-sm transition-all text-right font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- KOLOM KANAN (RINGKASAN) --- */}
        <div className="space-y-6">
          <div className="bg-[#1C1C1C] p-6 rounded-3xl text-white sticky top-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 opacity-80 border-b border-gray-700 pb-4">
              <Calculator size={20} />{" "}
              <span className="font-medium">Ringkasan</span>
            </div>
            <div className="mb-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2 text-xs uppercase font-bold tracking-wider">
                <User size={14} /> Client
              </div>
              <p className="text-lg font-medium text-white break-words">
                {customerName || <span className="text-gray-600">...</span>}
              </p>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Total Item</span>
                <span>{items.length} Layanan</span>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl mt-4 border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Total Tagihan</p>
                <span className="font-bold text-2xl text-[#B6F09C] tracking-tight">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#B6F09C] hover:bg-[#a3d98b] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <Save size={20} /> Simpan & Cetak
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
