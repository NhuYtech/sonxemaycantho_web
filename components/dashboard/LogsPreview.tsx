"use client";

import { useMemo } from "react";
import { Clock, Wind, Flame, Settings, Thermometer, Droplets } from "lucide-react";

interface LogsPreviewProps {
  gas: number;
  fire: boolean;
  mode: "AUTO" | "MANUAL";
  threshold: number;
  temperature?: number;
  humidity?: number;
}

type LogEntry = {
  time: string;
  gas: number;
  fire: boolean;
  temperature: number;
  humidity: number;
  event: string;
  mode: string;
};

export default function LogsPreview({ gas, fire, mode, threshold, temperature = 0, humidity = 0 }: LogsPreviewProps) {
  // Mock data - in production, fetch from Firebase logs
  const recentLogs = useMemo<LogEntry[]>(() => {
    const now = new Date();
    return [
      {
        time: now.toLocaleTimeString("vi-VN"),
        gas,
        fire,
        temperature,
        humidity,
        event: fire ? "🔥 Phát hiện cháy" : gas > threshold ? "⚠️ Gas vượt ngưỡng" : "✓ Bình thường",
        mode,
      },
      {
        time: new Date(now.getTime() - 60000).toLocaleTimeString("vi-VN"),
        gas: gas - 100,
        fire: false,
        temperature: temperature - 2,
        humidity: humidity + 5,
        event: "✓ Bình thường",
        mode,
      },
      {
        time: new Date(now.getTime() - 120000).toLocaleTimeString("vi-VN"),
        gas: gas - 200,
        fire: false,
        temperature: temperature - 3,
        humidity: humidity + 8,
        event: "🔄 Đổi chế độ",
        mode: mode === "AUTO" ? "MANUAL" : "AUTO",
      },
    ];
  }, [gas, fire, mode, threshold, temperature, humidity]);

  return (
    <div className="bg-[#071933]/70 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.2)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-sky-300">🔔 Hoạt động gần nhất</h3>
        <a href="/dashboard/logs" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Xem tất cả →
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blue-900/30 text-gray-400">
              <th className="text-left py-2 px-3">
                <Clock size={14} className="inline mr-1" />
                Thời gian
              </th>
              <th className="text-center py-2 px-3">
                <Wind size={14} className="inline mr-1" />
                Khí Gas
              </th>
              <th className="text-center py-2 px-3">
                <Thermometer size={14} className="inline mr-1" />
                Temp
              </th>
              <th className="text-center py-2 px-3">
                <Droplets size={14} className="inline mr-1" />
                Hum
              </th>
              <th className="text-center py-2 px-3">
                <Flame size={14} className="inline mr-1" />
                Nguồn nhiệt
              </th>
              <th className="text-left py-2 px-3">Mô tả</th>
              <th className="text-center py-2 px-3">
                <Settings size={14} className="inline mr-1" />
                Chế độ
              </th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((log, index) => (
              <tr key={index} className="border-b border-blue-900/10 hover:bg-blue-950/20 transition-colors">
                <td className="py-3 px-3 text-gray-300">{log.time}</td>
                <td className="py-3 px-3 text-center text-yellow-400 font-mono">{log.gas}</td>
                <td className="py-3 px-3 text-center text-sky-400 font-mono">{log.temperature.toFixed(1)}°</td>
                <td className="py-3 px-3 text-center text-cyan-400 font-mono">{log.humidity.toFixed(1)}%</td>
                <td className="py-3 px-3 text-center">
                  {log.fire ? <span className="text-red-500">🔥</span> : <span className="text-green-500">✓</span>}
                </td>
                <td className="py-3 px-3 text-gray-300">{log.event}</td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      log.mode === "AUTO" ? "bg-green-900/30 text-green-400" : "bg-blue-900/30 text-sky-400"
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
