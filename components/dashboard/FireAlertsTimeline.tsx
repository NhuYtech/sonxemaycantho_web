"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface FireAlertsTimelineProps {
  history: { time: string; value: number }[];
  threshold: number;
}

export default function FireAlertsTimeline({ history, threshold }: FireAlertsTimelineProps) {
  const chartData = useMemo(() => {
    return history.map((item) => ({
      time: item.time,
      gas: item.value,
      alert: item.value > threshold ? 1 : 0,
    }));
  }, [history, threshold]);

  return (
    <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.2)]">
      <div>
        <h3 className="text-xl font-bold text-orange-300 mb-1">Dòng thời gian cảnh báo</h3>
        <p className="text-gray-400 text-sm mb-6">Theo dõi các sự kiện cảnh báo theo thời gian</p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <YAxis yAxisId="right" orientation="right" stroke="#ef4444" style={{ fontSize: "12px" }} domain={[0, 1]} />
          <Tooltip
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
