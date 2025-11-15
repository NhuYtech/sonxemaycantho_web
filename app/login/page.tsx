"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, register, resetPassword } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") await signIn(email, password);
      else await register(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async () => {
    setError(null);
    if (!email) {
      setError("Vui lòng nhập email để đặt lại mật khẩu");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      alert("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.");
    } catch (err: any) {
      setError(err?.message || "Không thể gửi email đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl p-6 md:p-8 border border-gray-800">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          {mode === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm mb-4">
          <button
            type="button"
            className={`px-3 py-1 rounded-lg border ${mode === "login" ? "bg-cyan-600 text-white border-cyan-600" : "bg-gray-800 border-gray-700"}`}
            onClick={() => setMode("login")}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-lg border ${mode === "register" ? "bg-cyan-600 text-white border-cyan-600" : "bg-gray-800 border-gray-700"}`}
            onClick={() => setMode("register")}
          >
            Đăng ký
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 p-3 outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 p-3 outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-md p-2">{error}</p>
          )}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-semibold rounded-lg p-3 transition"
            >
              {loading ? (mode === "login" ? "Đang đăng nhập..." : "Đang đăng ký...") : (mode === "login" ? "Đăng nhập" : "Đăng ký")}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onResetPassword}
              className="w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-60 text-gray-200 font-semibold rounded-lg p-3 transition border border-gray-700"
            >
              Quên mật khẩu (gửi email đặt lại)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


