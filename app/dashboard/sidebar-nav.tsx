"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Briefcase,
  Users,
} from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if (href !== "/dashboard" && pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Business Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/projects",
      label: "Projects",
      icon: Briefcase,
    },
    {
      href: "/dashboard/invoices",
      label: "Invoices",
      icon: FileText,
    },
    {
      href: "/dashboard/customers",
      label: "Customers",
      icon: Users,
    },
  ];

  return (
    <nav className="space-y-4">
      <p className="px-4 text-[10px] font-bold text-gray-600 mb-4 uppercase tracking-widest">
        Main Menu
      </p>

      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all group ${
              active
                ? "text-black bg-[#B6F09C] shadow-[0_0_15px_rgba(182,240,156,0.3)]"
                : "text-gray-400 hover:text-white hover:bg-[#1F1F1F]"
            }`}
          >
            <Icon
              size={20}
              className={
                active
                  ? "text-black"
                  : "group-hover:text-[#B6F09C] transition-colors"
              }
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SettingsNav() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="space-y-1 mt-8">
      <p className="px-4 text-[10px] font-bold text-gray-600 mb-4 uppercase tracking-widest">
        Settings
      </p>
      <Link
        href="/settings"
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all group ${
          isActive("/settings")
            ? "text-black bg-[#B6F09C] shadow-[0_0_15px_rgba(182,240,156,0.3)]"
            : "text-gray-400 hover:text-white hover:bg-[#1F1F1F]"
        }`}
      >
        <Settings
          size={20}
          className={
            isActive("/settings")
              ? "text-black"
              : "group-hover:text-[#B6F09C] transition-colors"
          }
        />
        Settings
      </Link>
    </nav>
  );
}
