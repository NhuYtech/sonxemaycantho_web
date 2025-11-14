// app/page.tsx
'use client'

import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import clsx from "clsx";

// =====================================================
// MOCK DATA
// =====================================================
function useMockedDevice() {
  const [data, setData] = useState<DeviceState>({
    gas: 320,
    fire: false,
    relay1: false,
    relay2: false,
    window: false,
    buzzer: false,
    autoManual: "AUTO",
    threshold: 400,
    wifi: true,
    blynk: true,
    firebase: true,
    gasHistory: [],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString().slice(3, 8);
      const newGas = Math.max(
        0,
        Math.round(data.gas + (Math.random() - 0.5) * 40)
      );
      const newFire = Math.random() > 0.97;

      setData((d) => {
        let gasHistory = [...d.gasHistory, { time: timeStr, value: newGas }];
        if (gasHistory.length > 20) gasHistory.shift();

        return { ...d, gas: newGas, fire: newFire, gasHistory };
      });
    }, 1600);

    return () => clearInterval(timer);
  }, [data]);

  return [data, setData] as const;
}

// =====================================================
// BANNER
// =====================================================
function StatusBanner({
  gas,
  fire,
  threshold,
}: {
  gas: number;
  fire: boolean;
  threshold: number;
}) {
  let label = "Bình thường";
  let bgColor = "from-green-600 to-green-700";
  let shadow = "shadow-[0_0_20px_rgba(34,197,94,0.4)]";

  if (gas > threshold && fire) {
    label = "🔥 CẢNH BÁO GAS + CHÁY";
    bgColor = "from-red-600 to-red-800";
    shadow = "shadow-[0_0_30px_rgba(220,38,38,0.6)]";
  } else if (fire) {
    label = "🔥 CẢNH BÁO CHÁY";
    bgColor = "from-orange-600 to-red-600";
    shadow = "shadow-[0_0_25px_rgba(234,88,12,0.5)]";
  } else if (gas > threshold) {
    label = "⚠️ CẢNH BÁO GAS";
    bgColor = "from-yellow-500 to-orange-500";
    shadow = "shadow-[0_0_20px_rgba(234,179,8,0.4)]";
  }

  return (
    <div className={`bg-gradient-to-r ${bgColor} p-4 rounded-xl mb-6 text-white font-bold text-xl text-center ${shadow} border border-white/20`}>
      {label}
    </div>
  );
}

// =====================================================
// NÚT BẬT TẮT
// =====================================================
type ToggleBtnProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  customOn?: string;
  customOff?: string;
};

function ToggleBtn({
  label,
  checked,
  onChange,
  customOn = "ON",
  customOff = "OFF",
}: ToggleBtnProps) {
  return (
    <div>
      <div className="font-semibold text-gray-200 mb-2">{label}</div>
      <button
        className={clsx(
          "w-full rounded-lg py-3 font-bold transition-all duration-300",
          checked 
            ? "bg-gradient-to-r from-green-500 to-green-600 shadow-[0_0_15px_rgba(34,197,94,0.5)] text-white" 
            : "bg-[#2A1410] text-gray-400 border border-red-900/30 hover:border-red-700/50"
        )}
        onClick={() => onChange(!checked)}
      >
        {checked ? customOn : customOff}
      </button>
    </div>
  );
}

// =====================================================
// BADGE
// =====================================================
function Badge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={clsx(
        "px-3 py-1 rounded-full font-medium text-sm shadow-md",
        ok 
          ? "bg-gradient-to-r from-green-500 to-green-600 text-white" 
          : "bg-gradient-to-r from-red-600 to-red-700 text-white"
      )}
    >
      {label} {ok ? "✓" : "✗"}
    </span>
  );
}

