"use client";

import React from "react";
import { useFirebaseDevice } from "@/hooks/useFirebaseDevice";
import { Wind, Flame, Zap, Database, Thermometer, Droplets } from "lucide-react";
import { useUI } from "@/contexts/UIContext";

import DashboardAlertBanner from "@/components/dashboard/DashboardAlertBanner";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import GasPerformanceChart from "@/components/dashboard/GasPerformanceChart";
import TemperatureHumidityChart from "@/components/dashboard/TemperatureHumidityChart";
import FireAlertsTimeline from "@/components/dashboard/FireAlertsTimeline";
import DashboardControlPanel from "@/components/dashboard/DashboardControlPanel";
import SystemStatusPanel from "@/components/dashboard/SystemStatusPanel";
import LogsPreview from "@/components/dashboard/LogsPreview";

export default function Dashboard() {
  const { t } = useUI();
  const [state] = useFirebaseDevice();

  // Determine gas status
  const getGasStatus = () => {
    if (state.gas > state.threshold) return "danger";
    if (state.gas > state.threshold * 0.8) return "warning";
    return "safe";
  };

  // Get gas level text
  const getGasLevelText = () => {
    if (state.gas > state.threshold) return "🔴 Cao";
    if (state.gas > state.threshold * 0.8) return "🟡 Trung bình";
    if (state.gas > state.threshold * 0.5) return "🟢 Thấp";
    return "🟢 Bình thường";
  };

  const getGasDescription = () => {
    if (state.gas > state.threshold) return "(vượt mức an toàn)";
    if (state.gas > state.threshold * 0.8) return "(cần theo dõi)";
    return "(mức an toàn)";
  };

  // Determine fire status
  const getFireStatus = () => {
    return state.fire ? "danger" : "safe";
  };

  // Determine relay status
  const getRelayStatus = () => {
    if (state.relay1 || state.relay2) return "warning";
    return "neutral";
  };

  // Determine temperature status
  const getTempStatus = () => {
    if (state.temperature > 45) return "danger";
    if (state.temperature >= 35) return "warning";
    return "safe";
  };

  const getTempLevelText = () => {
    if (state.temperature > 45) return "🔴 Quá nóng";
    if (state.temperature >= 35) return "🟡 Nóng";
    if (state.temperature >= 25) return "🟢 Bình thường";
    return "🔵 Mát";
  };

  // Determine humidity status
  const getHumidityStatus = () => {
    if (state.humidity < 25) return "danger";
    if (state.humidity < 40) return "warning";
    return "safe";
  };

  const getHumidityLevelText = () => {
    if (state.humidity < 25) return "🔴 Quá khô";
    if (state.humidity < 40) return "🟡 Khô";
    if (state.humidity <= 70) return "🟢 Bình thường";
    return "🔵 Ẩm";
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <DashboardAlertBanner fire={state.fire} gas={state.gas} threshold={state.threshold} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Trạng thái khí Gas"
          value={getGasLevelText()}
          icon={Wind}
          status={getGasStatus()}
          subtitle={`${state.gas} ppm ${getGasDescription()}`}
        />
        <DashboardStatCard
          title="Phát hiện nguồn nhiệt"
          value={state.fire ? "⚠️ Có ánh sáng bất thường" : "✅ Bình thường"}
          icon={Flame}
          status={getFireStatus()}
          subtitle={state.fire ? "(Có thể do lửa hoặc đèn mạnh)" : "(Không phát hiện nguồn lửa)"}
        />
        <DashboardStatCard
          title="Thiết bị điều khiển"
          value={`${state.relay1 || state.relay2 ? '🟢 Đang hoạt động' : '⚪ Tắt'}`}
          icon={Zap}
          status={getRelayStatus()}
          subtitle={`Thiết bị 1: ${state.relay1 ? 'Đang bật' : 'Đang tắt'} | Thiết bị 2: ${state.relay2 ? 'Đang bật' : 'Đang tắt'}`}
        />
        <DashboardStatCard
          title="Trạng thái hệ thống"
          value={state.firebase ? "🟢 Trực tuyến" : "🔴 Mất kết nối"}
          icon={Database}
          status={state.firebase ? "safe" : "danger"}
          subtitle={`Chế độ: ${state.autoManual === 'AUTO' ? 'Tự động' : 'Thủ công'}`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GasPerformanceChart history={state.gasHistory} threshold={state.threshold} mode="day" />
        </div>
        <div>
          <DashboardControlPanel state={state} />
        </div>
      </div>

      {/* Temperature & Humidity Chart */}
      <div className="w-full">
        <TemperatureHumidityChart tempHistory={state.tempHistory} humidityHistory={state.humidityHistory} />
      </div>

      {/* Timeline & Status Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FireAlertsTimeline 
            history={state.gasHistory} 
            threshold={state.threshold}
            tempHistory={state.tempHistory}
            humidityHistory={state.humidityHistory}
          />
        </div>
        <div>
          <SystemStatusPanel state={state} />
        </div>
      </div>

      {/* Logs Preview */}
      <LogsPreview 
        gas={state.gas} 
        fire={state.fire} 
        mode={state.autoManual} 
        threshold={state.threshold}
        temperature={state.temperature}
        humidity={state.humidity}
      />
    </div>
  );
}
