"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import { DeviceState } from "@/types/device";

export function useFirebaseDevice() {
  const [data, setData] = useState<DeviceState>({
    gas: 0,
    fire: false,
    relay1: false,
    relay2: false,
    buzzer: false,
    autoManual: "AUTO",
    threshold: 4000,
    firebase: true,
    gasHistory: [],
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

      const timeStr = new Date().toLocaleTimeString().slice(3, 8);

      setData((prev) => {
        let history = [...prev.gasHistory, { time: timeStr, value: gas }];
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

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  return [data, setData] as const;
}
