"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

interface GasPerformanceChartProps {
  history: { time: string; day: number; value: number }[];
  threshold: number;
  mode: "day" | "week" | "month";
}

export default function GasPerformanceChart({ history, threshold, mode }: GasPerformanceChartProps) {
  const chartData = useMemo(() => {
    // For now, use the current history data
    // In production, you'd aggregate data based on mode
    const data = history.map((item) => ({
      time: item.time,      // Full datetime for tooltip
      day: item.day,        // Day number for X axis
      gas: item.value,
      isWarning: item.value > threshold,
    }));

    // If no data, return empty array
    if (data.length === 0) {
      return [];
    }

    return data;
  }, [history, threshold]);

  // Check if there's no data
  const hasData = chartData.length > 0;

  return (
    <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.2)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-orange-300 mb-1">📊 Diễn biến mức khí Gas theo thời gian</h3>
          <p className="text-gray-400 text-sm">Theo dõi sự thay đổi nồng độ khí gas</p>
        </div>
      </div>

      {!hasData ? (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">📊 Chưa có dữ liệu</p>
            <p className="text-sm">Đang chờ dữ liệu từ cảm biến MQ-2...</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <Tooltip
            labelFormatter={(value, payload) => {
              if (payload && payload.length > 0 && payload[0].payload) {
                return payload[0].payload.time;
              }
              return value;
            }}
            contentStyle={{
              backgroundColor: "#1e1e1e",
              border: "1px solid #ffb86c",
              borderRadius: "8px",
              color: "#fff",     
              fontSize: "14px",
              padding: "10px",
            }}
            labelStyle={{
              color: "#fbbf24",    
              fontWeight: "bold",
            }}
            itemStyle={{
              color: "#f8f8f2",
              fontWeight: "bold",
            }}
          />
          <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} label="Ngưỡng" />
          <Bar dataKey="gas" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.isWarning ? "#FF4C29" : "#FFA83D"} />
            ))}
          </Bar>
        </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#FFA83D] rounded"></div>
          <span className="text-gray-400">🟩 Mức bình thường</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#FF4C29] rounded"></div>
          <span className="text-gray-400">🟥 Vượt mức an toàn</span>
        </div>
      </div>
    </div>
  );
}
