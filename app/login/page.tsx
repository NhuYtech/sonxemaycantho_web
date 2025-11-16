"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function FireAlertLogin() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try { 
      await signInWithGoogle();
      router.push("/");
    } catch (err) {
      console.error("Lỗi đăng nhập Google:", err);
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
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white/10 p-4 rounded-full border border-red-400 shadow-lg">
            <img
              src="/favicon.ico "
              alt="CanTho FireGuard"
              className="w-16 h-16"
            />
          </div>
          <h1 className="text-3xl font-extrabold mt-4 tracking-wide">
            CanTho FireGuard
          </h1>
          <p className="text-sm text-gray-300 mt-2">Đăng nhập vào hệ thống</p>
        </div>

        {/* 🔒 Form đăng nhập */}
        <div className="space-y-4">
          {/* Nút Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold rounded-full py-3 hover:bg-gray-100 transition shadow-md"
          >
            <FcGoogle size={22} /> Đăng nhập bằng Google
          </button>

          {/* hoặc */}
          <div className="flex items-center justify-center gap-2 text-gray-300 text-sm my-2">
            <span className="h-px bg-gray-500 w-1/4" />
            HOẶC
            <span className="h-px bg-gray-500 w-1/4" />
          </div>

          {/* Nút login chính */}
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-linear-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-full py-3 flex items-center justify-center gap-2 transition shadow-[0_0_15px_rgba(255,80,80,0.5)]"
          >
            🔥 ĐĂNG NHẬP
          </button>

          {/* Liên kết nhỏ */}
          <div className="flex justify-between text-sm text-gray-300 mt-4">
            <button className="hover:text-white">Quên mật khẩu?</button>
            <button
              onClick={() => router.push("/register")}
              className="hover:text-white"
            >
              Tạo tài khoản
            </button>
          </div>
        </div>

        {/* Footer nhỏ */}
        <div className="text-center mt-6 text-xs text-gray-400">
          Được phát triển bởi{" "}
          <span className="text-red-400 font-semibold">
            SAFEHOME SYSTEMS
          </span>
        </div>
      </div>
    </div>
  );
}
