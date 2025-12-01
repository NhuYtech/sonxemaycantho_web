'use client'

import React from "react";
import { useFirebaseDevice } from "../../hooks/useFirebaseDevice";
import DashboardAlertBanner from "../../components/dashboard/DashboardAlertBanner";
import DashboardStatCard from "../../components/dashboard/DashboardStatCard";
import DashboardControlPanel from "../../components/dashboard/DashboardControlPanel";
import SystemStatusPanel from "../../components/dashboard/SystemStatusPanel";
import GasPerformanceChart from "../../components/dashboard/GasPerformanceChart";
import { Wind, Flame, Zap, Database } from "lucide-react";

export default function Dashboard() {
  const [state] = useFirebaseDevice();

  // Determine gas status
  const getGasStatus = () => {
    if (state.gas > state.threshold) return "danger";
    if (state.gas > state.threshold * 0.8) return "warning";
    return "safe";
  };

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

  const getFireStatus = () => {
    return state.fire ? "danger" : "safe";
  };

  const getRelayStatus = () => {
    if (state.relay1 || state.relay2) return "warning";
    return "neutral";
  };

  return (
    <div 
      className="min-h-screen text-gray-100 px-4 sm:px-6 py-6"
      style={{
        background: "linear-gradient(180deg, #340800 0%, #B83C1B 70%, #FF884B 100%)"
      }}
    >
      {/* Alert Banner */}
      <DashboardAlertBanner fire={state.fire} gas={state.gas} threshold={state.threshold} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
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

      {/* Charts & Controls */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <GasPerformanceChart history={state.gasHistory} threshold={state.threshold} mode="day" />
        </div>
        <div>
          <DashboardControlPanel state={state} />
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6">
        <SystemStatusPanel state={state} />
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-300">
        Được phát triển bởi <span className="text-orange-400 font-semibold">SAFEHOME SYSTEMS</span>
      </div>
    </div>
  );
}
