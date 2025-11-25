"use client";

import { LogEvent, TimeFilter } from "@/types/logs";
import { useMemo } from "react";
import { TrendingUp } from "lucide-react";

interface TimelineChartProps {
  logs: LogEvent[];
  timeFilter: TimeFilter;
}

export default function TimelineChart({ logs, timeFilter }: TimelineChartProps) {
  const chartData = useMemo(() => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    let days = 7;
    if (timeFilter === "today") days = 1;
    else if (timeFilter === "week") days = 7;
    else if (timeFilter === "month") days = 30;
    else days = 30;

    const points = new Array(days).fill(0).map((_, i) => {
      const date = new Date(now - (days - 1 - i) * oneDayMs);
      return {
        label: `${date.getDate()}/${date.getMonth() + 1}`,
        avgGas: 0,
        count: 0,
        events: 0,
      };
    });

    logs.forEach((log) => {
      const daysDiff = Math.floor((now - log.timestamp) / oneDayMs);
      if (daysDiff < 0 || daysDiff >= days) return;

      const index = days - 1 - daysDiff;
      points[index].avgGas += log.gas;
      points[index].count++;
      points[index].events++;
    });

    points.forEach((p) => {
      if (p.count > 0) p.avgGas = Math.round(p.avgGas / p.count);
    });

    const maxGas = Math.max(...points.map((p) => p.avgGas), 1);
    const maxEvents = Math.max(...points.map((p) => p.events), 1);

    return { points, maxGas, maxEvents };
  }, [logs, timeFilter]);

  return (
    <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="text-orange-400" size={24} />
        <h3 className="text-xl font-bold text-orange-300">Xu hướng Gas & Sự kiện</h3>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-linear-to-r from-yellow-500 to-orange-500 rounded"></div>
          <span className="text-gray-400">Gas trung bình</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-linear-to-r from-purple-500 to-pink-500 rounded"></div>
          <span className="text-gray-400">Số sự kiện</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Gas line */}
          <path
            d={chartData.points
              .map((p, i) => {
                const x = (i / (chartData.points.length - 1)) * 100;
                const y = 100 - (p.avgGas / chartData.maxGas) * 90;
                return `${i === 0 ? "M" : "L"} ${x}% ${y}%`;
              })
              .join(" ")}
            fill="none"
            stroke="url(#gasGradient)"
            strokeWidth="3"
            className="drop-shadow-lg"
          />

          {/* Events line */}
          <path
            d={chartData.points
              .map((p, i) => {
                const x = (i / (chartData.points.length - 1)) * 100;
                const y = 100 - (p.events / chartData.maxEvents) * 90;
                return `${i === 0 ? "M" : "L"} ${x}% ${y}%`;
              })
              .join(" ")}
            fill="none"
            stroke="url(#eventsGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="opacity-70"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="gasGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="eventsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* Data points */}
          {chartData.points.map((p, i) => {
            const x = (i / (chartData.points.length - 1)) * 100;
            const yGas = 100 - (p.avgGas / chartData.maxGas) * 90;
            return (
              <g key={i}>
                <circle cx={`${x}%`} cy={`${yGas}%`} r="4" fill="#f97316" className="hover:r-6 transition-all">
                  <title>{`${p.label}: Gas ${p.avgGas}`}</title>
                </circle>
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
          {chartData.points.map((p, i) => (
            <span key={i} className="text-center" style={{ width: `${100 / chartData.points.length}%` }}>
              {i % Math.ceil(chartData.points.length / 7) === 0 ? p.label : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
