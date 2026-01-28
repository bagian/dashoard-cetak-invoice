"use client";

import {useState, useEffect} from "react";
import {createProjectAction, getCustomersAction} from "@/app/actions"; // Panggil getCustomersAction
import {useRouter} from "next/navigation";
import {useToast} from "@/components/providers/toast-provider";
import {
  ArrowLeft,
  Briefcase,
  User,
  Calendar,
  Save,
  PenTool,
  Smartphone,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function CreateProjectPage() {
  const router = useRouter();
  const {showToast} = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<{id: string; name: string}[]>([]);

  // State Form
  const [name, setName] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(""); // Simpan ID yang dipilih
  const [category, setCategory] = useState("Web Development");
  const [deadline, setDeadline] = useState("");

  // Ambil data customer saat halaman dimuat
  useEffect(() => {
    async function fetchCustomers() {
      const data = await getCustomersAction();
      setCustomers(data);
    }
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Cari nama customer berdasarkan ID untuk dikirim ke action
    const client = customers.find((c) => c.id === selectedCustomerId);

    if (!client) {
      showToast("Silakan pilih customer terlebih dahulu", "error");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("clientName", client.name); // Kirim nama customer
    formData.append("category", category);
    formData.append("deadline", deadline);

    const result = await createProjectAction(formData);

    if (result?.error) {
      showToast(result.error, "error");
      setIsLoading(false);
    } else {
      showToast("Project berhasil dibuat!", "success");
      setTimeout(() => {
        router.push("/dashboard/projects");
      }, 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Navigasi */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/projects"
          className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">
            Buat Project Baru
          </h1>
          <p className="text-gray-500 text-sm">
            Tambahkan project ke dalam pipeline.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Project Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nama Project
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Contoh: Redesign Website Company Profile"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 placeholder:text-gray-400 transition-all"
              />
              <Briefcase
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {/* 2. Client Name (Dropdown Version) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Pilih Customer
            </label>
            <div className="relative group">
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 appearance-none transition-all cursor-pointer"
              >
                <option value="" disabled>
                  Pilih Klien
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>

              {/* Icon User (Kiri) */}
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />

              {/* Icon Chevron (Kanan) */}
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
            <p className="text-[12px] text-gray-400 mt-2 ml-1">
              Klien tidak ada?{" "}
              <Link
                href="/dashboard/customers/create"
                className="text-blue-500 hover:underline"
              >
                Tambah Customer Baru
              </Link>
            </p>
          </div>

          {/* 3. Category & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Kategori Project
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory("Web Development")}
                  className={`flex flex-row items-center justify-center p-3 rounded-xl border-2 transition-all gap-2 ${
                    category === "Web Development"
                      ? "border-[#B6F09C] bg-green-50/50 text-green-800"
                      : "border-gray-100 hover:border-gray-200 text-gray-500"
                  }`}
                >
                  <PenTool size={20} className="mb-1" />
                  <span className="text-[10px] font-bold">Web Dev</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("App Development")}
                  className={`flex flex-row items-center justify-center p-3 rounded-xl border-2 transition-all gap-2 ${
                    category === "App Development"
                      ? "border-yellow-400 bg-yellow-50/50 text-yellow-800"
                      : "border-gray-100 hover:border-gray-200 text-gray-500"
                  }`}
                >
                  <Smartphone size={20} className="mb-1" />
                  <span className="text-[10px] font-bold">App Dev</span>
                </button>
              </div>
              <input type="hidden" name="category" value={category} />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Deadline
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  onClick={(e) => {
                    try {
                      if ("showPicker" in HTMLInputElement.prototype) {
                        e.currentTarget.showPicker();
                      }
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 placeholder:text-gray-400 transition-all cursor-pointer min-h-[50px]
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

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#1C1C1C] hover:bg-black text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <Save size={20} /> Simpan Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
