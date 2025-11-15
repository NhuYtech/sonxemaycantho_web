export type DeviceState = {
  gas: number;
  fire: boolean;
  relay1: boolean;
  relay2: boolean;
  window: boolean;
  buzzer: boolean;
  autoManual: "AUTO" | "MANUAL";
  threshold: number;
  wifi: boolean;
  blynk: boolean;
  firebase: boolean;
  gasHistory: { time: string; value: number }[];
};
