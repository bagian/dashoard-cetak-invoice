"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {createCustomerAction} from "@/app/actions";
import {useToast} from "@/components/providers/toast-provider";
import {
  ArrowLeft,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function CreateCustomerPage() {
  const router = useRouter();
  const {showToast} = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createCustomerAction(formData);

    if (result?.error) {
      showToast(result.error, "error");
      setIsLoading(false);
    } else {
      showToast("Customer berhasil ditambahkan!", "success");
      setTimeout(() => {
        router.push("/dashboard/customers");
      }, 1000);
    }
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/customers"
          className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Tambah Customer</h1>
          <p className="text-gray-500 text-sm">
            Masukkan detail kontak klien baru Anda.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama & Perusahaan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Contoh: John Doe"
                  className="w-full pl-13 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] transition-all text-gray-900"
                />
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Perusahaan (Opsional)
              </label>
              <div className="relative">
                <input
                  name="company"
                  type="text"
                  placeholder="Contoh: PT. Maju Jaya"
                  className="w-full pl-13 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] transition-all text-gray-900"
                />
                <Building
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="w-full pl-13 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] transition-all text-gray-900"
                />
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nomor Telepon
              </label>
              <div className="relative group">
                <input
                  name="phone"
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={14}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^0-9]/g,
                      "",
                    );
                  }}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-13 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] transition-all text-gray-900"
                />
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#72ac57] transition-colors"
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Alamat
            </label>
            <div className="relative">
              <textarea
                name="address"
                rows={3}
                placeholder="Alamat lengkap klien..."
                className="w-full pl-13 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] transition-all resize-none text-gray-900"
              ></textarea>
              <MapPin
                className="absolute left-3 top-4 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#1C1C1C] hover:bg-black text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={20} /> Simpan Customer
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
