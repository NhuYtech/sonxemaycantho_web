"use client";
import ToggleBtn from "./ToggleBtn";
import { DeviceState } from "@/types/device";

export default function ControlCard({
  state,
  setState,
}: {
  state: DeviceState;
  setState: any;
}) {
  return (
    <div className="bg-[#1A0A00]/80 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(255,60,60,0.3)] p-6 border border-red-700/30">
      <h3 className="font-bold text-lg mb-4 text-gray-200">Điều khiển thiết bị</h3>

      <div className="grid grid-cols-2 gap-4">
        <ToggleBtn
          label="Relay 1"
          checked={state.relay1}
          onChange={(v) => setState((s: DeviceState) => ({ ...s, relay1: v }))}
        />

        <ToggleBtn
          label="Relay 2"
          checked={state.relay2}
          onChange={(v) => setState((s: DeviceState) => ({ ...s, relay2: v }))}
        />

        <ToggleBtn
          label="Cửa hút khói"
          checked={state.window}
          customOn="MỞ"
          customOff="ĐÓNG"
          onChange={(v) => setState((s: DeviceState) => ({ ...s, window: v }))}
        />

        <ToggleBtn
          label="Chế độ"
          checked={state.autoManual === "AUTO"}
          customOn="TỰ ĐỘNG"
          customOff="THỦ CÔNG"
          onChange={(v) =>
            setState((s: DeviceState) => ({
              ...s,
              autoManual: v ? "AUTO" : "MANUAL",
            }))
          }
        />
      </div>

      <button className="col-span-2 mt-6 w-full bg-linear-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]">
        Tắt còi báo động
      </button>
    </div>
  );
}
