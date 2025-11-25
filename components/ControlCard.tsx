"use client";

import ToggleBtn from "./ToggleBtn";
import { DeviceState } from "@/types/device";
import { db } from "@/lib/firebase";
import { ref, set } from "firebase/database";

export default function ControlCard({ state }: { state: DeviceState }) {
  
  // Relay 1
  const toggleRelay1 = (value: boolean) => {
    set(ref(db, "/control/relay1"), value ? 1 : 0);
  };

  // Relay 2
  const toggleRelay2 = (value: boolean) => {
    set(ref(db, "/control/relay2"), value ? 1 : 0);
  };

  // AUTO / MANUAL
  const toggleMode = (value: boolean) => {
    const newMode = value ? 1 : 0; // AUTO=1, MANUAL=0
    set(ref(db, "/settings/mode_command"), newMode);
  };

  // Tắt còi
  const turnOffBuzzer = () => {
    set(ref(db, "/control/buzzer"), 0);
  };

  return (
    <div className="bg-[#1A0A00]/80 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(255,60,60,0.3)] p-6 border border-red-700/30">
      <h3 className="font-bold text-lg mb-4 text-gray-200">Điều khiển thiết bị</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Relay 1 */}
        <ToggleBtn
          label="Relay 1"
          checked={state.relay1}
          onChange={(v) => toggleRelay1(v)}
        />

        {/* Relay 2 */}
        <ToggleBtn
          label="Relay 2"
          checked={state.relay2}
          onChange={(v) => toggleRelay2(v)}
        />

        {/* AUTO / MANUAL */}
        <ToggleBtn
          label="Chế độ"
          checked={state.autoManual === "AUTO"}
          customOn="TỰ ĐỘNG"
          customOff="THỦ CÔNG"
          onChange={(v) => toggleMode(v)}
        />
      </div>

      <button
        onClick={turnOffBuzzer}
        className="col-span-2 mt-6 w-full bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
      >
        Tắt còi báo động
      </button>
    </div>
  );
}
