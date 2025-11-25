"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";

interface DashboardAlertBannerProps {
  fire: boolean;
  gas: number;
  threshold: number;
}

export default function DashboardAlertBanner({ fire, gas, threshold }: DashboardAlertBannerProps) {
  if (fire) {
    return (
      <div className="bg-red-600 border-2 border-red-500 rounded-xl p-4 shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-pulse">
        <div className="flex items-center gap-4">
          <AlertTriangle size={32} className="text-white" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">🔥 CẢNH BÁO CHÁY!</h2>
            <p className="text-red-100">Phát hiện lửa - Hệ thống đang kích hoạt biện pháp an toàn</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{gas}</p>
            <p className="text-sm text-red-100">ppm</p>
          </div>
        </div>
      </div>
    );
  }

  if (gas > threshold) {
    return (
      <div className="bg-yellow-600 border-2 border-yellow-500 rounded-xl p-4 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
        <div className="flex items-center gap-4">
          <AlertTriangle size={32} className="text-white" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">⚠️ CẢNH BÁO GAS VƯỢT NGƯỠNG</h2>
            <p className="text-yellow-100">Nồng độ khí gas cao - Kiểm tra và thông gió ngay</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{gas}</p>
            <p className="text-sm text-yellow-100">ppm (Ngưỡng: {threshold})</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-700 border-2 border-green-600 rounded-xl p-4 shadow-[0_0_25px_rgba(34,197,94,0.3)]">
      <div className="flex items-center gap-4">
        <CheckCircle size={32} className="text-white" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">🟢 HỆ THỐNG AN TOÀN</h2>
          <p className="text-green-100">Không phát hiện nguy hiểm - Tất cả chỉ số bình thường</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{gas}</p>
          <p className="text-sm text-green-100">ppm</p>
        </div>
      </div>
    </div>
  );
}
