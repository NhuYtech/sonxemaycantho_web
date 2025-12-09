"use client";

import { useEffect, useRef, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { ref, push, get } from "firebase/database";
import { DeviceState } from "@/types/device";
import { useToast } from "@/contexts/ToastContext";

/**
 * Hook tự động ghi log khi có sự kiện quan trọng
 * Sẽ ghi vào /logs với timestamp chi tiết
 * VÀ hiển thị toast notifications dựa trên settings
 */
export function useAutoLogger(state: DeviceState) {
  const toast = useToast();
  const lastGasWarning = useRef<number>(0);
  const lastFireDetected = useRef<number>(0);
  const lastConnectionChange = useRef<boolean | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    gasHigh: true,
    fire: true,
    systemOffline: true,
  });

  // Load notification settings from Firebase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsRef = ref(db, "/logsSettings/notifications");
        const snapshot = await get(settingsRef);
        if (snapshot.exists()) {
          setNotificationSettings(snapshot.val());
        }
      } catch (error) {
        console.error("Error loading notification settings:", error);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const now = Date.now();
    const user = auth.currentUser;

    // 1. Ghi log và thông báo khi phát hiện cháy
    if (state.fire && now - lastFireDetected.current > 60000) { // Mỗi 1 phút
      lastFireDetected.current = now;
      
      const logsRef = ref(db, "/logs");
      push(logsRef, {
        timestamp: now,
        type: "fire_detected",
        gas: state.gas,
        fire: true,
        temperature: state.temperature,
        humidity: state.humidity,
        threshold: state.threshold,
        user: user?.email || "system",
        note: `🔥 Phát hiện lửa! Gas: ${state.gas}ppm, Nhiệt độ: ${state.temperature}°C`,
      });

      // 🔔 Hiển thị toast notification nếu được bật
      if (notificationSettings.fire) {
        toast.error(`🔥 CẢNH BÁO CHÁY! Phát hiện nguồn nhiệt bất thường. Gas: ${state.gas}ppm`);
      }
    }

    // 2. Ghi log và thông báo khi gas vượt ngưỡng
    if (state.gas > state.threshold && now - lastGasWarning.current > 300000) { // Mỗi 5 phút
      lastGasWarning.current = now;
      
      const logsRef = ref(db, "/logs");
      push(logsRef, {
        timestamp: now,
        type: "gas_warning",
        gas: state.gas,
        fire: state.fire,
        temperature: state.temperature,
        humidity: state.humidity,
        threshold: state.threshold,
        user: user?.email || "system",
        note: `⚠️ Gas vượt ngưỡng! ${state.gas}ppm > ${state.threshold}ppm`,
      });

      // 🔔 Hiển thị toast notification nếu được bật
      if (notificationSettings.gasHigh) {
        toast.warning(`⚠️ CẢNH BÁO GAS CAO! Nồng độ: ${state.gas}ppm (Ngưỡng: ${state.threshold}ppm)`);
      }
    }

    // 3. Ghi log và thông báo khi mất/khôi phục kết nối
    if (lastConnectionChange.current !== null && lastConnectionChange.current !== state.firebase) {
      const logsRef = ref(db, "/logs");
      push(logsRef, {
        timestamp: now,
        type: "system_event",
        gas: state.gas,
        fire: state.fire,
        temperature: state.temperature,
        humidity: state.humidity,
        threshold: state.threshold,
        user: "system",
        note: state.firebase 
          ? "✅ Khôi phục kết nối Firebase" 
          : "❌ Mất kết nối Firebase",
      });

      // 🔔 Hiển thị toast notification nếu được bật
      if (notificationSettings.systemOffline) {
        if (state.firebase) {
          toast.success("✅ ESP32 đã khôi phục kết nối!");
        } else {
          toast.error("❌ HỆ THỐNG MẤT KẾT NỐI! ESP32 offline.");
        }
      }
    }
    lastConnectionChange.current = state.firebase;

    // 4. Ghi log khi nhiệt độ quá cao (không toast để tránh spam)
    if (state.temperature > 45 && now - lastGasWarning.current > 300000) {
      const logsRef = ref(db, "/logs");
      push(logsRef, {
        timestamp: now,
        type: "gas_warning",
        gas: state.gas,
        fire: state.fire,
        temperature: state.temperature,
        humidity: state.humidity,
        threshold: state.threshold,
        user: "system",
        note: `🌡️ Nhiệt độ cao bất thường: ${state.temperature}°C`,
      });
    }

    // 5. Ghi log khi độ ẩm quá thấp (không toast để tránh spam)
    if (state.humidity < 25 && now - lastGasWarning.current > 300000) {
      const logsRef = ref(db, "/logs");
      push(logsRef, {
        timestamp: now,
        type: "system_event",
        gas: state.gas,
        fire: state.fire,
        temperature: state.temperature,
        humidity: state.humidity,
        threshold: state.threshold,
        user: "system",
        note: `💧 Độ ẩm thấp: ${state.humidity}%`,
      });
    }

  }, [state.fire, state.gas, state.threshold, state.firebase, state.temperature, state.humidity, notificationSettings, toast]);
}
