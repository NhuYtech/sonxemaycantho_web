"use client";
import clsx from "clsx";

export default function ToggleBtn({
  label,
  checked,
  onChange,
  customOn = "ON",
  customOff = "OFF",
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  customOn?: string;
  customOff?: string;
}) {
  return (
    <div>
      <div className="font-semibold text-gray-200 mb-2">{label}</div>

      <button
        className={clsx(
          "w-full rounded-lg py-3 font-bold transition-all duration-300",
          checked
            ? "bg-linear-to-r from-green-500 to-green-600 shadow-[0_0_15px_rgba(34,197,94,0.5)] text-white"
            : "bg-[#2A1410] text-gray-400 border border-red-900/30 hover:border-red-700/50"
        )}
        onClick={() => onChange(!checked)}
      >
        {checked ? customOn : customOff}
      </button>
    </div>
  );
}
