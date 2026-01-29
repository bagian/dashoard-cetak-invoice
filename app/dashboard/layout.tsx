import {LogOut} from "lucide-react";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {SidebarNav, SettingsNav} from "./sidebar-nav";
import {MobileNav} from "./mobile-nav";
import Link from "next/link";
import BagianLogo from "@/public/logo/bagian-logo-new.png";
import BagianLogoBlack from "@/public/logo/bagian-logo-new-black.png";
import Image from "next/image";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex font-sans">
      {/* 1. MOBILE NAV (Hanya muncul di Mobile) */}
      <div className="lg:hidden">
        <MobileNav />
      </div>

      {/* 2. SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-72 bg-[#141414] text-gray-400 fixed h-full z-20 flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2 pt-2 border-b border-white/5 pb-6">
            <div className="w-10 h-10 bg-[#B6F09C] text-black rounded-lg flex items-center justify-center font-bold text-lg">
              <Image src={BagianLogoBlack} alt="Logo" width={20} height={20} />
            </div>
            <h1 className="font-bold text-white text-xl tracking-wide">
              Bagian Corps
            </h1>
          </div>
          <SidebarNav />
        </div>
        <div className="p-6">
          <SettingsNav />
          <form action="/auth/signout" method="post" className="mt-4">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-all text-sm cursor-pointer">
              <LogOut size={18} /> Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Header Mobile Branding */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white backdrop-blur-md px-6 py-4 border-b border-gray-100 flex justify-between items-center shadow-sm">
          <div className="font-bold text-xl tracking-tight text-[#141414]">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="bg-[#060330] p-2 rounded-xl block w-fit">
                <Image src={BagianLogo} alt="Logo" width={20} height={20} />
              </span>
              Bagian Corps
            </Link>
          </div>
        </div>

        {/* Content Container - Locked Center */}
        <div className="flex-1 flex justify-center w-full">
          <div className="w-full max-w-7xl p-6 pt-24 lg:pt-10 md:pt-32">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
