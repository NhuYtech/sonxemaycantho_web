"use client";
import clsx from "clsx";

export default function SystemStatus({ state }: any) {
  return (
    <div className="bg-[#212836] rounded-lg p-5 shadow flex flex-col gap-2">
      <div className="flex gap-2 text-sm">
        <span className={clsx("px-2 py-1 rounded", state.wifi ? "bg-green-600" : "bg-red-600")}>WiFi</span>
        <span className={clsx("px-2 py-1 rounded", state.blynk ? "bg-green-600" : "bg-red-600")}>Blynk</span>
        <span className={clsx("px-2 py-1 rounded", state.firebase ? "bg-green-600" : "bg-red-600")}>Firebase</span>
      </div>

      <div className="bg-[#233148] text-xs rounded p-2 mt-2">
        <ul className="ml-3 list-disc">
          <li>MQ2: {state.gas} ppm</li>
          <li>Fire: {state.fire ? "Có cháy":"Không cháy"}</li>
          <li>Relay1: {state.relay1?"ON":"OFF"}</li>
          <li>Relay2: {state.relay2?"ON":"OFF"}</li>
          <li>Cửa hút khói: {state.window?"OPEN":"CLOSE"}</li>
          <li>MODE: {state.autoManual}</li>
        </ul>
      </div>
    </div>
  );
}
