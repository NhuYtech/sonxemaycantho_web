"use client";

import { LogEvent } from "@/types/logs";
import { Flame, Wind, Zap, Settings, User } from "lucide-react";

interface EventTableProps {
  logs: LogEvent[];
  onEventClick: (event: LogEvent) => void;
}

const eventTypeLabels: Record<string, string> = {
  fire_detected: "Phát hiện cháy",
  gas_warning: "Cảnh báo gas",
  relay_on: "Relay bật",
  relay_off: "Relay tắt",
  mode_change: "Đổi chế độ",
  user_action: "Thao tác",
  threshold_change: "Đổi ngưỡng",
};

const eventTypeColors: Record<string, string> = {
  fire_detected: "text-red-500",
  gas_warning: "text-yellow-500",
  relay_on: "text-blue-500",
  relay_off: "text-gray-500",
  mode_change: "text-purple-500",
  user_action: "text-green-500",
  threshold_change: "text-orange-500",
};

const eventTypeIcons: Record<string, any> = {
  fire_detected: Flame,
  gas_warning: Wind,
  relay_on: Zap,
  relay_off: Zap,
  mode_change: Settings,
  user_action: User,
  threshold_change: Settings,
};

export default function EventTable({ logs, onEventClick }: EventTableProps) {
  return (
    <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 shadow-lg overflow-hidden">
      <h3 className="text-xl font-bold text-orange-300 mb-4">Bảng sự kiện</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-red-900/30 text-gray-400">
              <th className="text-left py-3 px-4">Thời gian</th>
              <th className="text-left py-3 px-4">Loại</th>
              <th className="text-center py-3 px-4">Gas</th>
              <th className="text-center py-3 px-4">Lửa</th>
              <th className="text-center py-3 px-4">Relay</th>
              <th className="text-center py-3 px-4">Mode</th>
              <th className="text-left py-3 px-4">Người dùng</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Chưa có sự kiện nào
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const Icon = eventTypeIcons[log.type] || User;
                const color = eventTypeColors[log.type] || "text-gray-500";

                return (
                  <tr
                    key={log.id}
                    onClick={() => onEventClick(log)}
                    className="border-b border-red-900/10 hover:bg-red-950/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-300">
                      {new Date(log.timestamp).toLocaleString("vi-VN")}
                    </td>
                    <td className={`py-3 px-4 ${color}`}>
                      <div className="flex items-center gap-2">
                        <Icon size={16} />
                        <span>{eventTypeLabels[log.type] || log.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-yellow-400 font-mono">{log.gas}</td>
                    <td className="py-3 px-4 text-center">
                      {log.fire ? (
                        <span className="text-red-500 font-bold">🔥</span>
                      ) : (
                        <span className="text-gray-600">✓</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <span className={log.relay1 ? "text-blue-400" : "text-gray-600"}>R1</span>
                        <span className={log.relay2 ? "text-blue-400" : "text-gray-600"}>R2</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          log.mode === "AUTO" ? "bg-green-900/30 text-green-400" : "bg-gray-900/30 text-gray-400"
                        }`}
                      >
                        {log.mode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{log.user || "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
