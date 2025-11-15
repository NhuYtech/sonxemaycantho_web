"use client";
import { useState, useEffect } from "react";
import { DeviceState } from "@/types/device";

export function useMockedDevice() {
  const [data, setData] = useState<DeviceState>({
    gas: 320,
    fire: false,
    relay1: false,
    relay2: false,
    window: false,
    buzzer: false,
    autoManual: "AUTO",
    threshold: 400,
    wifi: true,
    blynk: true,
    firebase: true,
    gasHistory: [],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString().slice(3, 8);

      const newGas = Math.max(
        0,
        Math.round(data.gas + (Math.random() - 0.5) * 40)
      );
      const newFire = Math.random() > 0.97;

      setData((prev: DeviceState) => {
        let gasHistory = [...prev.gasHistory, { time: timeStr, value: newGas }];
        if (gasHistory.length > 20) gasHistory.shift();

        return {
          ...prev,
          gas: newGas,
          fire: newFire,
          gasHistory,
        };
      });
    }, 1600);

    return () => clearInterval(timer);
  }, []); // ✔ Chỉ chạy 1 lần

  return [data, setData] as const;
}
