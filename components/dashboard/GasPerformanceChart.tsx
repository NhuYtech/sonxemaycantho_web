/**
 * 🔥 GasPerformanceChart - Biểu đồ Gas Realtime với Firebase
 * 
 * ✨ Tính năng:
 * - 🔴 Realtime: Lắng nghe Firebase .snapshots() tự động cập nhật
 * - 💾 Lưu dồn: ESP32 append dữ liệu vào /history/{date} mỗi 1 phút
 * - 🧹 Tối ưu: Chỉ giữ 24 giờ gần nhất, không tràn bộ nhớ
 * - 📊 Chart đẹp: Recharts với line smoothing + gradient
 * 
 * @see README_GAS_CHART.md - Chi tiết cách hoạt động
 * @see ESP32_FIREBASE_GUIDE.md - Hướng dẫn code ESP32
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { db } from "@/lib/firebase";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";

interface GasPerformanceChartProps {
  history: {
    hour: number; time: string; day: number; value: number 
}[];
  threshold: number;
  mode: "day" | "week" | "month";
}

export default function GasPerformanceChart({ history, threshold, mode }: GasPerformanceChartProps) {
  // 🔥 REALTIME: Lắng nghe dữ liệu trực tiếp từ Firebase - APPEND ONLY
  const [realtimeData, setRealtimeData] = useState<Array<{
    gas: number;
    temp: number;
    humi: number;
    timestamp: number;
    hour?: number;
    key?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastTimestamp, setLastTimestamp] = useState<number>(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const historyRef = ref(db, `/history/${today}`);
    
    // 📊 Lấy tất cả dữ liệu hôm nay
    const historyQuery = query(historyRef, orderByChild('timestamp'));

    const unsubscribe = onValue(historyQuery, (snapshot) => {
      const val = snapshot.val();
      setIsLoading(false);
      
      if (!val) {
        setRealtimeData([]);
        return;
      }

      // 🚀 APPEND STRATEGY: Chỉ thêm dữ liệu mới, không xóa cũ
      const newData: Array<{
        gas: number;
        temp: number;
        humi: number;
        timestamp: number;
        hour?: number;
        key: string;
      }> = [];

      Object.entries(val).forEach(([key, value]: [string, any]) => {
        // Chỉ thêm dữ liệu mới hơn lastTimestamp
        if (value.timestamp > lastTimestamp) {
          newData.push({
            gas: value.gas,
            temp: value.temp,
            humi: value.humi,
            timestamp: value.timestamp,
            hour: value.hour,
            key: key
          });
        }
      });

      if (newData.length > 0) {
        // Sort theo thời gian
        newData.sort((a, b) => a.timestamp - b.timestamp);

        // 🔥 APPEND: Thêm dữ liệu mới vào cuối array
        setRealtimeData(prev => {
          const combined = [...prev, ...newData];
          
          // 🕒 Chỉ giữ 24 giờ gần nhất
          const now = Date.now();
          const last24Hours = combined.filter(item => {
            return (now - item.timestamp) <= 24 * 60 * 60 * 1000;
          });

          return last24Hours;
        });

        // Cập nhật timestamp cuối cùng
        setLastTimestamp(newData[newData.length - 1].timestamp);
        
        console.log(`✅ Appended ${newData.length} new data points`);
      } else if (lastTimestamp === 0) {
        // Lần đầu load: lấy tất cả dữ liệu
        const allData = Object.entries(val).map(([key, value]: [string, any]) => ({
          gas: value.gas,
          temp: value.temp,
          humi: value.humi,
          timestamp: value.timestamp,
          hour: value.hour,
          key: key
        }));

        allData.sort((a, b) => a.timestamp - b.timestamp);

        // Lọc 24 giờ gần nhất
        const now = Date.now();
        const last24Hours = allData.filter(item => {
          return (now - item.timestamp) <= 24 * 60 * 60 * 1000;
        });

        setRealtimeData(last24Hours);
        
        if (last24Hours.length > 0) {
          setLastTimestamp(last24Hours[last24Hours.length - 1].timestamp);
        }

        console.log(`📊 Loaded ${last24Hours.length} initial data points`);
      }
    }, (error) => {
      console.error("❌ Firebase realtime error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [lastTimestamp]);

  // 📈 Xử lý dữ liệu cho biểu đồ - KHÔNG GROUP, vẽ tất cả điểm để realtime mượt
  const chartData = useMemo(() => {
    if (realtimeData.length === 0) return [];
    
    // 🚀 Vẽ TẤT CẢ điểm dữ liệu, không group theo giờ
    // Điều này tạo chart mượt mà như biểu đồ chứng khoán
    const data = realtimeData.map((item, index) => {
      const date = new Date(item.timestamp);
      const hour = date.getHours();
      const minute = date.getMinutes();
      
      return {
        time: date.toLocaleString("vi-VN", { 
          day: '2-digit', 
          month: '2-digit',
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        hour: hour,
        minute: minute,
        day: date.getDate(),
        index: index,
        label: `${hour}:${minute.toString().padStart(2, '0')}`,
        gas: item.gas,
        timestamp: item.timestamp,
        isWarning: item.gas > threshold ? 1 : 0,
      };
    });

    // Giữ tối đa 1440 điểm (24 giờ × 60 phút)
    return data.slice(-1440);
  }, [realtimeData, threshold]);

  // Calculate stats
  const stats = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 0, avg: 0, current: 0 };
    const values = chartData.map(d => d.gas);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      current: values[values.length - 1]
    };
  }, [chartData]);

  // Check if there's no data
  const hasData = chartData.length > 0;

  return (
    <div className="bg-[#071933]/70 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6 shadow-[0_0_30px_rgba(255,100,60,0.2)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-sky-300 mb-1 flex items-center gap-2">
            📊 Diễn biến mức khí Gas (24 giờ)
            {!isLoading && hasData && (
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full animate-pulse">
                🔴 LIVE
              </span>
            )}
          </h3>
          <p className="text-gray-400 text-sm">Cảm biến MQ-2 - Realtime từ Firebase | Cập nhật mỗi phút</p>
        </div>
        {hasData && (
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-400 text-xs">Hiện tại</p>
              <p className="text-sky-300 font-bold">{stats.current} ppm</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs">Trung bình</p>
              <p className="text-blue-300 font-bold">{stats.avg} ppm</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs">Cao nhất</p>
              <p className="text-red-300 font-bold">{stats.max} ppm</p>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-2">⏳</div>
            <p className="text-lg mb-2">Đang tải dữ liệu realtime...</p>
            <p className="text-sm">Kết nối Firebase...</p>
          </div>
        </div>
      ) : !hasData ? (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">📊 Chưa có dữ liệu 24 giờ</p>
            <p className="text-sm">ESP32 sẽ tự động ghi dữ liệu vào Firebase mỗi phút</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <defs>
              {/* Gradient cho đường line */}
              <linearGradient id="gasGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6"/>
                <stop offset="50%" stopColor="#fb923c"/>
                <stop offset="100%" stopColor="#ef4444"/>
              </linearGradient>
            </defs>
            
            {/* Grid nền như hình mẫu */}
            <defs>
              <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.3" opacity="0.3"/>
              </pattern>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <rect width="50" height="50" fill="url(#smallGrid)"/>
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            <XAxis 
              dataKey="index" 
              stroke="#4b5563" 
              style={{ fontSize: "12px" }}
              tick={{ fill: '#9ca3af' }}
              tickLine={false}
              axisLine={{ stroke: '#4b5563', strokeWidth: 1 }}
              tickFormatter={(value) => {
                const item = chartData[value];
                if (!item) return '';
                // Hiển thị giờ mỗi 60 điểm (mỗi giờ)
                if (value % 60 === 0 || value === chartData.length - 1) {
                  return `${item.hour}h`;
                }
                return '';
              }}
              interval="preserveStartEnd"
            />
            
            <YAxis 
              stroke="transparent"
              style={{ fontSize: "12px" }}
              tick={{ fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded px-3 py-2 shadow-xl">
                    <p className="text-gray-300 text-xs font-medium mb-1">
                      {data.time}
                    </p>
                    <p className="text-sky-400 font-bold">
                      Gas: <span className="text-white">{data.gas}</span> ppm
                    </p>
                  </div>
                );
              }}
              cursor={false}
            />
            
            {/* Đường line chính - realtime smooth như biểu đồ chứng khoán */}
            <Line
              type="monotone"
              dataKey="gas"
              stroke="url(#gasGradient)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: '#fb923c', 
                stroke: '#fff', 
                strokeWidth: 2.5
              }}
              animationDuration={200}
              animationEasing="linear"
              connectNulls
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Legend & Info */}
      <div className="flex flex-wrap gap-6 mt-4 text-xs justify-between items-center border-t border-blue-900/20 pt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-linear-to-r from-blue-500 via-orange-400 to-red-500 rounded-full"></div>
            <span className="text-gray-400">Nồng độ Gas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-red-500 border-dashed"></div>
            <span className="text-gray-400">Ngưỡng cảnh báo</span>
          </div>
        </div>
        {hasData && (
          <div className="text-gray-400 text-xs flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            📊 {chartData.length} điểm dữ liệu | 💾 {realtimeData.length} records | 🔄 Realtime Append
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-blue-300 text-xs">
          💡 <strong>Tính năng:</strong> Biểu đồ tự động cập nhật realtime từ Firebase • 
          Chỉ hiển thị 24 giờ gần nhất • 
          ESP32 tự động lưu dữ liệu mỗi phút vào <code className="bg-black/30 px-1 rounded">/history/&#123;date&#125;</code>
        </p>
      </div>
    </div>
  );
}
