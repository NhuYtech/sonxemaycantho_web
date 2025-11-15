"use client";

import { Home, Activity, Settings } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-60 bg-[#280E0A]/70 backdrop-blur-md border-r border-red-900/30 flex flex-col p-5">
      
      <div className="text-xl font-bold mb-8 text-orange-400 text-center">
        🛡️ FireGuard
      </div>

      <nav className="flex flex-col gap-3">
        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/30 transition">
          <Home size={20} /> Dashboard
        </Link>

        <Link href="/dashboard/logs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/30 transition">
          <Activity size={20} /> Nhật ký
        </Link>

        <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/30 transition">
          <Settings size={20} /> Cài đặt
        </Link>
      </nav>

      <div className="mt-auto pt-6 text-center text-sm text-gray-500">
        v1.0.0
      </div>
    </div>
  );
}
