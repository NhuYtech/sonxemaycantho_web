// app/dashboard/page.tsx
"use client";

import React from "react";
import { useFirebaseDevice } from "@/hooks/useFirebaseDevice";

import StatusBanner from "@/components/StatusBanner";
import SensorCard from "@/components/SensorCard";
import ControlCard from "@/components/ControlCard";
import SystemStatus from "@/components/SystemStatus";
import GasChart from "@/components/GasChart";

export default function Dashboard() {
  const [state, setState] = useFirebaseDevice();


  return (
<div
  className="min-h-screen text-gray-100 px-2 sm:px-6 py-6 rounded-2xl"
  style={{
    background: "linear-gradient(180deg, #340800 0%, #B83C1B 70%, #FF884B 100%)",
  }}
>

      <StatusBanner gas={state.gas} fire={state.fire} threshold={state.threshold} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <SensorCard state={state} />
        <ControlCard state={state} />
        <SystemStatus state={state} />
      </div>

      <GasChart history={state.gasHistory} threshold={state.threshold} />
    </div>
  );
}
