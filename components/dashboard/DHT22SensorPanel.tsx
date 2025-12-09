"use client";

import { Thermometer, Droplets, TrendingUp, TrendingDown } from "lucide-react";

interface DHT22SensorPanelProps {
  temperature: number;
  humidity: number;
  tempHistory: { time: string; day: number; value: number }[];
  humidityHistory: { time: string; day: number; value: number }[];
}

export default function DHT22SensorPanel({ temperature, humidity, tempHistory, humidityHistory }: DHT22SensorPanelProps) {
  // Calculate trends
  const tempTrend = tempHistory.length > 1 
    ? temperature - tempHistory[tempHistory.length - 2].value 
    : 0;
  const humidityTrend = humidityHistory.length > 1 
    ? humidity - humidityHistory[humidityHistory.length - 2].value 
    : 0;

  const getTempStatus = () => {
    if (temperature > 45) return { color: "text-blue-400", bg: "bg-blue-950/40", border: "border-red-700/40", label: "🔴 Quá nóng" };
    if (temperature >= 35) return { color: "text-yellow-400", bg: "bg-yellow-950/40", border: "border-yellow-700/40", label: "🟡 Nóng" };
    if (temperature >= 25) return { color: "text-green-400", bg: "bg-green-950/40", border: "border-green-700/40", label: "🟢 Bình thường" };
    return { color: "text-blue-400", bg: "bg-blue-950/40", border: "border-blue-700/40", label: "🔵 Mát" };
  };

  const getHumidityStatus = () => {
    if (humidity < 25) return { color: "text-blue-400", bg: "bg-blue-950/40", border: "border-red-700/40", label: "🔴 Quá khô" };
    if (humidity < 40) return { color: "text-yellow-400", bg: "bg-yellow-950/40", border: "border-yellow-700/40", label: "🟡 Khô" };
    if (humidity <= 70) return { color: "text-green-400", bg: "bg-green-950/40", border: "border-green-700/40", label: "🟢 Bình thường" };
    return { color: "text-blue-400", bg: "bg-blue-950/40", border: "border-blue-700/40", label: "🔵 Ẩm" };
  };

  const tempStatus = getTempStatus();
  const humidityStatus = getHumidityStatus();

  return (
    <div className="bg-[#152A45]/80 backdrop-blur-sm border border-blue-700/40 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.2)]">
      <h3 className="text-xl font-bold text-sky-300 mb-6">🌡️ Cảm biến DHT22</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Temperature Card */}
        <div className={`${tempStatus.bg} ${tempStatus.border} border rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Thermometer className={tempStatus.color} size={32} />
              <div>
                <p className="text-gray-400 text-sm">Nhiệt độ môi trường</p>
                <p className={`text-3xl font-bold ${tempStatus.color}`}>{temperature.toFixed(1)}°C</p>
              </div>
            </div>
            {tempTrend !== 0 && (
              <div className={`flex items-center gap-1 ${tempTrend > 0 ? 'text-blue-400' : 'text-blue-400'}`}>
                {tempTrend > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span className="text-sm">{Math.abs(tempTrend).toFixed(1)}°</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className={`font-semibold ${tempStatus.color}`}>{tempStatus.label}</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• &lt; 35°C: Bình thường</p>
              <p>• 35-45°C: Nóng, cần theo dõi</p>
              <p>• &gt; 45°C: Quá nóng, nguy hiểm</p>
            </div>
          </div>
        </div>

        {/* Humidity Card */}
        <div className={`${humidityStatus.bg} ${humidityStatus.border} border rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Droplets className={humidityStatus.color} size={32} />
              <div>
                <p className="text-gray-400 text-sm">Độ ẩm môi trường</p>
                <p className={`text-3xl font-bold ${humidityStatus.color}`}>{humidity.toFixed(1)}%</p>
              </div>
            </div>
            {humidityTrend !== 0 && (
              <div className={`flex items-center gap-1 ${humidityTrend > 0 ? 'text-blue-400' : 'text-blue-400'}`}>
                {humidityTrend > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span className="text-sm">{Math.abs(humidityTrend).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className={`font-semibold ${humidityStatus.color}`}>{humidityStatus.label}</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• &gt; 40%: Bình thường</p>
              <p>• 25-40%: Khô, có thể gây cháy</p>
              <p>• &lt; 25%: Quá khô, nguy hiểm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-blue-900/20">
        <p className="text-gray-400 text-sm">
          💡 <strong>Lưu ý:</strong> DHT22 đo nhiệt độ và độ ẩm môi trường. Môi trường quá nóng hoặc quá khô có thể tăng nguy cơ cháy nổ.
        </p>
      </div>
    </div>
  );
}
