export type HistoryItem = {
  time: string;  // Full datetime: "22/11/2025 14:25:30"
  day: number;   // Day of month: 22
  value: number;
};

export type DeviceState = {
  gas: number;
  fire: boolean;
  temperature: number;
  humidity: number;
  relay1: boolean;
  relay2: boolean;
  buzzer: boolean;
  autoManual: "AUTO" | "MANUAL";
  threshold: number;
  firebase: boolean;
  gasHistory: HistoryItem[];
  tempHistory: HistoryItem[];
  humidityHistory: HistoryItem[];
  lastUpdate: number;
  lastDHT22Update: number;
};
