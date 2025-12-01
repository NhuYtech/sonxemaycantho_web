"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import { DeviceState } from "@/types/device";

export function useFirebaseDevice() {
  const [data, setData] = useState<DeviceState>({
    gas: 0,
    fire: false,
    temperature: 0,
    humidity: 0,
    relay1: false,
    relay2: false,
    buzzer: false,
    autoManual: "AUTO",
    threshold: 4000,
    firebase: false,
    gasHistory: [],
    tempHistory: [],
    humidityHistory: [],
    lastUpdate: 0,
    lastDHT22Update: 0,
  });

  useEffect(() => {
    // ----- SENSOR -----
    const sensorRef = ref(db, "/sensor");
    const controlRef = ref(db, "/control");
    const settingsRef = ref(db, "/settings");

    const unsub1 = onValue(sensorRef, (snap) => {
      const val = snap.val();
      if (!val) return;

      const gas = val.mq2 ?? 0;
      const fire = val.fire === 1;

      const now = new Date();
      const timeStr = now.toLocaleString("vi-VN");
      const day = now.getDate();

      setData((prev) => {
        let history = [...prev.gasHistory, { time: timeStr, day, value: gas }];
        if (history.length > 20) history.shift();

        return {
          ...prev,
          gas,
          fire,
          gasHistory: history,
          lastUpdate: Date.now(),
          firebase: true,
        };
      });
    });

    // ----- CONTROL -----
    const unsub2 = onValue(controlRef, (snap) => {
      const val = snap.val();
      if (!val) return;

      setData((prev) => ({
        ...prev,
        relay1: val.relay1 === 1, // Convert 1/0 to boolean
        relay2: val.relay2 === 1, // Convert 1/0 to boolean
        buzzer: val.buzzer === 1, // Convert 1/0 to boolean
      }));
    });

    // ----- SETTINGS -----
    const unsub3 = onValue(settingsRef, (snap) => {
      const val = snap.val();
      if (!val) return;

      setData((prev) => ({
        ...prev,
        threshold: val.threshold ?? 4000,
        autoManual: val.mode === 1 ? "AUTO" : "MANUAL", // 1 = AUTO, 0 = MANUAL
      }));
    });

    // ----- DHT22 SENSOR -----
    const dht22Ref = ref(db, "/sensor/dht22");
    const unsub4 = onValue(dht22Ref, (snap) => {
      const val = snap.val();
      if (!val) return;

      const temperature = val.temp ?? 0;
      const humidity = val.humidity ?? 0;
      
      const now = new Date();
      const timeStr = now.toLocaleString("vi-VN");
      const day = now.getDate();

      setData((prev) => {
        let tempHistory = [...prev.tempHistory, { time: timeStr, day, value: temperature }];
        if (tempHistory.length > 20) tempHistory.shift();

        let humidityHistory = [...prev.humidityHistory, { time: timeStr, day, value: humidity }];
        if (humidityHistory.length > 20) humidityHistory.shift();

        return {
          ...prev,
          temperature,
          humidity,
          tempHistory,
          humidityHistory,
          lastDHT22Update: Date.now(),
        };
      });
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

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      clearInterval(checkOffline);
    };
  }, []);

  return [data, setData] as const;
}
