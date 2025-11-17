"use client";

import React, { useState } from "react";
import { registerWithGoogle } from "@/lib/auth";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { getAdditionalUserInfo } from "firebase/auth";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExistingAccountModal, setShowExistingAccountModal] = useState(false);
  const router = useRouter();

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Starting Google register...");
      
      const result = await registerWithGoogle();
      const additionalInfo = getAdditionalUserInfo(result);
      
      // Check if user already exists
      if (additionalInfo && !additionalInfo.isNewUser) {
        console.log("User already exists");
        setShowExistingAccountModal(true);
        setLoading(false);
        return;
      }
      
      console.log("Google register successful - new user created");
    } catch (err: any) {
      console.error("Google register error:", err.code, err.message);
      
      // Handle specific error cases
      if (err.code === "auth/popup-closed-by-user") {
        setError("Bạn đã đóng cửa sổ đăng ký. Vui lòng thử lại!");
      } else if (err.code === "auth/cancelled-popup-request") {
        setError("Yêu cầu đăng ký bị hủy. Vui lòng thử lại!");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("Domain chưa được xác thực. Vui lòng liên hệ quản trị viên!");
      } else {
        setError(err?.message || "Đăng ký bằng Google thất bại. Vui lòng thử lại!");
      }
      
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
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
          <p className="text-sm text-gray-300 mt-2">Tạo tài khoản mới</p>
        </div>

        {/* 📝 Google Register Form */}
        <div className="space-y-4">
          {error && (
            <p className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-md p-2 text-center">
              {error}
            </p>
          )}

          {/* Google Register Button */}
          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold rounded-full py-3 hover:bg-gray-100 transition shadow-md disabled:opacity-60"
          >
            <FcGoogle size={22} />
            {loading ? "Đang đăng ký..." : "Đăng ký bằng Google"}
          </button>

          {/* Link to Login */}
          <div className="text-center mt-6 text-sm text-gray-300">
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-orange-300 hover:text-white font-medium underline-offset-2 hover:underline transition"
            >
              Đăng nhập
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400">
          Được phát triển bởi{" "}
          <span className="text-red-400 font-semibold">NHƯ Ý</span>
        </div>
      </div>

      {/* Modal - Tài khoản đã tồn tại */}
      {showExistingAccountModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A0A00] border border-red-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-[0_0_40px_rgba(255,60,60,0.4)]">
            <div className="text-center">
              <div className="mb-4 text-5xl">⚠️</div>
              <h2 className="text-xl font-bold mb-2 text-white">Tài khoản đã tồn tại</h2>
              <p className="text-gray-300 mb-6">
                Tài khoản này đã được đăng ký. Vui lòng đăng nhập!
              </p>
              <button
                onClick={handleGoToLogin}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full py-3 transition shadow-md"
              >
                Đi tới Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
