"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TemperatureHumidityChartProps {
  tempHistory: { time: string; day: number; value: number }[];
  humidityHistory: { time: string; day: number; value: number }[];
}

export default function TemperatureHumidityChart({ tempHistory, humidityHistory }: TemperatureHumidityChartProps) {
  const chartData = useMemo(() => {
    return tempHistory.map((item, index) => ({
      time: item.time,       // Full datetime for tooltip
      day: item.day,         // Day number for X axis
      temperature: item.value,
      humidity: humidityHistory[index]?.value || 0,
    }));
  }, [tempHistory, humidityHistory]);

  return (
    <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.2)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-orange-300 mb-1">🌡️ Nhiệt độ & Độ ẩm theo thời gian</h3>
          <p className="text-gray-400 text-sm">Theo dõi sự thay đổi môi trường</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <YAxis yAxisId="left" stroke="#FF6B35" style={{ fontSize: "12px" }} label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#4ECDC4" style={{ fontSize: "12px" }} label={{ value: '%', angle: 90, position: 'insideRight' }} />
          <Tooltip
            labelFormatter={(value, payload) => {
              if (payload && payload.length > 0 && payload[0].payload) {
                return payload[0].payload.time;
              }
              return value;
            }}
            contentStyle={{
              backgroundColor: "#280E0A",
              border: "1px solid #991b1b",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#fbbf24" }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            stroke="#FF6B35"
            strokeWidth={3}
            dot={false}
            name="Nhiệt độ (°C)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="humidity"
            stroke="#4ECDC4"
            strokeWidth={3}
            dot={false}
            name="Độ ẩm (%)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Info */}
      <div className="flex gap-4 mt-4 text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#FF6B35] rounded"></div>
          <span className="text-gray-400">Nhiệt độ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#4ECDC4] rounded"></div>
          <span className="text-gray-400">Độ ẩm</span>
        </div>
      </div>
    </div>
  );
}
