'use client'

import React from "react";
import { useMockedDevice } from "@/hooks/useMockedDevice";
import StatusBanner from "@/components/StatusBanner";
import SensorCard from "@/components/SensorCard";
import ControlCard from "@/components/ControlCard";
import SystemStatus from "@/components/SystemStatus";
import GasChart from "@/components/GasChart";

export default function Dashboard() {
  const [state, setState] = useMockedDevice();

  return (
    <div 
      className="min-h-screen text-gray-100 px-4 sm:px-6 py-6"
      style={{
        background: "linear-gradient(180deg, #340800 0%, #B83C1B 70%, #FF884B 100%)"
      }}
    >
      <StatusBanner
        gas={state.gas}
        fire={state.fire}
        threshold={state.threshold}
      />

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <SensorCard state={state} setState={setState} />
        <ControlCard state={state} setState={setState} />
        <SystemStatus state={state} />
      </div>

      {/* REALTIME GAS CHART */}
      <GasChart history={state.gasHistory} threshold={state.threshold} />

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-black">
        Được phát triển bởi <span className="text-red-700 font-semibold">SAFEHOME SYSTEMS</span>
      </div>
    </div>
  );
}
