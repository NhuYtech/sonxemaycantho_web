"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "@/lib/auth";

export default function FireAlertLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Starting Google login...");
      await signInWithGoogle();
      console.log("Google login successful");
    } catch (err: any) {
      console.error("Lỗi đăng nhập Google:", err.code, err.message);
      setError(err?.message || "Đăng nhập bằng Google thất bại. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        background:
          "linear-gradient(180deg, #340800 0%, #B83C1B 70%, #FF884B 100%)",
      }}
    >
      <div className="relative w-full max-w-sm bg-[#1A0A00cc] backdrop-blur-md rounded-2xl p-8 shadow-[0_0_40px_rgba(255,60,60,0.4)] border border-red-700">
        {/* 🔥 Logo và tiêu đề */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white/10 p-4 rounded-full border border-red-400 shadow-lg">
            <img
              src="/favicon.ico"
              alt="CanTho FireGuard"
              className="w-16 h-16"
            />
          </div>
          <h1 className="text-3xl font-extrabold mt-4 tracking-wide">
            CanTho FireGuard
          </h1>
          <p className="text-sm text-gray-300 mt-2">Đăng nhập vào hệ thống</p>
        </div>

        {/* 🔒 Google Login Form */}
        <div className="space-y-4">
          {error && (
            <p className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-md p-2 text-center">
              {error}
            </p>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold rounded-full py-3 hover:bg-gray-100 transition shadow-md disabled:opacity-60"
          >
            <FcGoogle size={22} />
            {loading ? "Đang đăng nhập..." : "Đăng nhập bằng Google"}
          </button>

          {/* Link to Register */}
          <div className="text-center mt-6 text-sm text-gray-300">
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              className="text-orange-300 hover:text-white font-medium underline-offset-2 hover:underline transition"
            >
              Đăng ký ngay
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400">
          Được phát triển bởi{" "}
          <span className="text-red-400 font-semibold">NHƯ Ý</span>
        </div>
      </div>
    </div>
  );
}
