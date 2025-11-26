"use client";

import React from "react";
import { useFirebaseDevice } from "@/hooks/useFirebaseDevice";
import { Wind, Flame, Zap, Database } from "lucide-react";
import { useUI } from "@/contexts/UIContext";

import DashboardAlertBanner from "@/components/dashboard/DashboardAlertBanner";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import GasPerformanceChart from "@/components/dashboard/GasPerformanceChart";
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

  // Determine fire status
  const getFireStatus = () => {
    return state.fire ? "danger" : "safe";
  };

  // Determine relay status
  const getRelayStatus = () => {
    if (state.relay1 || state.relay2) return "warning";
    return "neutral";
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <DashboardAlertBanner fire={state.fire} gas={state.gas} threshold={state.threshold} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title={t("dashboard.gas")}
          value={`${state.gas}`}
          icon={Wind}
          status={getGasStatus()}
          subtitle={t("unit.ppm")}
        />
        <DashboardStatCard
          title={t("dashboard.fire")}
          value={state.fire ? t("dashboard.fire.detected") : t("dashboard.fire.none")}
          icon={Flame}
          status={getFireStatus()}
        />
        <DashboardStatCard
          title={t("dashboard.relay")}
          value={`R1: ${state.relay1 ? "ON" : "OFF"} | R2: ${state.relay2 ? "ON" : "OFF"}`}
          icon={Zap}
          status={getRelayStatus()}
        />
        <DashboardStatCard
          title={t("dashboard.system")}
          value={state.firebase ? t("dashboard.connected") : t("dashboard.offline")}
          icon={Database}
          status={state.firebase ? "safe" : "danger"}
          subtitle={`${t("dashboard.mode")}: ${state.autoManual}`}
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

      {/* Timeline & Status Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FireAlertsTimeline history={state.gasHistory} threshold={state.threshold} />
        </div>
        <div>
          <SystemStatusPanel state={state} />
        </div>
      </div>

      {/* Logs Preview */}
      <LogsPreview gas={state.gas} fire={state.fire} mode={state.autoManual} threshold={state.threshold} />
    </div>
  );
}
