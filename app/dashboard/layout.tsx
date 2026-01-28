import Link from "next/link";
import {Search, Bell, MessageSquare, LogOut} from "lucide-react";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import {SidebarNav, SettingsNav} from "./sidebar-nav";

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
      {/* --- SIDEBAR (DARK THEME) --- */}
      <aside className="w-72 bg-[#141414] text-gray-400 fixed h-full z-20 flex flex-col justify-between hidden lg:flex transition-all duration-300">
        <div className="p-6">
          {/* BRANDING */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-[#B6F09C] text-black rounded-lg flex items-center justify-center font-bold text-lg">
              B
            </div>
            <h1 className="font-bold text-white text-xl tracking-wide">
              Bagian Corps
            </h1>
          </div>

          {/* SEARCH BAR (Visual Only) */}
          <div className="relative mb-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full bg-[#1F1F1F] text-sm text-gray-300 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B6F09C] transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-[#2B2B2B] px-1.5 py-0.5 rounded text-gray-500 font-mono">
              ⌘K
            </div>
          </div>

          {/* MENU ITEMS */}
          <SidebarNav />
        </div>

        {/* BOTTOM CARD WIDGET */}
        <div className="p-6">
          <div className="bg-[#1F1F1F] rounded-2xl p-5 relative overflow-hidden group cursor-pointer">
            <div className="absolute right-0 top-0 w-20 h-20 bg-[#B6F09C] blur-[50px] opacity-10 group-hover:opacity-20 transition-all"></div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
              Upcoming Event
            </p>
            <h4 className="text-white font-bold text-sm mb-1">
              Business Sprint
            </h4>
            <p className="text-xs text-gray-500 mb-3">09:30 AM - 11:30 AM</p>
            <div className="flex items-center gap-2">
              <span className="bg-[#B6F09C] text-black text-[10px] font-bold px-2 py-1 rounded">
                Business
              </span>
              <span className="bg-[#2B2B2B] text-white text-[10px] font-bold px-2 py-1 rounded">
                Meeting
              </span>
            </div>
          </div>

          <SettingsNav />

          <form action="/auth/signout" method="post" className="mt-4">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-all text-sm cursor-pointer">
              <LogOut size={18} /> Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-72 p-4 md:p-8 lg:p-10">
        {/* Header Mobile Only */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <div className="font-bold text-xl">Bagian Corps</div>
          {/* Simple Menu Trigger could go here */}
        </div>

        {children}
      </main>
    </div>
  );
}
