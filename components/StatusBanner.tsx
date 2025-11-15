"use client";
import clsx from "clsx";

export default function StatusBanner({ gas, fire, threshold }: {
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
    <div className={`bg-linear-to-r ${bgColor} p-4 rounded-xl mb-6 text-white font-bold text-xl text-center ${shadow} border border-white/20`}>
      {label}
    </div>
  );
}
