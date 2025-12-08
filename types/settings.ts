export type SettingsTab = "iot" | "logs" | "ui" | "account";

export type DataInterval = 1 | 2 | 5 | 10; // seconds

export type LogRetention = 7 | 30 | 90; // days

export type Theme = "dark" | "light";

export type Language = "vi" | "en";

export type NotificationSettings = {
  gasHigh: boolean;
  fire: boolean;
  systemOffline: boolean;
};

export type IoTSettings = {
  threshold: number;
  dataInterval: DataInterval;
};

export type LogSettings = {
  enabled: boolean;
  retention: LogRetention;
  notifications: NotificationSettings;
};

export type UISettings = {
  theme: Theme;
  gasUnit: "ppm";
  tempUnit: "C" | "F";
  language: Language;
};

export type UserProfile = {
  name: string;
  email: string;
  avatar: string;
  twoFactorEnabled: boolean;
};
