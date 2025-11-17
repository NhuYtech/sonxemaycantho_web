"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function GasChart({
  history,
  threshold,
}: {
  history: { time: string; value: number }[];
  threshold: number;
}) {
  return (
    <div className="bg-[#1A0A00]/80 backdrop-blur-md rounded-xl shadow-[0_0_30px_rgba(255,60,60,0.3)] mt-6 p-6 border border-red-700/30">
      <div className="font-bold text-lg mb-4 text-gray-200">Biểu đồ khí gas realtime (MQ2)</div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={history}>
          <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A0A00",
              border: "1px solid #991b1b",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} dot={false} />

          {history.map((pt, i) =>
            pt.value > threshold ? (
              <ReferenceLine
                key={i}
                x={pt.time}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="3 3"
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
