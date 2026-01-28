import {LogOut} from "lucide-react";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {SidebarNav, SettingsNav} from "./sidebar-nav";
import {MobileNav} from "./mobile-nav";

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
      <div className="lg:hidden">
        <MobileNav />
      </div>
      <aside className="hidden lg:flex w-72 bg-[#141414] text-gray-400 fixed h-full z-20 flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2 pt-2 border-b border-white/5 pb-6">
            <div className="w-8 h-8 bg-[#B6F09C] text-black rounded-lg flex items-center justify-center font-bold text-lg">
              B
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

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen relative">
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white backdrop-blur-md px-6 py-4 border-b border-gray-100 flex justify-between items-center shadow-sm">
          <div className="font-bold text-xl tracking-tight text-[#141414]">
            Bagian Corps
          </div>
        </div>
        {/* pt-24 buat mobile biar gak ketutup header, lg:pt-10 buat desktop */}
        <div className="p-4 md:p-8 lg:p-10 pt-24 lg:pt-10 md:pt-32">
          {children}
        </div>
      </main>
    </div>
  );
}
