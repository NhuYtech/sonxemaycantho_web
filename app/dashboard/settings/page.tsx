"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Database, FileText, Palette, User } from "lucide-react";
import { useUI } from "@/contexts/UIContext";
import { useToast } from "@/contexts/ToastContext";
import { SettingsTab } from "@/types/settings";
import { db } from "@/lib/firebase";
import { ref, set, get } from "firebase/database";

import IoTSettingsTab from "@/components/settings/IoTSettingsTab";
import LogsSettingsTab from "@/components/settings/LogsSettingsTab";
import UISettingsTab from "@/components/settings/UISettingsTab";
import AccountSettingsTab from "@/components/settings/AccountSettingsTab";

export default function SettingsPage() {
  const { t } = useUI();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>("iot");
  const [loading, setLoading] = useState(true);

  // Fetch settings from Firebase on mount
  const [iotSettings, setIoTSettings] = useState({
    threshold: 4000,
    autoMode: true,
    behavior: {
      enableBuzzer: true,
      enableRelay1: true,
      enableRelay2: false,
      timeout: 60,
    },
    dataInterval: 2 as 1 | 2 | 5 | 10,
  });

  // Load IoT settings from Firebase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsRef = ref(db, "/settings");
        const snapshot = await get(settingsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          setIoTSettings({
            threshold: data.threshold || 4000,
            autoMode: data.mode !== false, // mode: true = AUTO, false = MANUAL
            behavior: {
              enableBuzzer: data.behavior?.enableBuzzer ?? true,
              enableRelay1: data.behavior?.enableRelay1 ?? true,
              enableRelay2: data.behavior?.enableRelay2 ?? false,
              timeout: data.behavior?.timeout || 60,
            },
            dataInterval: data.dataInterval || 2,
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const [logsSettings, setLogsSettings] = useState({
    enabled: true,
    retention: 30 as 7 | 30 | 90,
    notifications: {
      gasHigh: true,
      fire: true,
      systemOffline: true,
    },
  });

  const [uiSettings, setUISettings] = useState({
    theme: "dark" as "dark" | "fire" | "high-contrast",
    gasUnit: "ppm" as const,
    tempUnit: "C" as "C" | "F",
    language: "vi" as "vi" | "en",
  });

  const userProfile = {
    name: "Như Ý",
    email: "nhuyt@cantho.edu.vn",
    avatar: "",
    twoFactorEnabled: false,
  };

  const tabs = [
    { id: "iot" as const, label: t("settings.tab.iot"), icon: Database },
    { id: "logs" as const, label: t("settings.tab.logs"), icon: FileText },
    { id: "ui" as const, label: t("settings.tab.ui"), icon: Palette },
    { id: "account" as const, label: t("settings.tab.account"), icon: User },
  ];

  const handleSaveIoT = async (settings: typeof iotSettings) => {
    try {
      // Save to Firebase /settings node
      const settingsRef = ref(db, "/settings");
      await set(settingsRef, {
        threshold: settings.threshold,
        mode: settings.autoMode, // true = AUTO, false = MANUAL
        behavior: settings.behavior,
        dataInterval: settings.dataInterval,
      });
      
      setIoTSettings(settings);
      toast.success("Đã lưu cài đặt IoT thành công!");
      console.log("✅ IoT settings saved to Firebase:", settings);
    } catch (error) {
      console.error("❌ Error saving IoT settings:", error);
      toast.error("Lỗi khi lưu cài đặt. Vui lòng thử lại!");
    }
  };

  const handleSaveLogs = async (settings: typeof logsSettings) => {
    try {
      // Save to Firebase /logsSettings node
      const logsSettingsRef = ref(db, "/logsSettings");
      await set(logsSettingsRef, settings);
      
      setLogsSettings(settings);
      toast.success("Đã lưu cài đặt Logs thành công!");
      console.log("✅ Logs settings saved to Firebase:", settings);
    } catch (error) {
      console.error("❌ Error saving Logs settings:", error);
      toast.error("Lỗi khi lưu cài đặt. Vui lòng thử lại!");
    }
  };

  const handleSaveUI = async (settings: typeof uiSettings) => {
    // Save to localStorage/Firebase
    setUISettings(settings);
    console.log("Saving UI settings:", settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-orange-500/20 p-3 rounded-lg">
          <SettingsIcon className="text-orange-400" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-orange-300">{t("settings.title")}</h1>
          <p className="text-gray-400">{t("settings.subtitle")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                    : "text-gray-400 hover:bg-red-950/30"
                }`}
              >
                <Icon size={18} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "iot" && <IoTSettingsTab settings={iotSettings} onSave={handleSaveIoT} />}
        {activeTab === "logs" && <LogsSettingsTab settings={logsSettings} onSave={handleSaveLogs} />}
        {activeTab === "ui" && <UISettingsTab />}
        {activeTab === "account" && <AccountSettingsTab />}
      </div>
    </div>
  );
}
