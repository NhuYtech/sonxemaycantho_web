"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { onValue, ref, query, orderByChild, limitToLast } from "firebase/database";
import { LogEvent } from "@/types/logs";

export function useFirebaseLogs() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy logs từ 30 ngày gần nhất
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    // Query logs với limit để tối ưu performance
    const logsRef = ref(db, "/logs");
    const logsQuery = query(logsRef, orderByChild("timestamp"), limitToLast(1000)); // Lấy 1000 logs gần nhất

    const unsubscribe = onValue(logsQuery, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setLogs([]);
        setLoading(false);
        return;
      }

      // Convert object to array and filter last 30 days
      const logsArray: LogEvent[] = Object.entries(data)
        .map(([id, value]: [string, any]) => ({
          id,
          timestamp: value.timestamp || Date.now(),
          type: value.type || "user_action",
          gas: value.gas || 0,
          fire: value.fire || false,
          temperature: value.temperature || 0,
          humidity: value.humidity || 0,
          threshold: value.threshold,
          user: value.user,
          note: value.note,
        }))
        .filter(log => log.timestamp >= thirtyDaysAgo) // Only keep last 30 days
        .sort((a, b) => b.timestamp - a.timestamp); // Newest first

      setLogs(logsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { logs, loading };
}
