"use client";

import { LogStats } from "@/types/logs";
import { Info } from "lucide-react";

interface DetailsPanelProps {
  stats: LogStats;
}

export default function DetailsPanel({ stats }: DetailsPanelProps) {
  const items = [
    { label: "Tổng sự kiện", value: stats.totalEvents },
    { label: "Phát hiện cháy", value: stats.fireDetections },
    { label: "Cảnh báo gas", value: stats.gasWarnings },
    { label: "Thao tác người dùng", value: stats.userActions },
    { label: "Gas tối đa (ppm)", value: stats.maxGas },
    { label: "Gas TB (ppm)", value: Math.round(stats.avgGas) },
    { label: "Gas tối thiểu (ppm)", value: stats.minGas },
    { label: "Nhiệt độ cao nhất (°C)", value: stats.maxTemp.toFixed(1) },
    { label: "Nhiệt độ TB (°C)", value: stats.avgTemp.toFixed(1) },
    { label: "Nhiệt độ thấp nhất (°C)", value: stats.minTemp.toFixed(1) },
    { label: "Độ ẩm cao nhất (%)", value: stats.maxHumidity.toFixed(1) },
    { label: "Độ ẩm TB (%)", value: stats.avgHumidity.toFixed(1) },
    { label: "Độ ẩm thấp nhất (%)", value: stats.minHumidity.toFixed(1) },
  ];

  return (
    <div className="bg-[#152A45]/80 backdrop-blur-sm border border-blue-700/40 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Info className="text-sky-400" size={24} />
        <h3 className="text-xl font-bold text-sky-300">Chi tiết thống kê</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div key={i} className="bg-blue-950/30 rounded-lg p-4 border border-blue-900/20">
            <p className="text-gray-400 text-xs mb-1">{item.label}</p>
            <p className="text-sky-300 text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
