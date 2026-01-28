"use client";

import {useState} from "react";
import {UserPlus, Mail, Shield, Trash2, CheckCircle2} from "lucide-react";

export default function TeamManagement() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  return (
    <div className="space-y-8">
      {/* Invite Member */}
      <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
        <h3 className="font-black text-lg text-[#1C1C1C] flex items-center gap-2">
          <UserPlus className="text-[#B6F09C]" /> Add Team Member
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
          <div className="relative">
            <input
              type="email"
              placeholder="team@bagiancorps.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#B6F09C] focus:bg-white outline-none transition-all font-medium"
            />
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#B6F09C] outline-none font-bold text-gray-600 cursor-pointer"
            >
              <option value="member">Member (Designer)</option>
              <option value="admin">Admin (Manager)</option>
            </select>
            <button className="px-6 py-3 bg-[#B6F09C] text-black font-black rounded-xl hover:bg-[#a3d98b] transition-all shadow-lg shadow-green-50">
              Invite
            </button>
          </div>
        </div>
      </section>

      {/* Team List (Contoh Tampilan) */}
      <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <h3 className="font-black text-lg text-[#1C1C1C] mb-6 uppercase tracking-widest text-xs">
          Current Members
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-4 font-sans">
              <div className="w-10 h-10 bg-[#1C1C1C] text-white rounded-xl flex items-center justify-center font-bold">
                S
              </div>
              <div>
                <p className="font-bold text-sm text-[#1C1C1C]">
                  superadmin@bagian.web.id
                </p>
                <p className="text-[10px] text-green-600 font-black uppercase tracking-tighter flex items-center gap-1">
                  <Shield size={10} /> Super Admin
                </p>
              </div>
            </div>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
              Active
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
