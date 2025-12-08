"use client";

import { LogEvent, TimeFilter } from "@/types/logs";
import { useMemo } from "react";
import { BarChart3 } from "lucide-react";

interface PerformanceChartProps {
  logs: LogEvent[];
  timeFilter: TimeFilter;
}

export default function PerformanceChart({ logs, timeFilter }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    let days = 7;
    if (timeFilter === "today") days = 1;
    else if (timeFilter === "week") days = 7;
    else if (timeFilter === "month") days = 30;
    else days = 30;

    const buckets = new Array(days).fill(0).map((_, i) => {
      const date = new Date(now - (days - 1 - i) * oneDayMs);
      return {
        label: `${date.getDate()}/${date.getMonth() + 1}`,
        fire: 0,
        gas: 0,
        tempHigh: 0,
        humidityLow: 0,
      };
    });

    logs.forEach((log) => {
      const daysDiff = Math.floor((now - log.timestamp) / oneDayMs);
      if (daysDiff < 0 || daysDiff >= days) return;

      const index = days - 1 - daysDiff;
      if (log.type === "fire_detected") buckets[index].fire++;
      if (log.type === "gas_warning") buckets[index].gas++;
      if (log.temperature > 45) buckets[index].tempHigh++;
      if (log.humidity < 25) buckets[index].humidityLow++;
    });

    const maxValue = Math.max(...buckets.map((b) => Math.max(b.fire, b.gas, b.tempHigh, b.humidityLow)), 1);

    return { buckets, maxValue };
  }, [logs, timeFilter]);

  return (
    <div className="bg-[#071933]/70 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-center gap-3 mb-6">
        <BarChart3 className="text-sky-400" size={24} />
        <h3 className="text-xl font-bold text-sky-300">Biểu đồ hoạt động</h3>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mb-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-400">Cháy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-gray-400">Gas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-400">Nhiệt độ cao</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan-500 rounded"></div>
          <span className="text-gray-400">Độ ẩm thấp</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 flex items-end gap-2">
        {chartData.buckets.map((bucket, i) => {
          const fireHeight = (bucket.fire / chartData.maxValue) * 100;
          const gasHeight = (bucket.gas / chartData.maxValue) * 100;
          const tempHighHeight = (bucket.tempHigh / chartData.maxValue) * 100;
          const humidityLowHeight = (bucket.humidityLow / chartData.maxValue) * 100;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center gap-1 h-56">
                {/* Fire bar */}
                <div
                  className="w-1/4 bg-red-500/80 rounded-t transition-all duration-300 hover:bg-red-500"
                  style={{ height: `${fireHeight}%` }}
                  title={`Cháy: ${bucket.fire}`}
                ></div>
                {/* Gas bar */}
                <div
                  className="w-1/4 bg-yellow-500/80 rounded-t transition-all duration-300 hover:bg-yellow-500"
                  style={{ height: `${gasHeight}%` }}
                  title={`Gas: ${bucket.gas}`}
                ></div>
                {/* Temperature High bar */}
                <div
                  className="w-1/4 bg-blue-500/80 rounded-t transition-all duration-300 hover:bg-blue-500"
                  style={{ height: `${tempHighHeight}%` }}
                  title={`Nhiệt độ cao: ${bucket.tempHigh}`}
                ></div>
                {/* Humidity Low bar */}
                <div
                  className="w-1/4 bg-cyan-500/80 rounded-t transition-all duration-300 hover:bg-cyan-500"
                  style={{ height: `${humidityLowHeight}%` }}
                  title={`Độ ẩm thấp: ${bucket.humidityLow}`}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">{bucket.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
