"use client";
import clsx from "clsx";
import { db } from "@/lib/firebase";
import { ref, set } from "firebase/database";

export default function SensorCard({ state }: any) {
  const handleThresholdChange = (newThreshold: number) => {
    // Update Firebase
    set(ref(db, "/settings/threshold"), newThreshold);
  };

  return (
    <div className="bg-[#212836] rounded-lg shadow p-5 mb-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-lg">Mức gas hiện tại:</div>
          <div className="font-mono text-2xl">{state.gas} ppm</div>
        </div>
        <span className={clsx(
          "px-3 py-1 rounded-xl font-semibold",
          state.gas > state.threshold ? "bg-red-600" : "bg-green-500"
        )}>
          {state.gas > state.threshold ? "Cảnh báo!" : "An toàn"}
        </span>
      </div>

      <div className="my-1">
        <div className="h-3 bg-gray-700 rounded">
          <div
            style={{ width: Math.min(100, state.gas / 12) + "%" }}
            className={clsx("h-3 rounded", state.gas > state.threshold ? "bg-red-500" : "bg-green-400")}
          />
        </div>
      </div>

      <div className="mt-2 flex gap-2 items-center">
        <span>Ngưỡng cảnh báo:</span>
        <input
          type="range" min={200} max={1000} step={10}
          value={state.threshold}
          onChange={e => handleThresholdChange(parseInt(e.target.value))}
          className="w-32"
        />
        <span>{state.threshold} ppm</span>
      </div>

      <div className="mt-2 flex gap-2 items-center">
        <span>Cảm biến lửa:</span>
        <span className={clsx(
          "flex gap-1 px-3 py-1 rounded-xl font-semibold",
          state.fire ? 'bg-red-600' : 'bg-green-600'
        )}>
          <svg width={18} height={18}>
            <circle cx="9" cy="9" r="8" fill={state.fire ? "#fff" : "#98fb98"} />
          </svg>
          {state.fire ? "Phát hiện cháy" : "Không cháy"}
        </span>
      </div>
    </div>
  );
}
