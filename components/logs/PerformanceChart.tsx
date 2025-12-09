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
    const oneHourMs = 60 * 60 * 1000;
    const oneDayMs = 24 * 60 * 60 * 1000;

    type BucketData = {
      label: string;
      fire: number;
      gas: number;
      tempHigh: number;
      humidityLow: number;
      connection: number;
    };

    let buckets: BucketData[];
    let maxValue: number;

    // Xử lý filter theo giờ - chia thành 12 khoảng 5 phút
    if (timeFilter === "hour") {
      buckets = new Array(12).fill(0).map((_, i) => {
        const minutesAgo = (11 - i) * 5;
        return {
          label: `${minutesAgo}m`,
          fire: 0,
          gas: 0,
          tempHigh: 0,
          humidityLow: 0,
          connection: 0,
        };
      });

      logs.forEach((log) => {
        const minutesDiff = Math.floor((now - log.timestamp) / (5 * 60 * 1000));
        if (minutesDiff < 0 || minutesDiff >= 12) return;

        const index = 11 - minutesDiff;
        if (log.type === "fire_detected") buckets[index].fire++;
        if (log.type === "gas_warning") buckets[index].gas++;
        if (log.temperature > 45) buckets[index].tempHigh++;
        if (log.humidity < 25) buckets[index].humidityLow++;
        if (log.type === "system_event") buckets[index].connection++;
      });
    } else {
      // Xử lý các filter khác (ngày, tuần, tháng)
      let days = 7;
      if (timeFilter === "today") days = 1;
      else if (timeFilter === "week") days = 7;
      else if (timeFilter === "month") days = 30;
      else days = 30;

      buckets = new Array(days).fill(0).map((_, i) => {
        const date = new Date(now - (days - 1 - i) * oneDayMs);
        return {
          label: `${date.getDate()}/${date.getMonth() + 1}`,
          fire: 0,
          gas: 0,
          tempHigh: 0,
          humidityLow: 0,
          connection: 0,
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
        if (log.type === "system_event") buckets[index].connection++;
      });
    }

    maxValue = Math.max(...buckets.map((b) => Math.max(b.fire, b.gas, b.tempHigh, b.humidityLow, b.connection)), 1);

    return { buckets, maxValue };
  }, [logs, timeFilter]);

  const hasData = logs.length > 0;

  return (
    <div className="bg-[#152A45]/80 backdrop-blur-sm border-2 border-blue-700/50 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-center gap-3 mb-6">
        <BarChart3 className="text-sky-400" size={24} />
        <h3 className="text-xl font-bold text-sky-300">📊 Biểu đồ tần suất sự kiện</h3>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="bg-blue-950/30 rounded-full p-6 mb-4">
            <BarChart3 size={48} className="text-gray-600" />
          </div>
          <p className="text-lg font-medium">Chưa có dữ liệu</p>
          <p className="text-sm text-gray-600 mt-2">Biểu đồ sẽ hiển thị khi có sự kiện</p>
        </div>
      ) : (
        <>
          {/* Legend */}
          <div className="flex justify-center gap-4 mb-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-300 font-medium">Cháy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-300 font-medium">Gas cao</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-gray-300 font-medium">Nhiệt độ cao</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded"></div>
              <span className="text-gray-300 font-medium">Độ ẩm thấp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-300 font-medium">Kết nối</span>
            </div>
          </div>

      {/* Chart */}
      <div className="relative h-64 flex items-end gap-2">
        {chartData.buckets.map((bucket, i) => {
          const fireHeight = (bucket.fire / chartData.maxValue) * 100;
          const gasHeight = (bucket.gas / chartData.maxValue) * 100;
          const tempHighHeight = (bucket.tempHigh / chartData.maxValue) * 100;
          const humidityLowHeight = (bucket.humidityLow / chartData.maxValue) * 100;
          const connectionHeight = (bucket.connection / chartData.maxValue) * 100;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center gap-1 h-56">
                {/* Fire bar */}
                <div
                  className="w-1/5 bg-red-500/80 rounded-t transition-all duration-300 hover:bg-red-500"
                  style={{ height: `${fireHeight}%` }}
                  title={`Cháy: ${bucket.fire}`}
                ></div>
                {/* Gas bar */}
                <div
                  className="w-1/5 bg-yellow-500/80 rounded-t transition-all duration-300 hover:bg-yellow-500"
                  style={{ height: `${gasHeight}%` }}
                  title={`Gas: ${bucket.gas}`}
                ></div>
                {/* Temperature High bar */}
                <div
                  className="w-1/5 bg-orange-500/80 rounded-t transition-all duration-300 hover:bg-orange-500"
                  style={{ height: `${tempHighHeight}%` }}
                  title={`Nhiệt độ cao: ${bucket.tempHigh}`}
                ></div>
                {/* Humidity Low bar */}
                <div
                  className="w-1/5 bg-cyan-500/80 rounded-t transition-all duration-300 hover:bg-cyan-500"
                  style={{ height: `${humidityLowHeight}%` }}
                  title={`Độ ẩm thấp: ${bucket.humidityLow}`}
                ></div>
                {/* Connection bar */}
                <div
                  className="w-1/5 bg-blue-500/80 rounded-t transition-all duration-300 hover:bg-blue-500"
                  style={{ height: `${connectionHeight}%` }}
                  title={`Kết nối: ${bucket.connection}`}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">{bucket.label}</span>
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
}
