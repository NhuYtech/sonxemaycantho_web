"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  bgColor, 
  subtitle,
  trend,
  trendValue
}: StatsCardProps) {
  return (
    <div className={`${bgColor} backdrop-blur-sm border-2 border-blue-700/40 rounded-xl p-5 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-2 font-medium">{title}</p>
          <p className={`text-4xl font-bold ${color} mb-1`}>{value}</p>
          
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-semibold ${
                trend === 'up' ? 'text-red-400' : 
                trend === 'down' ? 'text-green-400' : 
                'text-gray-400'
              }`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </span>
              <span className="text-xs text-gray-500">so với trước</span>
            </div>
          )}
        </div>
        
        <div className={`${color} opacity-30 p-3 rounded-lg bg-black/20`}>
          <Icon size={36} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