// =====================================================
// DASHBOARD PAGE
// =====================================================
export default function Dashboard() {
  const [state, setState] = useMockedDevice();

  return (
    <div 
      className="min-h-screen text-gray-100 px-4 sm:px-6 py-6"
      style={{
        background: "linear-gradient(180deg, #340800 0%, #B83C1B 70%, #FF884B 100%)"
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-white/10 p-2 rounded-lg border border-red-400/50">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-2xl">
            🔥
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">CanTho FireGuard</h1>
          <p className="text-sm text-gray-300">Hệ thống giám sát & cảnh báo</p>
        </div>
      </div>

      <StatusBanner
        gas={state.gas}
        fire={state.fire}
        threshold={state.threshold}
      />

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* SENSOR CARD */}
        <div className="bg-[#1A0A00]/80 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(255,60,60,0.3)] p-6 border border-red-700/30">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="font-bold text-lg text-gray-200">MQ2 Gas Sensor</div>
              <div className="font-mono text-3xl font-bold text-white">{state.gas} <span className="text-xl text-gray-400">ppm</span></div>
            </div>

            <span
              className={clsx(
                "px-4 py-2 rounded-full font-semibold shadow-lg",
                state.gas > state.threshold 
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white animate-pulse" 
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white"
              )}
            >
              {state.gas > state.threshold ? "⚠️ Cảnh báo!" : "✓ An toàn"}
            </span>
          </div>

          <div className="mb-4">
            <div className="h-4 bg-[#2A1410] rounded-full overflow-hidden border border-red-900/30">
              <div
                style={{ width: Math.min(100, state.gas / 12) + "%" }}
                className={clsx(
                  "h-4 rounded-full transition-all duration-500",
                  state.gas > state.threshold 
                    ? "bg-gradient-to-r from-red-500 to-orange-500" 
                    : "bg-gradient-to-r from-green-400 to-green-500"
                )}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 items-center text-sm">
              <span className="text-gray-300">Ngưỡng MQ2:</span>
              <input
                type="range"
                min={200}
                max={1000}
                step={10}
                value={state.threshold}
                onChange={(e) =>
                  setState((s) => ({ ...s, threshold: parseInt(e.target.value) }))
                }
                className="flex-1"
              />
              <span className="font-bold text-orange-400">{state.threshold}</span>
            </div>

            <div className="flex gap-3 items-center pt-2 border-t border-red-900/30">
              <span className="text-gray-300">Fire Sensor:</span>
              <span
                className={clsx(
                  "flex gap-2 items-center px-4 py-2 rounded-full font-semibold",
                  state.fire 
                    ? "bg-gradient-to-r from-red-600 to-orange-600 text-white animate-pulse" 
                    : "bg-gradient-to-r from-green-600 to-green-700 text-white"
                )}
              >
                <svg width={12} height={12}>
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    fill={state.fire ? "#fff" : "#98fb98"}
                  />
                </svg>
                {state.fire ? "🔥 Phát hiện cháy" : "✓ Không cháy"}
              </span>
            </div>
          </div>
        </div>

        {/* CONTROL CARD */}
        <div className="bg-[#1A0A00]/80 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(255,60,60,0.3)] p-6 border border-red-700/30">
          <h3 className="font-bold text-lg mb-4 text-gray-200">⚙️ Điều khiển thiết bị</h3>
          <div className="grid grid-cols-2 gap-4">
            <ToggleBtn
              label="Relay 1"
              checked={state.relay1}
              onChange={(v) => setState((s) => ({ ...s, relay1: v }))}
            />

            <ToggleBtn
              label="Relay 2"
              checked={state.relay2}
              onChange={(v) => setState((s) => ({ ...s, relay2: v }))}
            />

            <ToggleBtn
              label="Cửa hút khói"
              checked={state.window}
              customOn="🔓 OPEN"
              customOff="🔒 CLOSE"
              onChange={(v) => setState((s) => ({ ...s, window: v }))}
            />

            <ToggleBtn
              label="Chế độ"
              checked={state.autoManual === "AUTO"}
              customOn="🤖 AUTO"
              customOff="👤 MANUAL"
              onChange={(v) =>
                setState((s) => ({ ...s, autoManual: v ? "AUTO" : "MANUAL" }))
              }
            />
          </div>

          <button className="col-span-2 mt-6 w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            🔕 Tắt còi báo động
          </button>
        </div>

        {/* STATUS LOG */}
        <div className="bg-[#1A0A00]/80 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(255,60,60,0.3)] p-6 border border-red-700/30">
          <h3 className="font-bold text-lg mb-4 text-gray-200">📡 Kết nối hệ thống</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge label="WiFi" ok={state.wifi} />
            <Badge label="Blynk" ok={state.blynk} />
            <Badge label="Firebase" ok={state.firebase} />
          </div>

          <div className="bg-[#2A1410]/60 rounded-lg p-4 border border-red-900/30">
            <div className="font-semibold mb-2 text-orange-400">Trạng thái thiết bị:</div>
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>MQ2:</span>
                <span className="font-mono text-white">{state.gas} ppm</span>
              </div>
              <div className="flex justify-between">
                <span>Fire:</span>
                <span className={state.fire ? "text-red-400 font-bold" : "text-green-400"}>
                  {state.fire ? "🔥 Có cháy" : "✓ Không cháy"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Relay 1:</span>
                <span className={state.relay1 ? "text-green-400" : "text-gray-500"}>
                  {state.relay1 ? "ON" : "OFF"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Relay 2:</span>
                <span className={state.relay2 ? "text-green-400" : "text-gray-500"}>
                  {state.relay2 ? "ON" : "OFF"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cửa hút khói:</span>
                <span className={state.window ? "text-green-400" : "text-gray-500"}>
                  {state.window ? "OPEN" : "CLOSE"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Chế độ:</span>
                <span className="text-orange-400 font-semibold">{state.autoManual}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REALTIME GAS CHART */}
      <div className="bg-[#1A0A00]/80 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(255,60,60,0.3)] mt-6 p-6 border border-red-700/30">
        <div className="font-bold text-lg mb-4 text-gray-200">📊 Biểu đồ Gas MQ2 realtime</div>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={state.gasHistory}>
            <XAxis 
              dataKey="time" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A0A00', 
                border: '1px solid #991b1b',
                borderRadius: '8px',
                color: '#fff'
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#f97316"
              strokeWidth={3}
              dot={false}
            />

            {state.gasHistory.map((pt, i) =>
              pt.value > state.threshold ? (
                <ReferenceLine key={i} x={pt.time} stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-black">
        Được phát triển bởi <span className="text-red-700 font-semibold">SAFEHOME SYSTEMS</span>
      </div>
    </div>
  );
}

// =====================================================
// TYPES
// =====================================================
type DeviceState = {
  gas: number;
  fire: boolean;
  relay1: boolean;
  relay2: boolean;
  window: boolean;
  buzzer: boolean;
  autoManual: "AUTO" | "MANUAL";
  threshold: number;
  wifi: boolean;
  blynk: boolean;
  firebase: boolean;
  gasHistory: { time: string; value: number }[];
};