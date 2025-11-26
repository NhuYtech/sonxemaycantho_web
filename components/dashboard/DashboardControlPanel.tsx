"use client";

import { DeviceState } from "@/types/device";
import { Power, Settings as SettingsIcon } from "lucide-react";
import { ref, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { useState } from "react";

interface DashboardControlPanelProps {
  state: DeviceState;
}

export default function DashboardControlPanel({ state }: DashboardControlPanelProps) {
  const [loading, setLoading] = useState(false);

  const toggleRelay = async (relay: "relay1" | "relay2") => {
    setLoading(true);
    try {
      const relayRef = ref(db, `/control/${relay}`);
      await set(relayRef, !state[relay]);
    } catch (error) {
      console.error("Error toggling relay:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = async () => {
    setLoading(true);
    try {
      const modeRef = ref(db, "/settings/mode");
      await set(modeRef, state.autoManual === "AUTO" ? 0 : 1);
    } catch (error) {
      console.error("Error toggling mode:", error);
    } finally {
      setLoading(false);
    }
  };

  const turnOffBuzzer = async () => {
    setLoading(true);
    try {
      const buzzerRef = ref(db, "/control/buzzer");
      await set(buzzerRef, false);
    } catch (error) {
      console.error("Error turning off buzzer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/40 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.25)]">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="text-orange-400" size={24} />
        <h3 className="text-xl font-bold text-orange-300">Điều khiển thiết bị</h3>
      </div>

      <div className="space-y-4">
        {/* Relay 1 */}
        <div className="bg-red-950/30 rounded-lg p-4 border border-red-900/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Power size={18} className="text-blue-400" />
              <span className="font-semibold text-gray-200">Relay 1</span>
            </div>
            <button
              onClick={() => toggleRelay("relay1")}
              disabled={loading || state.autoManual === "AUTO"}
              className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                state.relay1
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              } ${loading || state.autoManual === "AUTO" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {state.relay1 ? "BẬT" : "TẮT"}
            </button>
          </div>
          {state.autoManual === "AUTO" && (
            <p className="text-xs text-yellow-500">Chế độ AUTO - không thể điều khiển thủ công</p>
          )}
        </div>

        {/* Relay 2 */}
        <div className="bg-red-950/30 rounded-lg p-4 border border-red-900/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Power size={18} className="text-blue-400" />
              <span className="font-semibold text-gray-200">Relay 2</span>
            </div>
            <button
              onClick={() => toggleRelay("relay2")}
              disabled={loading || state.autoManual === "AUTO"}
              className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                state.relay2
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              } ${loading || state.autoManual === "AUTO" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {state.relay2 ? "BẬT" : "TẮT"}
            </button>
          </div>
          {state.autoManual === "AUTO" && (
            <p className="text-xs text-yellow-500">Chế độ AUTO - không thể điều khiển thủ công</p>
          )}
        </div>

        {/* Mode Toggle */}
<div className="bg-red-950/30 rounded-lg p-4 border border-red-900/20">
  <div className="flex items-center justify-between">
    <span className="font-semibold text-gray-200">Chế độ</span>
    <button
      onClick={toggleMode}
      disabled={loading}
      className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all ${
        state.autoManual === "AUTO"
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-orange-600 text-white hover:bg-orange-700"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {state.autoManual === "AUTO" ? "TỰ ĐỘNG" : "THỦ CÔNG"}
    </button>
  </div>
</div>


        {/* Buzzer Off */}
        <button
          onClick={turnOffBuzzer}
          disabled={loading || !state.buzzer}
          className={`w-full py-3 rounded-lg font-bold transition-all ${
            state.buzzer
              ? "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          🔇 TẮT CÒI BÁO ĐỘNG
        </button>
      </div>
    </div>
  );
}
