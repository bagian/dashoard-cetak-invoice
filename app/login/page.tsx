"use client";

import {useState} from "react";
import {signInAction} from "@/app/actions";
import {useToast} from "@/components/providers/toast-provider";
import {
  Mail,
  Lock,
  LogIn,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import {Turnstile} from "@marsidev/react-turnstile"; // Import Library

export default function LoginPage() {
  const {showToast} = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null); // State simpan token

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validasi: Jika captcha belum diisi, jangan kirim data
    if (!captchaToken) {
      showToast(
        "Tolong selesaikan verifikasi Captcha terlebih dahulu.",
        "error",
      );
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    // Tambahkan token captcha ke formData agar bisa dibaca di Server Action
    formData.append("captchaToken", captchaToken);

    const result = await signInAction(formData);

    if (result?.error) {
      showToast(result.error, "error");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Brand Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#B6F09C] rounded-[28px] shadow-xl shadow-green-100 mb-6">
            <LogIn size={36} className="text-green-900" />
          </div>
          <h1 className="text-4xl font-black text-[#1C1C1C] tracking-tight">
            Bagian Corps
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Internal Project & Invoice Manager
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3 ml-1">
                Email Internal
              </label>
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@bagiancorps.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent outline-none focus:border-[#B6F09C] focus:bg-white text-gray-900 placeholder:text-gray-400 font-medium transition-all shadow-sm group-hover:bg-gray-100/50"
                />
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#72ac57] transition-colors"
                  size={20}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-3 ml-1">
                <label className="text-sm font-bold text-gray-800">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Lupa Password?
                </Link>
              </div>
              <div className="relative group">
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent outline-none focus:border-[#B6F09C] focus:bg-white text-gray-900 placeholder:text-gray-400 font-medium transition-all shadow-sm group-hover:bg-gray-100/50"
                />
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#72ac57] transition-colors"
                  size={20}
                />
              </div>
            </div>

            {/* --- CLOUDFLARE TURNSTILE WIDGET --- */}
            <div className="flex justify-center">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => setCaptchaToken(token)}
                options={{
                  theme: "light",
                  size: "normal",
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-[#1C1C1C] hover:bg-black text-white text-lg font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl shadow-gray-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    Masuk Dashboard
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Card */}
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
              <ShieldCheck size={14} />
              <p className="text-[11px] font-bold uppercase tracking-wider">
                Akses Terbatas
              </p>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Tidak punya akses? Hubungi Admin IT Bagian Corps.
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          Secure Login • Bagian Corps v1.0
        </p>
      </div>
    </div>
  );
}
