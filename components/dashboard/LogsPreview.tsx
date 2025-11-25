"use client";

import { useMemo } from "react";
import { Clock, Wind, Flame, Settings } from "lucide-react";

interface LogsPreviewProps {
  gas: number;
  fire: boolean;
  mode: "AUTO" | "MANUAL";
  threshold: number;
}

type LogEntry = {
  time: string;
  gas: number;
  fire: boolean;
  event: string;
  mode: string;
};

export default function LogsPreview({ gas, fire, mode, threshold }: LogsPreviewProps) {
  // Mock data - in production, fetch from Firebase logs
  const recentLogs = useMemo<LogEntry[]>(() => {
    const now = new Date();
    return [
      {
        time: now.toLocaleTimeString("vi-VN"),
        gas,
        fire,
        event: fire ? "🔥 Phát hiện cháy" : gas > threshold ? "⚠️ Gas vượt ngưỡng" : "✓ Bình thường",
        mode,
      },
      {
        time: new Date(now.getTime() - 60000).toLocaleTimeString("vi-VN"),
        gas: gas - 100,
        fire: false,
        event: "✓ Bình thường",
        mode,
      },
      {
        time: new Date(now.getTime() - 120000).toLocaleTimeString("vi-VN"),
        gas: gas - 200,
        fire: false,
        event: "🔄 Đổi chế độ",
        mode: mode === "AUTO" ? "MANUAL" : "AUTO",
      },
    ];
  }, [gas, fire, mode, threshold]);

  return (
    <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.2)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-orange-300">Recent Activity</h3>
        <a href="/dashboard/logs" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Xem tất cả →
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-red-900/30 text-gray-400">
              <th className="text-left py-2 px-3">
                <Clock size={14} className="inline mr-1" />
                Giờ
              </th>
              <th className="text-center py-2 px-3">
                <Wind size={14} className="inline mr-1" />
                Gas
              </th>
              <th className="text-center py-2 px-3">
                <Flame size={14} className="inline mr-1" />
                Fire
              </th>
              <th className="text-left py-2 px-3">Event</th>
              <th className="text-center py-2 px-3">
                <Settings size={14} className="inline mr-1" />
                Mode
              </th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((log, index) => (
              <tr key={index} className="border-b border-red-900/10 hover:bg-red-950/20 transition-colors">
                <td className="py-3 px-3 text-gray-300">{log.time}</td>
                <td className="py-3 px-3 text-center text-yellow-400 font-mono">{log.gas}</td>
                <td className="py-3 px-3 text-center">
                  {log.fire ? <span className="text-red-500">🔥</span> : <span className="text-green-500">✓</span>}
                </td>
                <td className="py-3 px-3 text-gray-300">{log.event}</td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      log.mode === "AUTO" ? "bg-green-900/30 text-green-400" : "bg-orange-900/30 text-orange-400"
                    }`}
                  >
                    {log.mode}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
