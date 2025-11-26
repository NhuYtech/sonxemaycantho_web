// app/layout.tsx
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import { UIProvider } from "@/contexts/UIContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Set dynamic title based on route
    const titles: Record<string, string> = {
      "/": "CanTho FireGuard - Hệ thống giám sát & cảnh báo cháy",
      "/dashboard": "Dashboard • CanTho FireGuard",
      "/dashboard/logs": "Nhật ký • CanTho FireGuard",
      "/dashboard/settings": "Cài đặt • CanTho FireGuard",
      "/login": "Đăng nhập • CanTho FireGuard",
      "/register": "Đăng ký • CanTho FireGuard",
    };

    document.title = titles[pathname] || "CanTho FireGuard";
  }, [pathname]);

  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          <UIProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </UIProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
