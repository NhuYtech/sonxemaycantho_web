"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register, signInWithGoogle } from "@/lib/auth";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password);
      router.push("/login"); // sau khi đăng ký thành công thì về login
    } catch (err: any) {
      setError(err?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      await signInWithGoogle(); // Firebase tự tạo tài khoản Google nếu chưa có
      router.push("/"); // chuyển về trang chính
    } catch (err) {
      console.error("Google register error:", err);
      setError("Đăng ký bằng Google thất bại. Vui lòng thử lại!");
    } finally {
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
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white/10 p-4 rounded-full border border-red-400 shadow-lg">
            <img
              src="/fire-icon.png"
              alt="CanTho FireGuard"
              className="w-16 h-16"
            />
          </div>
          <h1 className="text-3xl font-extrabold mt-4 tracking-wide">
            CanTho FireGuard
          </h1>
          <p className="text-sm text-gray-300 mt-2">Tạo tài khoản mới</p>
        </div>

        {/* 📝 Form đăng ký */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white text-gray-900 rounded-full p-3 outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-500"
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white text-gray-900 rounded-full p-3 outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-500"
            required
          /> */}

          {error && (
            <p className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-md p-2 text-center">
              {error}
            </p>
          )}

          {/* 🔹 Nút đăng ký */}
          {/* <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-full py-3 flex items-center justify-center gap-2 transition shadow-[0_0_15px_rgba(255,80,80,0.5)] disabled:opacity-60"
          >
            {loading ? "Đang đăng ký..." : "🔥 Đăng ký"}
          </button> */}
        </form>

        {/* Nút Google */}
        <button
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold rounded-full py-3 mt-4 hover:bg-gray-100 transition shadow-md disabled:opacity-60"
        >
          <FcGoogle size={22} /> Đăng ký bằng Google
        </button>

        {/* Liên kết chuyển trang */}
        <div className="text-center mt-6 text-sm text-gray-300">
          Đã có tài khoản?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-orange-300 hover:text-white font-medium underline-offset-2 hover:underline transition"
          >
            Đăng nhập
          </button>
        </div>

        {/* Footer nhỏ */}
        <div className="text-center mt-6 text-xs text-gray-400">
          Powered by{" "}
          <span className="text-red-400 font-semibold">SAFEHOME SYSTEMS</span>
        </div>
      </div>
    </div>
  );
}
