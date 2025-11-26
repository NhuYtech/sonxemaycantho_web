"use client";

import { DeviceState } from "@/types/device";
import { Wifi, Database, Cpu, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface SystemStatusPanelProps {
  state: DeviceState;
}

export default function SystemStatusPanel({ state }: SystemStatusPanelProps) {
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLastUpdate(0);
  }, [state.gas]);

  const firebaseStatus: "safe" | "danger" = state.firebase ? "safe" : "danger";
  const updateStatus: "safe" | "warning" | "danger" =
    lastUpdate < 10 ? "safe" : lastUpdate < 30 ? "warning" : "danger";

  // Check DHT22 sensor status based on last update time
  const dht22TimeDiff = (Date.now() - state.lastDHT22Update) / 1000;
  const dht22Status: "safe" | "danger" = dht22TimeDiff < 30 ? "safe" : "danger";

  const statusItems = [
    {
      icon: Wifi,
      label: "WiFi",
      value: "Trực tuyến",
      status: "safe" as const,
    },
    {
      icon: Database,
      label: "Firebase",
      value: state.firebase ? "Hoạt động" : "Mất kết nối",
      status: firebaseStatus,
    },
    {
      icon: Cpu,
      label: "ESP32",
      value: "Đang chạy",
      status: "safe" as const,
    },
    {
      icon: Clock,
      label: "Cập nhật lần cuối",
      value: `${lastUpdate} giây trước`,
      status: updateStatus,
    },
  ];

  const sensorItems = [
    { label: "MQ2 (Gas)", status: "safe" as const, value: "Trực tuyến" },
    { label: "Flame Sensor", status: "safe" as const, value: "Trực tuyến" },
    { label: "DHT22 (Temp/Hum)", status: dht22Status, value: dht22Status === "safe" ? "Trực tuyến" : "Mất kết nối" },
  ];

  const statusColors = {
    safe: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
  };

  return (
    <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.2)]">
      <h3 className="text-xl font-bold text-orange-300 mb-6">Trạng thái hệ thống</h3>

      <div className="space-y-4">
        {statusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-red-950/30 rounded-lg p-4 border border-red-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon size={20} className={statusColors[item.status]} />
                  <span className="text-gray-300 font-medium">{item.label}</span>
                </div>
                <span className={`font-semibold ${statusColors[item.status]}`}>{item.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sensor Status */}
      <div className="mt-6 pt-4 border-t border-red-900/20">
        <h4 className="text-sm font-semibold text-orange-300 mb-3">📍 Trạng thái cảm biến</h4>
        <div className="space-y-2">
          {sensorItems.map((sensor, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{sensor.label}</span>
              <span className={`font-semibold ${statusColors[sensor.status]}`}>{sensor.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-red-900/20">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400 text-xs">Ngưỡng</p>
            <p className="text-orange-300 font-bold">{state.threshold} ppm</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Chế độ hoạt động</p>
            <p className={`font-bold ${state.autoManual === "AUTO" ? "text-green-400" : "text-orange-400"}`}>
              {state.autoManual === "AUTO" ? "🤖 Tự động" : "👤 Thủ công"}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {state.autoManual === "AUTO" ? "Hệ thống tự phản ứng" : "Người dùng điều khiển"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
