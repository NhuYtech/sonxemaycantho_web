"use client";

import { DeviceState } from "@/types/device";
import { Wifi, Database, Cpu, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface SystemStatusPanelProps {
  state: DeviceState;
}

export default function SystemStatusPanel({ state }: SystemStatusPanelProps) {
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeDiff = Math.floor((Date.now() - state.lastUpdate) / 1000);
      setSecondsSinceUpdate(timeDiff);
    }, 1000);

    return () => clearInterval(interval);
  }, [state.lastUpdate]);

  // System connection status
  const isConnected = state.firebase;
  const connectionStatus: "safe" | "danger" = isConnected ? "safe" : "danger";
  
  // Update time status
  const updateStatus: "safe" | "warning" | "danger" =
    secondsSinceUpdate < 10 ? "safe" : secondsSinceUpdate < 30 ? "warning" : "danger";

  // Check DHT22 sensor status based on last update time
  const dht22TimeDiff = Math.floor((Date.now() - state.lastDHT22Update) / 1000);
  const dht22Status: "safe" | "danger" = dht22TimeDiff < 30 ? "safe" : "danger";

  // MQ2 and Flame sensor status (based on main connection)
  const mainSensorStatus: "safe" | "danger" = isConnected && secondsSinceUpdate < 30 ? "safe" : "danger";

  const statusItems = [
    {
      icon: Wifi,
      label: "WiFi ESP32",
      value: isConnected ? "Kết nối" : "Mất kết nối",
      status: connectionStatus,
    },
    {
      icon: Database,
      label: "Firebase",
      value: isConnected ? "Hoạt động" : "Mất kết nối",
      status: connectionStatus,
    },
    {
      icon: Cpu,
      label: "ESP32",
      value: isConnected ? "Đang chạy" : "Ngoại tuyến",
      status: connectionStatus,
    },
    {
      icon: Clock,
      label: "Cập nhật",
      value: isConnected ? `${secondsSinceUpdate}s trước` : "Không có dữ liệu",
      status: isConnected ? updateStatus : "danger" as const,
    },
  ];

  const sensorItems = [
    { 
      label: "MQ2 (Gas)", 
      status: mainSensorStatus, 
      value: mainSensorStatus === "safe" ? "Trực tuyến" : "Mất kết nối" 
    },
    { 
      label: "Flame Sensor", 
      status: mainSensorStatus, 
      value: mainSensorStatus === "safe" ? "Trực tuyến" : "Mất kết nối" 
    },
    { 
      label: "DHT22 (Temp/Hum)", 
      status: isConnected ? dht22Status : "danger" as const, 
      value: isConnected && dht22Status === "safe" ? "Trực tuyến" : "Mất kết nối" 
    },
  ];

  const statusColors = {
    safe: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-blue-400",
  };

  return (
    <div className="bg-[#071933]/70 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.2)]">
      <h3 className="text-xl font-bold text-sky-300 mb-6">Trạng thái hệ thống</h3>

      <div className="space-y-4">
        {statusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-blue-950/30 rounded-lg p-4 border border-blue-900/20">
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
      <div className="mt-6 pt-4 border-t border-blue-900/20">
        <h4 className="text-sm font-semibold text-sky-300 mb-3">📍 Trạng thái cảm biến</h4>
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
      <div className="mt-4 pt-4 border-t border-blue-900/20">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400 text-xs">Ngưỡng</p>
            <p className="text-sky-300 font-bold">{state.threshold} ppm</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Chế độ hoạt động</p>
            <p className={`font-bold ${state.autoManual === "AUTO" ? "text-green-400" : "text-sky-400"}`}>
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
