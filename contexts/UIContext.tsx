"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";
type TempUnit = "C" | "F";
type Language = "vi" | "en";

interface UIContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  tempUnit: TempUnit;
  setTempUnit: (unit: TempUnit) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  convertTemp: (celsius: number) => number;
  getTempLabel: () => string;
  t: (key: string) => string;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Header & Navigation
    "header.logout": "Đăng xuất",
    "nav.home": "Trang chủ",
    "nav.dashboard": "Dashboard",
    "nav.logs": "Nhật ký",
    "nav.settings": "Cài đặt",
    
    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.gas": "Gas hiện tại",
    "dashboard.fire": "Trạng thái cháy",
    "dashboard.fire.detected": "Có cháy",
    "dashboard.fire.none": "Không cháy",
    "dashboard.system": "Hệ thống",
    "dashboard.connected": "Đã kết nối",
    "dashboard.offline": "Mất kết nối",
    "dashboard.mode": "Chế độ",
    "dashboard.alert.fire": "⚠️ CẢNH BÁO CHÁY!",
    "dashboard.alert.gas": "⚠️ CẢNH BÁO GAS VƯỢT NGƯỠNG",
    "dashboard.alert.safe": "✓ HỆ THỐNG AN TOÀN",
    
    // Logs
    "logs.title": "Nhật ký hệ thống",
    "logs.subtitle": "Theo dõi và phân tích các sự kiện của hệ thống",
    "logs.loading": "Đang tải dữ liệu...",
    "logs.fire": "Phát hiện cháy",
    "logs.gas": "Cảnh báo Gas",
    "logs.user": "Thao tác người dùng",
    "logs.total": "Tổng sự kiện",
    
    // Settings
    "settings.title": "Cài đặt",
    "settings.subtitle": "Quản lý hệ thống và tùy chỉnh giao diện",
    "settings.save": "Lưu cài đặt",
    "settings.saving": "Đang lưu...",
    "settings.saved": "✓ Đã lưu!",
    
    // Settings Tabs
    "settings.tab.iot": "Hệ thống IoT",
    "settings.tab.logs": "Nhật ký & Thông báo",
    "settings.tab.ui": "Giao diện",
    "settings.tab.account": "Tài khoản",
    
    // UI Settings
    "settings.ui.theme": "Chủ đề giao diện",
    "settings.ui.theme.dark": "Dark Mode",
    "settings.ui.theme.dark.desc": "Giao diện tối - Dễ nhìn trong điều kiện ánh sáng yếu",
    "settings.ui.theme.light": "Light Mode",
    "settings.ui.theme.light.desc": "Giao diện sáng - Rõ ràng trong điều kiện ánh sáng mạnh",
    
    "settings.ui.temp": "Đơn vị nhiệt độ",
    "settings.ui.temp.celsius": "Celsius",
    "settings.ui.temp.fahrenheit": "Fahrenheit",
    "settings.ui.temp.example": "Ví dụ",
    
    "settings.ui.language": "Ngôn ngữ / Language",
    "settings.ui.language.vi": "Tiếng Việt",
    "settings.ui.language.en": "English",
    
    // Units
    "unit.ppm": "ppm",
    "unit.celsius": "°C",
    "unit.fahrenheit": "°F",
  },
  en: {
    // Header & Navigation
    "header.logout": "Logout",
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.logs": "Logs",
    "nav.settings": "Settings",
    
    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.gas": "Current Gas",
    "dashboard.fire": "Fire Status",
    "dashboard.fire.detected": "Fire Detected",
    "dashboard.fire.none": "No Fire",
    "dashboard.system": "System",
    "dashboard.connected": "Connected",
    "dashboard.offline": "Offline",
    "dashboard.mode": "Mode",
    "dashboard.alert.fire": "⚠️ FIRE ALERT!",
    "dashboard.alert.gas": "⚠️ GAS THRESHOLD EXCEEDED",
    "dashboard.alert.safe": "✓ SYSTEM SAFE",
    
    // Logs
    "logs.title": "System Logs",
    "logs.subtitle": "Monitor and analyze system events",
    "logs.loading": "Loading data...",
    "logs.fire": "Fire Detections",
    "logs.gas": "Gas Warnings",
    "logs.user": "User Actions",
    "logs.total": "Total Events",
    
    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage system and customize interface",
    "settings.save": "Save Settings",
    "settings.saving": "Saving...",
    "settings.saved": "✓ Saved!",
    
    // Settings Tabs
    "settings.tab.iot": "IoT System",
    "settings.tab.logs": "Logs & Notifications",
    "settings.tab.ui": "Interface",
    "settings.tab.account": "Account",
    
    // UI Settings
    "settings.ui.theme": "Theme",
    "settings.ui.theme.dark": "Dark Mode",
    "settings.ui.theme.dark.desc": "Dark interface - Easy on the eyes in low light",
    "settings.ui.theme.light": "Light Mode",
    "settings.ui.theme.light.desc": "Bright interface - Clear in bright conditions",
    
    "settings.ui.temp": "Temperature Unit",
    "settings.ui.temp.celsius": "Celsius",
    "settings.ui.temp.fahrenheit": "Fahrenheit",
    "settings.ui.temp.example": "Example",
    
    "settings.ui.language": "Language / Ngôn ngữ",
    "settings.ui.language.vi": "Tiếng Việt",
    "settings.ui.language.en": "English",
    
    // Units
    "unit.ppm": "ppm",
    "unit.celsius": "°C",
    "unit.fahrenheit": "°F",
  },
};

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [tempUnit, setTempUnitState] = useState<TempUnit>("C");
  const [language, setLanguageState] = useState<Language>("vi");
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedTempUnit = localStorage.getItem("tempUnit") as TempUnit | null;
    const savedLanguage = localStorage.getItem("language") as Language | null;

    if (savedTheme) setThemeState(savedTheme);
    if (savedTempUnit) setTempUnitState(savedTempUnit);
    if (savedLanguage) setLanguageState(savedLanguage);

    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    if (theme === "light") {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const setTempUnit = (unit: TempUnit) => {
    setTempUnitState(unit);
    localStorage.setItem("tempUnit", unit);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const convertTemp = (celsius: number): number => {
    if (tempUnit === "F") {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  const getTempLabel = (): string => {
    return tempUnit === "C" ? "°C" : "°F";
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <UIContext.Provider
      value={{
        theme,
        setTheme,
        tempUnit,
        setTempUnit,
        language,
        setLanguage,
        convertTemp,
        getTempLabel,
        t,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
