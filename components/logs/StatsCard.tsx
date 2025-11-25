"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function StatsCard({ title, value, icon: Icon, color, bgColor }: StatsCardProps) {
  return (
    <div className={`${bgColor} backdrop-blur-sm border border-red-900/30 rounded-xl p-5 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`${color} opacity-20`}>
          <Icon size={48} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
