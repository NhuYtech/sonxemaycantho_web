"use client";

import React, { useState } from "react";
import { resetPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSent(false);
    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Không thể gửi email đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl p-6 md:p-8 border border-gray-800">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Quên mật khẩu</h1>
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
          {error && (
            <p className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-md p-2">{error}</p>
          )}
          {sent && (
            <p className="text-sm text-green-400 bg-green-900/20 border border-green-700 rounded-md p-2">
              Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-semibold rounded-lg p-3 transition"
          >
            {loading ? "Đang gửi..." : "Gửi email đặt lại"}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-gray-400">
          Nhớ mật khẩu rồi? {""}
          <a href="/login" className="text-cyan-400 hover:underline">Đăng nhập</a>
        </div>
      </div>
    </div>
  );
}


