"use client";

import { LogEvent } from "@/types/logs";
import { Activity, Flame, Wind, User, Settings } from "lucide-react";
import { useEffect, useState } from "react";

interface RealtimeActivityFeedProps {
  logs: LogEvent[];
  maxItems?: number;
}

export default function RealtimeActivityFeed({ logs, maxItems = 10 }: RealtimeActivityFeedProps) {
  const [recentLogs, setRecentLogs] = useState<LogEvent[]>([]);
  const [newLogIds, setNewLogIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Lấy logs gần nhất
    const sorted = [...logs].sort((a, b) => b.timestamp - a.timestamp).slice(0, maxItems);
    
    // Đánh dấu logs mới (trong 5 giây)
    const now = Date.now();
    const newIds = new Set(sorted.filter(log => now - log.timestamp < 5000).map(log => log.id));
    
    setRecentLogs(sorted);
    setNewLogIds(newIds);

    // Xóa highlight sau 5 giây
    const timer = setTimeout(() => {
      setNewLogIds(new Set());
    }, 5000);

    return () => clearTimeout(timer);
  }, [logs, maxItems]);

  const getEventIcon = (type: LogEvent["type"]) => {
    switch (type) {
      case "fire_detected":
        return <Flame className="text-red-500" size={20} />;
      case "gas_warning":
        return <Wind className="text-yellow-500" size={20} />;
      case "user_action":
        return <User className="text-blue-500" size={20} />;
      case "system_event":
        return <Settings className="text-gray-400" size={20} />;
      default:
        return <Activity className="text-sky-400" size={20} />;
    }
  };

  const getEventLabel = (type: LogEvent["type"]) => {
    switch (type) {
      case "fire_detected":
        return "Phát hiện cháy";
      case "gas_warning":
        return "Cảnh báo gas";
      case "user_action":
        return "Hành động người dùng";
      case "system_event":
        return "Sự kiện hệ thống";
      case "threshold_change":
        return "Thay đổi ngưỡng";
      default:
        return type;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return `${Math.floor(diff / 1000)} giây trước`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return new Date(timestamp).toLocaleDateString("vi-VN");
  };

  return (
    <div className="bg-[#152A45]/80 backdrop-blur-sm border-2 border-blue-700/50 rounded-xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-5">
        <Activity className="text-sky-400 animate-pulse" size={24} />
        <h3 className="text-xl font-bold text-sky-300">🔴 Hoạt động gần đây</h3>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {recentLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity size={48} className="mx-auto mb-3 opacity-30" />
            <p>Chưa có hoạt động nào</p>
          </div>
        ) : (
          recentLogs.map((log) => {
            const isNew = newLogIds.has(log.id);
            return (
              <div
                key={log.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                  isNew
                    ? "bg-blue-600/30 border-2 border-blue-400/50 animate-pulse"
                    : "bg-blue-950/30 border border-blue-700/30"
                } hover:bg-blue-950/50`}
              >
                <div className="mt-1">{getEventIcon(log.type)}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sky-300 text-sm">
                      {getEventLabel(log.type)}
                    </span>
                    {isNew && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                        MỚI
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-400 space-y-1">
                    {log.type === "fire_detected" && (
                      <p className="text-red-400 font-semibold">🔥 Phát hiện lửa!</p>
                    )}
                    {log.type === "gas_warning" && (
                      <p className="text-yellow-400">⚠️ Gas: {log.gas} ppm</p>
                    )}
                    <p>
                      🌡️ {log.temperature}°C • 💧 {log.humidity}%
                    </p>
                    {log.note && <p className="text-gray-500 italic">📝 {log.note}</p>}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTimestamp(log.timestamp)}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
}
