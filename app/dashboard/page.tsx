"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {getDashboardData} from "@/app/actions";
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from "recharts";

// --- TIPE DATA (Strict Mode) ---
type DashboardData = {
  stats: {
    totalRevenue: number;
    totalInvoices: number;
    paidInvoices: number;
    pendingInvoices: number;
  };
  chartData: {name: string; revenue: number}[];
  projects: {id: string; name: string; status: string}[];
  invoices: {
    id: string;
    customer_name: string;
    total_amount: number;
    status: "PAID" | "PENDING";
    created_at: string;
    due_date?: string;
  }[];
  projectStats: {
    web: {count: number; progress: number};
    app: {count: number; progress: number};
  };
  holidays: Record<string, string>;
};

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);

// --- FIX ERROR: Gunakan TooltipProps<number, string> pengganti 'any' ---
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<number, string> & {
  payload?: Array<{value: number; payload: {name: string}}>;
}) => {
  if (active && payload && payload.length > 0) {
    const value = payload[0].value;
    const label = payload[0].payload.name;
    return (
      <div className="bg-[#1C1C1C] text-white p-3 rounded-lg shadow-xl border border-gray-700">
        <p className="text-xs font-bold text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-bold">
          {typeof value === "number" ? formatRupiah(value) : value}
        </p>
      </div>
    );
  }
  return null;
};

