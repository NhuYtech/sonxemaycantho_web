"use client";

import { Home, Activity, Settings, LayoutDashboard, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/contexts/UIContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { t } = useUI();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className="hidden lg:block lg:w-60 shrink-0 lg:ml-6 lg:my-6">
        <div className="w-60 h-full bg-[#152A45]/80 backdrop-blur-md border-r border-blue-700/40 flex flex-col p-5 rounded-xl">
          <div className="flex flex-col items-center mb-8 text-sky-400">
            <img
              src="/favicon.ico"
              alt="logo"
              className="w-10 h-10 mb-2 drop-shadow-[0_0_6px_rgba(47,128,237,0.6)]"
            />
            <span className="text-xl font-bold">CanTho FireGuard</span>
          </div>

          <nav className="flex flex-col gap-3 overflow-y-auto flex-1">
            <Link
              href="/"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all
                ${
                  pathname === "/"
                    ? "bg-blue-900/50 text-sky-300 font-semibold"
                    : "hover:bg-blue-900/30 text-gray-300"
                }
              `}
            >
              <Home size={20} /> {t("nav.home")}
            </Link>

            <Link
              href="/dashboard"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all
                ${
                  pathname === "/dashboard"
                    ? "bg-blue-900/50 text-sky-300 font-semibold"
                    : "hover:bg-blue-900/30 text-gray-300"
                }
              `}
            >
              <LayoutDashboard size={20} /> {t("nav.dashboard")}
            </Link>

            <Link
              href="/dashboard/logs"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all
                ${
                  pathname === "/dashboard/logs"
                    ? "bg-blue-900/50 text-sky-300 font-semibold"
                    : "hover:bg-blue-900/30 text-gray-300"
                }
              `}
            >
              <Activity size={20} /> {t("nav.logs")}
            </Link>

            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all
                ${
                  pathname === "/dashboard/settings"
                    ? "bg-blue-900/50 text-sky-300 font-semibold"
                    : "hover:bg-blue-900/30 text-gray-300"
                }
              `}
            >
              <Settings size={20} /> {t("nav.settings")}
            </Link>
          </nav>

          <div className="mt-auto pt-6 text-center text-sm text-gray-500 shrink-0">
            v1.0.0
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - Fixed Overlay */}
      <div className={`
        lg:hidden
        fixed inset-y-0 left-0
        w-72 max-w-[85vw]
        bg-[#152A45]/95
        backdrop-blur-xl
        border-r border-blue-700/40
        flex flex-col p-6
        z-50
        shadow-2xl
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg hover:bg-blue-900/40 active:bg-blue-900/60 transition-colors"
          aria-label="Close menu"
        >
          <X size={24} className="text-gray-200" />
        </button>

        <div className="flex flex-col items-center mb-8 text-sky-400">
          <img
            src="/favicon.ico"
            alt="logo"
            className="w-12 h-12 mb-3 drop-shadow-[0_0_8px_rgba(47,128,237,0.7)]"
          />
          <span className="text-xl font-bold">CanTho FireGuard</span>
        </div>

        <nav className="flex flex-col gap-3 overflow-y-auto flex-1">
          <Link
            href="/"
            onClick={onClose}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all
              ${
                pathname === "/"
                  ? "bg-blue-900/60 text-sky-300 font-semibold shadow-lg"
                  : "hover:bg-blue-900/30 text-gray-200 active:bg-blue-900/40"
              }
            `}
          >
            <Home size={22} /> {t("nav.home")}
          </Link>

          <Link
            href="/dashboard"
            onClick={onClose}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all
              ${
                pathname === "/dashboard"
                  ? "bg-blue-900/60 text-sky-300 font-semibold shadow-lg"
                  : "hover:bg-blue-900/30 text-gray-200 active:bg-blue-900/40"
              }
            `}
          >
            <LayoutDashboard size={22} /> {t("nav.dashboard")}
          </Link>

          <Link
            href="/dashboard/logs"
            onClick={onClose}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all
              ${
                pathname === "/dashboard/logs"
                  ? "bg-blue-900/60 text-sky-300 font-semibold shadow-lg"
                  : "hover:bg-blue-900/30 text-gray-200 active:bg-blue-900/40"
              }
            `}
          >
            <Activity size={22} /> {t("nav.logs")}
          </Link>

          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className={`flex items-center gap-3 p-4 rounded-lg transition-all
              ${
                pathname === "/dashboard/settings"
                  ? "bg-blue-900/60 text-sky-300 font-semibold shadow-lg"
                  : "hover:bg-blue-900/30 text-gray-200 active:bg-blue-900/40"
              }
            `}
          >
            <Settings size={22} /> {t("nav.settings")}
          </Link>
        </nav>

        <div className="mt-auto pt-6 text-center text-sm text-gray-400 shrink-0">
          v1.0.0
        </div>
      </div>
    </>
  );
}
