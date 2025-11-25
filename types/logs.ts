export type EventType = "fire_detected" | "gas_warning" | "relay_on" | "relay_off" | "mode_change" | "user_action" | "threshold_change";

export type LogEvent = {
  id: string;
  timestamp: number;
  type: EventType;
  gas: number;
  fire: boolean;
  relay1: boolean;
  relay2: boolean;
  buzzer: boolean;
  mode: "AUTO" | "MANUAL";
  threshold?: number;
  user?: string;
  note?: string;
};

export type LogStats = {
  totalEvents: number;
  fireDetections: number;
  gasWarnings: number;
  relayActivations: number;
  userActions: number;
  maxGas: number;
  minGas: number;
  avgGas: number;
};

export type TimeFilter = "today" | "week" | "month" | "all";
