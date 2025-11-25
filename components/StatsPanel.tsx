"use client";
import React from "react";
import { Bell, TrendingUp, Activity, Shield } from "lucide-react";

export default function StatsPanel({ fireData }: any) {
  const getStatus = (data: any) => {
    if (!data) return "UNKNOWN";
    const { temperature, smoke, flame } = data;

    if (flame === 0 || temperature >= 50 || smoke > 2000) return "ALARM";
    if (temperature >= 45 || smoke > 1500) return "WARNING";
    return "NORMAL";
  };

  const status = getStatus(fireData);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-red-500">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="text-red-400" size={20} />
          <p className="text-gray-400 text-sm">Cảnh báo hôm nay</p>
        </div>
        <p className="text-3xl font-bold text-white">1</p>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="text-orange-400" size={20} />
          <p className="text-gray-400 text-sm">Nhiệt độ hiện tại</p>
        </div>
        <p className="text-3xl font-bold text-white">
          {fireData.temperature}°C
        </p>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="text-blue-400" size={20} />
          <p className="text-gray-400 text-sm">Độ ẩm</p>
        </div>
        <p className="text-3xl font-bold text-white">{fireData.humidity}%</p>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="text-green-400" size={20} />
          <p className="text-gray-400 text-sm">Trạng thái</p>
        </div>
        <p className="text-3xl font-bold text-green-400">
          {status === "ALARM"
            ? "Nguy hiểm"
            : status === "WARNING"
            ? "Cảnh báo"
            : "An toàn"}
        </p>
      </div>
    </div>
  );
}
