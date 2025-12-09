"use client";

import { AlertTriangle, CheckCircle, WifiOff } from "lucide-react";

interface DashboardAlertBannerProps {
  fire: boolean;
  gas: number;
  threshold: number;
  isOnline: boolean;
}

export default function DashboardAlertBanner({ fire, gas, threshold, isOnline }: DashboardAlertBannerProps) {
  // Priority 0: Offline - Không có dữ liệu realtime => Hiển thị bình thường
  if (!isOnline) {
    return (
      <div className="bg-green-700 border-2 border-green-600 rounded-xl p-4 shadow-[0_0_25px_rgba(34,197,94,0.3)]">
        <div className="flex items-center gap-4">
          <CheckCircle size={32} className="text-white" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">🟢 HỆ THỐNG BÌNH THƯỜNG</h2>
            <p className="text-green-100">Không có dữ liệu realtime - Hiển thị giá trị cuối cùng</p>
          </div>
          <div className="flex items-center gap-2">
            <WifiOff size={20} className="text-green-200" />
            <p className="text-sm text-green-100">Offline</p>
          </div>
        </div>
      </div>
    );
  }

  // Priority 1: Fire detection
  if (fire) {
    return (
      <div className="bg-red-600 border-2 border-red-500 rounded-xl p-4 shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-pulse">
        <div className="flex items-center gap-4">
          <AlertTriangle size={32} className="text-white" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">🔥 PHÁT HIỆN NGUỒN NHIỆT / ÁNH SÁNG BẤT THƯỜNG</h2>
            <p className="text-red-100">Hệ thống phát hiện ánh sáng cường độ cao - Có thể từ lửa hoặc đèn mạnh</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{gas}</p>
            <p className="text-sm text-red-100">ppm</p>
          </div>
        </div>
      </div>
    );
  }

  // Priority 2: Gas above threshold (danger)
  if (gas > threshold) {
    return (
      <div className="bg-red-600 border-2 border-red-500 rounded-xl p-4 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse">
        <div className="flex items-center gap-4">
          <AlertTriangle size={32} className="text-white" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">🔴 NGUY HIỂM! GAS VƯỢT NGƯỠNG</h2>
            <p className="text-red-100">Nồng độ khí gas nguy hiểm - Sơ tán và thông gió ngay lập tức!</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{gas}</p>
            <p className="text-sm text-red-100">ppm (Ngưỡng: {threshold})</p>
          </div>
        </div>
      </div>
    );
  }

  // Priority 3: Gas near threshold (warning)
  if (gas > threshold * 0.7) {
    return (
      <div className="bg-yellow-600 border-2 border-yellow-500 rounded-xl p-4 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
        <div className="flex items-center gap-4">
          <AlertTriangle size={32} className="text-white" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">⚠️ CẢNH BÁO GAS CAO</h2>
            <p className="text-yellow-100">Nồng độ khí gas tăng cao - Kiểm tra và thông gió khu vực</p>
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
