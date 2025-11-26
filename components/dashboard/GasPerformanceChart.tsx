"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

interface GasPerformanceChartProps {
  history: { time: string; value: number }[];
  threshold: number;
  mode: "day" | "week" | "month";
}

export default function GasPerformanceChart({ history, threshold, mode }: GasPerformanceChartProps) {
  const chartData = useMemo(() => {
    // For now, use the current history data
    // In production, you'd aggregate data based on mode
    return history.map((item) => ({
      time: item.time,
      gas: item.value,
      isWarning: item.value > threshold,
    }));
  }, [history, threshold]);

  return (
    <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.2)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-orange-300 mb-1">Biểu đồ Gas</h3>
          <p className="text-gray-400 text-sm">Biến động nồng độ khí gas theo thời gian</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#280E0A",
              border: "1px solid #991b1b",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#fbbf24" }}
          />
          <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} label="Ngưỡng" />
          <Bar dataKey="gas" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.isWarning ? "#FF4C29" : "#FFA83D"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#FFA83D] rounded"></div>
          <span className="text-gray-400">Bình thường</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#FF4C29] rounded"></div>
          <span className="text-gray-400">Vượt ngưỡng</span>
        </div>
      </div>
    </div>
  );
}
