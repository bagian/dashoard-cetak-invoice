"use client";

import {useState, use} from "react";
import {updateCustomerAction, Customer} from "@/app/actions";
import {useToast} from "@/components/providers/toast-provider";
import {
  Save,
  Loader2,
  AlertCircle,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {useRouter} from "next/navigation";

export default function EditCustomerForm({
  customer,
  params,
}: {
  customer: Customer;
  params: Promise<{id: string}>;
}) {
  const router = useRouter();
  const {showToast} = useToast();

  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // Inisialisasi state langsung dari props customer
  const [name, setName] = useState(customer.name || "");
  const [company, setCompany] = useState(customer.company || "");
  const [email, setEmail] = useState(customer.email || "");
  const [phone, setPhone] = useState(customer.phone || "");
  const [address, setAddress] = useState(customer.address || "");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!name.trim()) {
        const errMsg = "Nama lengkap tidak boleh kosong";
        setError(errMsg);
        showToast(errMsg, "error");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name.trim());
      formData.append("company", company.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("address", address.trim());

      const result = await updateCustomerAction(formData);

      if (result?.error) {
        setError(result.error);
        showToast(result.error, "error");
        setIsLoading(false);
        return;
      }

      showToast("Data customer berhasil diperbarui!", "success");
      setTimeout(() => {
        router.refresh();
        router.push(`/dashboard/customers/${id}`);
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
      className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm mt-6 space-y-6 font-sans"
    >
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900">
        <Save className="text-[#B6F09C]" />
        Edit Profil Customer
      </h3>

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

      {/* Input Nama Lengkap */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
          Nama Lengkap
        </label>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 transition-all font-sans font-medium"
          />
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      {/* Input Perusahaan */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
          Perusahaan
        </label>
        <div className="relative">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 transition-all font-sans font-medium"
          />
          <Building2
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 transition-all font-sans font-medium"
            />
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Telepon */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
            Nomor Telepon
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={14}
              value={phone}
              onChange={(e) =>
                setPhone(e.currentTarget.value.replace(/[^0-9]/g, ""))
              }
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 transition-all font-sans font-medium"
            />
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* Alamat */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 font-sans">
          Alamat Lengkap
        </label>
        <div className="relative">
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:ring-2 focus:ring-[#B6F09C] text-gray-900 transition-all resize-none font-sans font-medium"
          />
          <MapPin className="absolute left-3 top-4 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="flex-1 py-3 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all font-sans"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-6 rounded-xl font-bold bg-[#B6F09C] hover:bg-[#a3d98b] text-black transition-all shadow-lg flex items-center justify-center gap-2 font-sans"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={20} /> Simpan Update
            </>
          )}
        </button>
      </div>
    </form>
  );
}
