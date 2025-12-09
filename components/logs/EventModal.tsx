"use client";

import { LogEvent } from "@/types/logs";
import { X } from "lucide-react";

interface EventModalProps {
  event: LogEvent | null;
  onClose: () => void;
}

const eventTypeLabels: Record<string, string> = {
  fire_detected: "🔥 Phát hiện cháy",
  gas_warning: "⚠️ Cảnh báo gas",
  user_action: "👤 Thao tác người dùng",
  threshold_change: "⚙️ Thay đổi ngưỡng",
  system_event: "🔧 Sự kiện hệ thống",
};

export default function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  // Format thời gian chi tiết
  const date = new Date(event.timestamp);
  const dateStr = date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#152A45] border border-blue-700/50 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-sky-400 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-sky-300 mb-6">Chi tiết sự kiện</h2>

        {/* Content */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="Loại sự kiện" value={eventTypeLabels[event.type] || event.type} />
            <InfoItem label="Thời gian" value={new Date(event.timestamp).toLocaleString("vi-VN")} />
            <InfoItem label="Gas" value={`${event.gas} ppm`} highlight={event.gas > 3000} />
            <InfoItem label="Nhiệt độ" value={`${event.temperature.toFixed(1)}°C`} highlight={event.temperature > 45} />
            <InfoItem label="Độ ẩm" value={`${event.humidity.toFixed(1)}%`} highlight={event.humidity < 25} />
            <InfoItem label="Lửa" value={event.fire ? "🔥 Có" : "✓ Không"} highlight={event.fire} />
          </div>

          {event.threshold && <InfoItem label="Ngưỡng" value={event.threshold.toString()} />}
          {event.user && <InfoItem label="Người thao tác" value={event.user} />}
          {event.note && (
            <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-900/20 col-span-2">
              <p className="text-gray-400 text-sm mb-1">Ghi chú</p>
              <p className="text-orange-200">{event.note}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-900/50 hover:bg-red-900/70 text-sky-300 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-blue-950/30 rounded-lg p-4 border border-blue-900/20">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className={`font-semibold ${highlight ? "text-blue-400" : "text-orange-200"}`}>{value}</p>
    </div>
  );
}
