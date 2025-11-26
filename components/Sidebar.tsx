"use client";

import { Home, Activity, Settings, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/contexts/UIContext";

export default function Sidebar() {
  const { t } = useUI();
  const pathname = usePathname();

  return (
    <div className="w-60 bg-[#280E0A]/70 backdrop-blur-md border-r border-red-900/30 flex flex-col p-5 rounded-xl">

      <div className="flex flex-col items-center mb-8 text-orange-400">
        <img
          src="/favicon.ico"
          alt="logo"
          className="w-10 h-10 mb-2 drop-shadow-[0_0_6px_rgba(255,140,80,0.6)]"
        />
        <span className="text-xl font-bold">CanTho FireGuard</span>
      </div>

      <nav className="flex flex-col gap-3">

        {/* Trang chủ */}
        <Link
          href="/"
          className={`flex items-center gap-3 p-3 rounded-lg transition
            ${
              pathname === "/"
                ? "bg-red-900/50 text-orange-300 font-semibold"
                : "hover:bg-red-900/30"
            }
          `}
        >
          <Home size={20} /> {t("nav.home")}
        </Link>

        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 p-3 rounded-lg transition
            ${
              pathname === "/dashboard"
                ? "bg-red-900/50 text-orange-300 font-semibold"
                : "hover:bg-red-900/30"
            }
          `}
        >
          <LayoutDashboard size={20} /> {t("nav.dashboard")}
        </Link>

        {/* Nhật ký */}
        <Link
          href="/dashboard/logs"
          className={`flex items-center gap-3 p-3 rounded-lg transition
            ${
              pathname === "/dashboard/logs"
                ? "bg-red-900/50 text-orange-300 font-semibold"
                : "hover:bg-red-900/30"
            }
          `}
        >
          <Activity size={20} /> {t("nav.logs")}
        </Link>

        {/* Cài đặt */}
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 p-3 rounded-lg transition
            ${
              pathname === "/dashboard/settings"
                ? "bg-red-900/50 text-orange-300 font-semibold"
                : "hover:bg-red-900/30"
            }
          `}
        >
          <Settings size={20} /> {t("nav.settings")}
        </Link>
      </nav>

      <div className="mt-auto pt-6 text-center text-sm text-gray-500">
        v1.0.0
      </div>
    </div>
  );
}
