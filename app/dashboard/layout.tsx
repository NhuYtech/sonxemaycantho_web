"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-linear-to-b from-[#3d130e] via-[#4f1c13] to-[#f0703a] text-gray-100">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Hamburger Button - Mobile Only */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 left-6 z-30 p-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={24} className="text-white" />
        </button>

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
