export type EventType = "fire_detected" | "gas_warning" | "user_action" | "threshold_change" | "system_event";

export type LogEvent = {
  id: string;
  timestamp: number;
  type: EventType;
  gas: number;
  fire: boolean;
  temperature: number;
  humidity: number;
  threshold?: number;
  user?: string;
  note?: string;
};

export type LogStats = {
  totalEvents: number;
  fireDetections: number;
  gasWarnings: number;
  userActions: number;
  maxGas: number;
  minGas: number;
  avgGas: number;
  maxTemp: number;
  minTemp: number;
  avgTemp: number;
  maxHumidity: number;
  minHumidity: number;
  avgHumidity: number;
};

export type TimeFilter = "hour" | "today" | "week" | "month" | "all" | "custom";
