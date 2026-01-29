"use client";

import {useState, useEffect} from "react";
import {LogOut} from "lucide-react";
import {SidebarNav, SettingsNav} from "./sidebar-nav";
import {createClient} from "@/utils/supabase/client";
import {User} from "@supabase/supabase-js";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({data: {user}}) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const userEmail = user?.email || "";
  const userRole = (user?.app_metadata?.role as string) || "Member";
  const userInitial = (user?.user_metadata?.full_name || user?.email || "U")
    .substring(0, 1)
    .toUpperCase();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-[1rem] right-[1.7rem] z-[150] w-10 h-10 flex flex-col justify-center items-center focus:outline-none cursor-pointer"
      >
        <div className="relative w-6 h-5">
          <span
            className={`absolute h-0.5 w-6 transition-all duration-300 ${isOpen ? "rotate-45 top-2 bg-white" : "top-0 bg-[#141414]"}`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-[#141414] transition-all duration-300 top-2 ${isOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`absolute h-0.5 w-6 transition-all duration-300 ${isOpen ? "-rotate-45 top-2 bg-white" : "top-4 bg-[#141414]"}`}
          />
        </div>
      </button>
      <div
        className={`fixed inset-0 z-[140] transition-all duration-500 ${isOpen ? "visible" : "invisible delay-500"}`}
      >
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-[280px] bg-[#141414] shadow-2xl transition-transform duration-500 ease-in-out flex flex-col justify-between ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-10  pt-2 border-b border-white/5 pb-6">
              <div className="gap-3 border-gray-200 sm:hidden">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-[#B6F09C] rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-[0_0_15px_rgba(182,240,156,0.3)]">
                    {userInitial}
                  </div>
                  <div className="text-start sm:block">
                    <p className="text-sm font-black text-white font-sans uppercase">
                      {userRole}
                    </p>
                    <span className="text-[12px] font-mono text-gray-400 overflow-hidden text-ellipsis block max-w-[180px] whitespace-nowrap">
                      {userEmail}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div onClick={() => setIsOpen(false)}>
              <SidebarNav />
            </div>
          </div>

          <div className="p-6 border-t border-white/5">
            <div onClick={() => setIsOpen(false)}>
              <SettingsNav />
            </div>
            <form action="/auth/signout" method="post" className="mt-4">
              <button
                type="submit"
                className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-all text-sm group"
              >
                <LogOut
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform"
                />{" "}
                Log Out
              </button>
            </form>
          </div>
        </aside>
      </div>
    </>
  );
}
