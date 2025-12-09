"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface FireAlertsTimelineProps {
  history: { time: string; day: number; value: number }[];
  threshold: number;
  tempHistory?: { time: string; day: number; value: number }[];
  humidityHistory?: { time: string; day: number; value: number }[];
}

export default function FireAlertsTimeline({ history, threshold, tempHistory = [], humidityHistory = [] }: FireAlertsTimelineProps) {
  const chartData = useMemo(() => {
    return history.map((item, index) => ({
      time: item.time,       // Full datetime for tooltip
      day: item.day,         // Day number for X axis
      gas: item.value,
      alert: item.value > threshold ? 1 : 0,
      temp: tempHistory[index]?.value || 0,
      humidity: humidityHistory[index]?.value || 0,
    }));
  }, [history, threshold, tempHistory, humidityHistory]);

  return (
    <div className="bg-[#152A45]/80 backdrop-blur-sm border border-blue-700/40 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.2)]">
      <div>
        <h3 className="text-xl font-bold text-sky-300 mb-1">📌 Nhật ký sự cố theo thời gian</h3>
        <p className="text-gray-400 text-sm mb-6">Gồm phát hiện nguồn sáng, gas tăng, thiết bị kích hoạt...</p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <YAxis yAxisId="right" orientation="right" stroke="#ef4444" style={{ fontSize: "12px" }} domain={[0, 1]} />
          <Tooltip
            labelFormatter={(value, payload) => {
              if (payload && payload.length > 0 && payload[0].payload) {
                return payload[0].payload.time;
              }
              return value;
            }}
            contentStyle={{
              backgroundColor: "#152A45",
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
            dataKey="gas"
            stroke="#FFA83D"
            strokeWidth={3}
            dot={false}
            name="Gas (ppm)"
          />
          <Line
            yAxisId="right"
            type="stepAfter"
            dataKey="alert"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Cảnh báo"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
