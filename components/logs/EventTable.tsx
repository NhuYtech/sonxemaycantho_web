"use client";

import { LogEvent } from "@/types/logs";
import { Flame, Wind, User, TrendingUp, LucideIcon } from "lucide-react";

interface EventTableProps {
  logs: LogEvent[];
  onEventClick: (event: LogEvent) => void;
}

const eventTypeLabels: Record<string, string> = {
  fire_detected: "Phát hiện cháy",
  gas_warning: "Cảnh báo gas",
  user_action: "Thao tác",
  threshold_change: "Đổi ngưỡng",
};

const eventTypeColors: Record<string, string> = {
  fire_detected: "text-red-500",
  gas_warning: "text-yellow-500",
  user_action: "text-green-500",
  threshold_change: "text-orange-500",
};

const eventTypeIcons: Record<string, LucideIcon> = {
  fire_detected: Flame,
  gas_warning: Wind,
  user_action: User,
  threshold_change: TrendingUp,
};

export default function EventTable({ logs, onEventClick }: EventTableProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-[#152A45]/80 backdrop-blur-sm border-2 border-blue-700/50 rounded-xl p-8 shadow-xl">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <div className="bg-blue-950/30 rounded-full p-6 mb-4">
            <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xl font-semibold mb-2">Chưa có sự kiện nào</p>
          <p className="text-sm text-gray-600">Các sự kiện sẽ xuất hiện ở đây khi hệ thống hoạt động</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#152A45]/80 backdrop-blur-sm border-2 border-blue-700/50 rounded-xl p-6 shadow-xl overflow-hidden">
      <h3 className="text-xl font-bold text-sky-300 mb-4">Bảng sự kiện</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blue-900/30 text-gray-300">
              <th className="text-left py-3 px-4 font-semibold">Thời gian</th>
              <th className="text-center py-3 px-4 font-semibold">Gas</th>
              <th className="text-center py-3 px-4 font-semibold">Temp</th>
              <th className="text-center py-3 px-4 font-semibold">Hum</th>
              <th className="text-center py-3 px-4 font-semibold">Lửa</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
                const Icon = eventTypeIcons[log.type] || User;
                const color = eventTypeColors[log.type] || "text-gray-500";
                
                // Format thời gian chi tiết: DD/MM/YYYY HH:mm:ss
                const date = new Date(log.timestamp);
                const timeStr = date.toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false
                });

                return (
                  <tr
                    key={log.id}
                    onClick={() => onEventClick(log)}
                    className="border-b border-blue-900/10 hover:bg-blue-950/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-300 font-mono text-xs">
                      {timeStr}
                    </td>
                    <td className="py-3 px-4 text-center text-yellow-400 font-mono font-medium">{log.gas}</td>
                    <td className="py-3 px-4 text-center text-sky-400 font-mono font-medium">{log.temperature.toFixed(1)}°</td>
                    <td className="py-3 px-4 text-center text-cyan-400 font-mono font-medium">{log.humidity.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-center">
                      {log.fire ? (
                        <span className="text-red-500 font-bold">🔥</span>
                      ) : (
                        <span className="text-gray-600">✓</span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
