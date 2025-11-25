export type DeviceState = {
  gas: number;
  fire: boolean;
  relay1: boolean;
  relay2: boolean;
  buzzer: boolean;
  autoManual: "AUTO" | "MANUAL";
  threshold: number;
  firebase: boolean;
  gasHistory: { time: string; value: number }[];
};
