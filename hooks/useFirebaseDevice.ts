"use client";

import { useEffect, useState, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import { onValue, ref, push, set, query, orderByChild, limitToLast } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { DeviceState } from "@/types/device";

export function useFirebaseDevice() {
  const [data, setData] = useState<DeviceState>({
    gas: 0,
    fire: false,
    temperature: 0,
    humidity: 0,
    threshold: 400,
    firebase: false,
    gasHistory: [],
    tempHistory: [],
    humidityHistory: [],
    lastUpdate: 0,
    lastDHT22Update: 0,
  });

  const lastSaveTime = useRef<number>(0);
  const lastHourAdded = useRef<string>("");
  const SAVE_INTERVAL = 60000; // Save to Firebase every 1 minute (tối ưu cho realtime)

  useEffect(() => {
    // 🔐 Wait for authentication before accessing Firebase
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("⚠️ User not authenticated, skipping Firebase listeners");
        return;
      }

      console.log("✅ User authenticated, setting up Firebase listeners");

      // ----- LOAD HISTORY FROM FIREBASE (CHỈ 24 GIỜ GẦN NHẤT) -----
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const historyRef = ref(db, `/history/${today}`);
      
      // 💾 Chỉ lấy 1440 bản ghi gần nhất (24 giờ × 60 phút)
      const historyQuery = query(historyRef, orderByChild('timestamp'), limitToLast(1440));

      const unsubHistory = onValue(
        historyQuery, 
        (snap) => {
      const val = snap.val();
      if (!val) return;

      const historyArray = Object.values(val) as Array<{
        gas: number;
        temp?: number;
        temperature?: number;
        humi?: number;
        humidity?: number;
        timestamp: number;
        hour?: number;
      }>;

      // 🕒 Lọc chỉ giữ dữ liệu 24 giờ gần nhất
      const now = Date.now();
      const last24Hours = historyArray.filter(item => {
        return (now - item.timestamp) <= 24 * 60 * 60 * 1000;
      });

      // Group by hour - take average for each hour
      const hourlyData = new Map<string, { gas: number[], temp: number[], humi: number[], timestamp: number }>();
      
      last24Hours.forEach(item => {
        const date = new Date(item.timestamp);
        const hourKey = `${date.getDate()}-${date.getHours()}`;
        
        if (!hourlyData.has(hourKey)) {
          hourlyData.set(hourKey, { gas: [], temp: [], humi: [], timestamp: item.timestamp });
        }
        
        const data = hourlyData.get(hourKey)!;
        const temp = item.temperature ?? item.temp ?? 0;
        const humi = item.humidity ?? item.humi ?? 0;
        
        // Chỉ thêm nếu giá trị hợp lệ (không phải -1)
        if (temp !== -1 && temp !== 0) data.temp.push(temp);
        if (humi !== -1 && humi !== 0) data.humi.push(humi);
        data.gas.push(item.gas);
      });

      // Calculate average for each hour
      const gasHistory = Array.from(hourlyData.entries()).map(([key, data]) => {
        const avgGas = data.gas.length > 0 
          ? Math.round(data.gas.reduce((a, b) => a + b, 0) / data.gas.length)
          : 0;
        const date = new Date(data.timestamp);
        return {
          time: date.toLocaleString("vi-VN"),
          day: date.getDate(),
          hour: date.getHours(),
          value: avgGas
        };
      }).sort((a, b) => a.day * 24 + a.hour - b.day * 24 - b.hour);

      const tempHistory = Array.from(hourlyData.entries())
        .filter(([, data]) => data.temp.length > 0)
        .map(([key, data]) => {
          const avgTemp = Math.round(data.temp.reduce((a, b) => a + b, 0) / data.temp.length);
          const date = new Date(data.timestamp);
          return {
            time: date.toLocaleString("vi-VN"),
            day: date.getDate(),
            hour: date.getHours(),
            value: avgTemp
          };
        }).sort((a, b) => a.day * 24 + a.hour - b.day * 24 - b.hour);

      const humidityHistory = Array.from(hourlyData.entries())
        .filter(([, data]) => data.humi.length > 0)
        .map(([key, data]) => {
          const avgHumi = Math.round(data.humi.reduce((a, b) => a + b, 0) / data.humi.length);
          const date = new Date(data.timestamp);
          return {
            time: date.toLocaleString("vi-VN"),
            day: date.getDate(),
            hour: date.getHours(),
            value: avgHumi
          };
        }).sort((a, b) => a.day * 24 + a.hour - b.day * 24 - b.hour);

      setData((prev) => ({
        ...prev,
        gasHistory: gasHistory,
        tempHistory: tempHistory,
        humidityHistory: humidityHistory,
      }));
        },
        (error) => {
          console.warn("⚠️ Không thể tải lịch sử dữ liệu:", error.message);
          console.info("ℹ️ Ứng dụng sẽ tiếp tục hoạt động với dữ liệu realtime. Kiểm tra Firebase Rules nếu cần xem lịch sử.");
          // Continue without history data if permission denied - app will still work with realtime data
          setData((prev) => ({
            ...prev,
            gasHistory: [],
            tempHistory: [],
            humidityHistory: [],
          }));
        }
      );

      // ----- SENSOR -----
      const sensorRef = ref(db, "/sensor");
      const settingsRef = ref(db, "/settings");

      const unsub1 = onValue(sensorRef, (snap) => {
      const val = snap.val();
      if (!val) return;

      const gas = val.mq2 ?? 0;
      const fire = val.fire === 1; // fire=1 means fire detected, fire=0 means normal
      // Ưu tiên đọc temperature/humidity, fallback về temp/humi nếu không có hoặc = -1
      let temperature = val.temperature ?? val.temp ?? 0;
      let humidity = val.humidity ?? val.humi ?? 0;
      
      // Xử lý giá trị -1 (sensor lỗi)
      if (temperature === -1) temperature = val.temp ?? 0;
      if (humidity === -1) humidity = val.humi ?? 0;
      if (temperature === -1) temperature = 0;
      if (humidity === -1) humidity = 0;

      const now = new Date();
      const timeStr = now.toLocaleString("vi-VN");
      const hour = now.getHours();
      const day = now.getDate();
      const timestamp = Date.now();
      const hourKey = `${day}-${hour}`; // Unique key per hour

      // 💾 APPEND dữ liệu vào Firebase mỗi 1 phút (tối ưu cho realtime)
      if (timestamp - lastSaveTime.current > SAVE_INTERVAL) {
        const today = new Date().toISOString().split('T')[0];
        const historyRef = ref(db, `/history/${today}`);
        const newEntryRef = push(historyRef);
        
        set(newEntryRef, {
          gas,
          temp: temperature,
          temperature: temperature,
          humi: humidity,
          humidity: humidity,
          fire,
          timestamp,
          hour
        }).catch(err => console.error("❌ Failed to save history:", err));

        // 📝 GHI LOG ĐỊNH KỲ - Để Nhật ký có dữ liệu liên tục
        const logsRef = ref(db, "/logs");
        push(logsRef, {
          timestamp,
          type: fire ? "fire_detected" : (gas > (data.threshold || 400) ? "gas_warning" : "system_event"),
          gas,
          fire,
          temperature,
          humidity,
          threshold: data.threshold || 400,
          user: "system",
          note: fire 
            ? `🔥 Phát hiện lửa! Gas: ${gas}ppm, Nhiệt độ: ${temperature}°C`
            : gas > (data.threshold || 400)
            ? `⚠️ Gas vượt ngưỡng! ${gas}ppm > ${data.threshold || 400}ppm`
            : `📊 Dữ liệu định kỳ: Gas ${gas}ppm, Nhiệt độ ${temperature}°C, Độ ẩm ${humidity}%`,
        }).catch(err => console.error("❌ Failed to save log:", err));

        lastSaveTime.current = timestamp;
        console.log("✅ Saved to Firebase:", { gas, temp: temperature, humi: humidity, timestamp });
      }

      setData((prev) => {
        // Add data point only once per hour
        const shouldAddNewPoint = lastHourAdded.current !== hourKey;
        
        let history = prev.gasHistory;
        let tempHistory = prev.tempHistory;
        let humidityHistory = prev.humidityHistory;
        
        if (shouldAddNewPoint) {
          history = [...prev.gasHistory, { time: timeStr, day, value: gas, hour }];
          tempHistory = [...prev.tempHistory, { time: timeStr, day, value: temperature, hour }];
          humidityHistory = [...prev.humidityHistory, { time: timeStr, day, value: humidity, hour }];
          
          lastHourAdded.current = hourKey;
          
          // Keep max 72 points (3 days * 24 hours)
          if (history.length > 72) history = history.slice(-72);
          if (tempHistory.length > 72) tempHistory = tempHistory.slice(-72);
          if (humidityHistory.length > 72) humidityHistory = humidityHistory.slice(-72);
        }

        return {
          ...prev,
          gas,
          fire,
          temperature,
          humidity,
          gasHistory: history,
          tempHistory,
          humidityHistory,
          lastUpdate: Date.now(),
          lastDHT22Update: Date.now(),
          firebase: true,
        };
      });
    });

    // ----- SETTINGS -----
    const unsub2 = onValue(settingsRef, (snap) => {
      const val = snap.val();
      if (!val) return;

      setData((prev) => ({
        ...prev,
        threshold: val.threshold ?? 400,
      }));
    });

      // ----- CHECK OFFLINE STATUS -----
      const checkOffline = setInterval(() => {
        const now = Date.now();
        setData((prev) => {
          const isOffline = now - prev.lastUpdate > 30000; // 30 seconds timeout
          if (isOffline && prev.firebase) {
            return { ...prev, firebase: false };
          }
          return prev;
        });
      }, 5000); // Check every 5 seconds

      // Cleanup function for this auth session
      return () => {
        unsubHistory();
        unsub1();
        unsub2();
        clearInterval(checkOffline);
      };
    });

    // Cleanup auth listener on component unmount
    return () => {
      authUnsubscribe();
    };
  }, []);

  return [data, setData] as const;
}
