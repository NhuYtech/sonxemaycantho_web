"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import { LogEvent } from "@/types/logs";

export function useFirebaseLogs() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logsRef = ref(db, "/logs");

    const unsubscribe = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setLogs([]);
        setLoading(false);
        return;
      }

      // Convert object to array and sort by timestamp (newest first)
      const logsArray: LogEvent[] = Object.entries(data).map(([id, value]: [string, any]) => ({
        id,
        timestamp: value.timestamp || Date.now(),
        type: value.type || "user_action",
        gas: value.gas || 0,
        fire: value.fire || false,
        temperature: value.temperature || 0,
        humidity: value.humidity || 0,
        relay1: value.relay1 || false,
        relay2: value.relay2 || false,
        buzzer: value.buzzer || false,
        mode: value.mode || "AUTO",
        threshold: value.threshold,
        user: value.user,
        note: value.note,
      }));

      logsArray.sort((a, b) => b.timestamp - a.timestamp);
      setLogs(logsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { logs, loading };
}