// --- HELPER KALENDER ---
const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Calendar State
  const [date, setDate] = useState(new Date());
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const prevMonth = () => setDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setDate(new Date(currentYear, currentMonth + 1, 1));

  useEffect(() => {
    async function initDashboard() {
      try {
        // 1. Ambil User (Client Side)
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);

        // 2. Ambil Data Dashboard
        const res = await getDashboardData();
        if (res) setData(res as DashboardData);
      } catch (err) {
        console.error("Dashboard Init Error:", err);
      } finally {
        setLoading(false);
      }
    }
    initDashboard();
  }, []);

  if (loading || !data)
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Memuat Data Dashboard...
      </div>
    );

  const {stats, chartData, invoices, projectStats, holidays} = data;

  // Generate Calendar Grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const calendarGrid = [
    ...Array(firstDay).fill(null),
    ...Array.from({length: daysInMonth}, (_, i) => i + 1),
  ];

  // User Header Logic
  const userEmail = user?.email || "guest@bagian.corps";
  const userInitial = userEmail.substring(0, 1).toUpperCase();
  const userRole =
    user?.app_metadata?.role === "admin" ? "Super Admin" : "Member";

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 animate-in fade-in duration-700">
        <div>
          <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight font-sans">
            Hello, {user?.user_metadata?.full_name || "Bagian Corps"}! 👋
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Here&apos;s your overview of your business today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-[#1C1C1C] font-sans">
                {userRole}
              </p>
              <p className="text-[11px] font-bold text-gray-400">{userEmail}</p>
            </div>
            <div className="w-12 h-12 bg-[#1C1C1C] rounded-2xl flex items-center justify-center text-[#B6F09C] font-black text-xl shadow-lg shadow-gray-200">
              {userInitial}
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS CARDS (ICONS RESTORED) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card 1: Revenue */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold text-[#1C1C1C]">
                {formatRupiah(stats.totalRevenue)}
              </h3>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-full group-hover:bg-[#B6F09C] transition-colors">
              <DollarSign
                size={20}
                className="text-gray-600 group-hover:text-black"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={10} /> +12%
            </span>
            <span className="text-[10px] text-gray-400">from last month</span>
          </div>
        </div>

        {/* Card 2: Invoices */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">
                Total Invoices
              </p>
              <h3 className="text-2xl font-bold text-[#1C1C1C]">
                {stats.totalInvoices}
              </h3>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-full group-hover:bg-[#B6F09C] transition-colors">
              <Users
                size={20}
                className="text-gray-600 group-hover:text-black"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={10} /> +8%
            </span>
            <span className="text-[10px] text-gray-400">new invoices</span>
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">
                Pending Amount
              </p>
              <h3 className="text-2xl font-bold text-[#1C1C1C]">
                {stats.pendingInvoices}{" "}
                <span className="text-sm font-normal text-gray-400">Inv</span>
              </h3>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-full group-hover:bg-red-100 transition-colors">
              <DollarSign
                size={20}
                className="text-gray-600 group-hover:text-red-600"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              <TrendingDown size={10} /> -2%
            </span>
            <span className="text-[10px] text-gray-400">unpaid invoices</span>
          </div>
        </div>

        {/* Card 4: Active Projects */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">
                Active Projects
              </p>
              <h3 className="text-2xl font-bold text-[#1C1C1C]">
                {projectStats
                  ? projectStats.web.count + projectStats.app.count
                  : 0}
              </h3>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-full group-hover:bg-[#B6F09C] transition-colors">
              <Briefcase
                size={20}
                className="text-gray-600 group-hover:text-black"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={10} /> +4%
            </span>
            <span className="text-[10px] text-gray-400">ongoing</span>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* CHART */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg text-[#1C1C1C] mb-8">
            Sales Overview
          </h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={40}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: "#9ca3af", fontSize: 12}}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{fill: "#9ca3af", fontSize: 12}}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  cursor={{fill: "#f5f6fa"}}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="revenue" radius={[6, 6, 6, 6]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === chartData.length - 1 ? "#B6F09C" : "#E8E8E8"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-[#1C1C1C]">
              {date.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all text-xs cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all text-xs cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-4 text-center text-xs font-bold text-gray-400 mb-2">
            <span className="text-red-500">Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>

          <div className="grid grid-cols-7 gap-y-2 gap-x-2 text-center text-xs font-medium text-gray-700 flex-1 content-start">
            {calendarGrid.map((day, i) => {
              if (day === null)
                return <div key={`empty-${i}`} className="aspect-square"></div>;

              const checkDate = new Date(currentYear, currentMonth, day);
              const dayOfWeek = checkDate.getDay(); // 0 = Minggu

              // --- LOGIC TANGGAL MERAH ---
              const holidayKey = `${currentMonth}-${day}`;
              const holidayName = holidays ? holidays[holidayKey] : null;
              const isHoliday = dayOfWeek === 0 || !!holidayName;

              const isToday =
                day === new Date().getDate() &&
                currentMonth === new Date().getMonth() &&
                currentYear === new Date().getFullYear();

              const hasEvent = invoices.some((inv) => {
                if (!inv.due_date) return false;
                const d = new Date(inv.due_date);
                return (
                  d.getDate() === day &&
                  d.getMonth() === currentMonth &&
                  d.getFullYear() === currentYear
                );
              });

              // Get invoices for this date (unpaid only)
              const invoicesOnDay = invoices.filter((inv) => {
                if (!inv.due_date || inv.status === "PAID") return false;
                const d = new Date(inv.due_date);
                return (
                  d.getDate() === day &&
                  d.getMonth() === currentMonth &&
                  d.getFullYear() === currentYear
                );
              });

              const getInvoiceStatusColor = (status: string) => {
                if (status === "DP") return "bg-yellow-100 text-yellow-700";
                return "bg-orange-100 text-orange-700";
              };

              return (
                <div key={day} className="relative group">
                  <div
                    className={`aspect-square flex flex-col items-center justify-center rounded-full relative cursor-pointer transition-colors
                            ${
                              isToday
                                ? "bg-[#B6F09C] text-black font-bold shadow-md"
                                : "hover:bg-gray-50"
                            }
                            ${
                              isHoliday &&
                              !isToday &&
                              invoicesOnDay.length === 0
                                ? "text-red-500 font-bold"
                                : ""
                            }
                            ${
                              invoicesOnDay.length > 0 && !isToday
                                ? "text-indigo-600 font-bold bg-indigo-50"
                                : ""
                            }
                        `}
                  >
                    {day}
                    {hasEvent && !isToday && invoicesOnDay.length === 0 && (
                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-1"></span>
                    )}
                    {invoicesOnDay.length > 0 && !isToday && (
                      <span className="w-1 h-1 bg-indigo-600 rounded-full mt-1"></span>
                    )}
                  </div>
                  {/* Tooltip Libur */}
                  {holidayName && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap bg-red-500 text-white text-[10px] px-2 py-1 rounded shadow-lg z-10">
                      {holidayName}
                    </div>
                  )}
                  {/* Tooltip Invoice */}
                  {invoicesOnDay.length > 0 && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-56 bg-white border border-indigo-200 rounded-lg shadow-lg z-20 p-3">
                      <div className="space-y-2">
                        {invoicesOnDay.map((inv) => (
                          <div
                            key={inv.id}
                            className="text-xs border-b border-indigo-100 pb-2 last:border-0 last:pb-0"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <p className="font-bold text-gray-900">
                                  {inv.customer_name}
                                </p>
                                <p className="text-gray-600">
                                  {formatRupiah(inv.total_amount)}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded text-[9px] font-bold flex-shrink-0 ${getInvoiceStatusColor(
                                  inv.status,
                                )}`}
                              >
                                {inv.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="mt-4 flex justify-center gap-4 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#B6F09C] rounded-full"></span>{" "}
              Hari Ini
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>{" "}
              Libur
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>{" "}
              Tagihan Belum Lunas
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM WIDGETS */}
      {projectStats && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-[#1C1C1C] p-8 rounded-[32px] text-white shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg">Project Status</h3>
              <MoreHorizontal className="text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Web Dev */}
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Web Development
                </p>
                <h4 className="text-3xl font-bold mb-6">
                  {projectStats.web.progress}%{" "}
                  <span className="text-xs font-normal text-gray-400">
                    Completed
                  </span>
                </h4>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#B6F09C] h-full rounded-full transition-all duration-1000"
                    style={{width: `${projectStats.web.progress}%`}}
                  ></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-right">
                  {projectStats.web.count} Active Projects
                </p>
              </div>
              {/* App Dev */}
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                  App Development
                </p>
                <h4 className="text-3xl font-bold mb-6">
                  {projectStats.app.progress}%{" "}
                  <span className="text-xs font-normal text-gray-400">
                    Completed
                  </span>
                </h4>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full rounded-full transition-all duration-1000"
                    style={{width: `${projectStats.app.progress}%`}}
                  ></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-right">
                  {projectStats.app.count} Active Projects
                </p>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-[#1C1C1C]">
                Recent History
              </h3>
              <Link
                href="/dashboard/invoices"
                className="text-xs font-bold text-gray-400 hover:text-black"
              >
                View All
              </Link>
            </div>
            <div className="space-y-6">
              {invoices.length === 0 && (
                <p className="text-gray-400 text-sm">No history.</p>
              )}
              {invoices.slice(0, 4).map((inv) => (
                <div key={inv.id} className="flex items-start gap-4">
                  <div
                    className={`mt-1 ${
                      inv.status === "PAID" ? "text-green-500" : "text-gray-300"
                    }`}
                  >
                    {inv.status === "PAID" ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-[#1C1C1C]">
                          {inv.customer_name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Created:{" "}
                          {new Date(inv.created_at).toLocaleDateString(
                            "id-ID",
                            {day: "numeric", month: "short", year: "numeric"},
                          )}
                        </p>
                      </div>
                      <div className="text-center">
                        <span
                          className={`block text-[10px] font-bold px-2 py-1 rounded mb-1 ${
                            inv.status === "PAID"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {inv.status}
                        </span>
                        <span className="text-[12px] text-gray-700 font-mono">
                          {formatRupiah(inv.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
