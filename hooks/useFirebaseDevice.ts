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
    firebase: true,
    gasHistory: [],
    tempHistory: [],
    humidityHistory: [],
    lastDHT22Update: Date.now(),
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
        };
      });
    });

    // ----- CONTROL -----
    const unsub2 = onValue(controlRef, (snap) => {
      const val = snap.val();
      if (!val) return;

      setData((prev) => ({
        ...prev,
        relay1: val.relay1 ?? false,
        relay2: val.relay2 ?? false,
      }));
    });

    // ----- SETTINGS -----
    const unsub3 = onValue(settingsRef, (snap) => {
      const val = snap.val();
      if (!val) return;

      setData((prev) => ({
        ...prev,
        threshold: val.threshold ?? 4000,
        autoManual: val.mode ? "AUTO" : "MANUAL",
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

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, []);

  return [data, setData] as const;
}
