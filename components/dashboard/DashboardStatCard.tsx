"use client";

import { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  status: "safe" | "warning" | "danger" | "neutral";
  subtitle?: string;
}

const statusColors = {
  safe: {
    bg: "bg-green-950/40",
    border: "border-green-700/40",
    text: "text-green-400",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]",
  },
  warning: {
    bg: "bg-yellow-950/40",
    border: "border-yellow-700/40",
    text: "text-yellow-400",
    glow: "shadow-[0_0_20px_rgba(234,179,8,0.2)]",
  },
  danger: {
    bg: "bg-red-950/40",
    border: "border-red-700/40",
    text: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
  },
  neutral: {
    bg: "bg-gray-950/40",
    border: "border-gray-700/40",
    text: "text-gray-400",
    glow: "shadow-[0_0_15px_rgba(107,114,128,0.2)]",
  },
};

export default function DashboardStatCard({ title, value, icon: Icon, status, subtitle }: DashboardStatCardProps) {
  const colors = statusColors[status];

  return (
    <div
      className={`${colors.bg} ${colors.border} ${colors.glow} backdrop-blur-sm border rounded-xl p-5 transition-all hover:scale-105`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`${colors.text} p-2 rounded-lg bg-black/20`}>
          <Icon size={24} strokeWidth={2} />
        </div>
      </div>

      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
