"use client";

import {useState, useEffect} from "react";
import {createClient} from "@/utils/supabase/client";
import {User} from "@supabase/supabase-js";
import {useToast} from "@/components/providers/toast-provider";
import {
  User as UserIcon,
  Shield,
  Users,
  Mail,
  Save,
  Loader2,
  Lock,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {useRouter} from "next/navigation";
import TeamManagement from "./team-management"; // Komponen yang akan kita buat dibawah

export default function SettingsPage() {
  const router = useRouter();
  const {showToast} = useToast();
  const [activeTab, setActiveTab] = useState<"profile" | "team">("profile");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: {user},
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const supabase = createClient();

    const {error} = await supabase.auth.updateUser({
      data: {full_name: fullName.trim()},
    });

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Profil Bagian Corps diperbarui!", "success");
      router.refresh();
    }
    setIsSaving(false);
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-sans text-gray-400">
        Loading Settings...
      </div>
    );

  const isAdmin = user?.app_metadata?.role === "admin";

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 font-sans">
      <header>
        <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight">
          Settings
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Kelola akun dan tim internal Bagian Corps.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold ${activeTab === "profile" ? "bg-white border border-gray-100 shadow-sm text-[#1C1C1C]" : "text-gray-400 hover:text-gray-600"}`}
          >
            <div className="flex items-center gap-3">
              <UserIcon size={18} /> My Profile
            </div>
            {activeTab === "profile" && <ChevronRight size={16} />}
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab("team")}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold ${activeTab === "team" ? "bg-white border border-gray-100 shadow-sm text-[#1C1C1C]" : "text-gray-400 hover:text-gray-600"}`}
            >
              <div className="flex items-center gap-3">
                <Users size={18} /> Team Members
              </div>
              {activeTab === "team" && <ChevronRight size={16} />}
            </button>
          )}

          <div className="pt-10">
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                router.push("/login");
              }}
              className="w-full flex items-center gap-3 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === "profile" ? (
            <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                <div className="w-16 h-16 bg-[#B6F09C] rounded-2xl flex items-center justify-center text-green-900 font-black text-2xl">
                  {fullName.substring(0, 1).toUpperCase() || "A"}
                </div>
                <div>
                  <h3 className="font-black text-xl text-[#1C1C1C]">
                    {fullName || "User"}
                  </h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">
                    {user?.app_metadata?.role || "Member"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#B6F09C] focus:bg-white outline-none transition-all font-medium"
                    />
                    <UserIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    Email Internal
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 text-gray-400 font-medium cursor-not-allowed"
                    />
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-10 py-4 bg-[#1C1C1C] text-white rounded-2xl font-black hover:bg-black transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-gray-200"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Save size={20} /> Save Changes
                    </>
                  )}
                </button>
              </form>
            </section>
          ) : (
            <TeamManagement />
          )}
        </div>
      </div>
    </div>
  );
}
