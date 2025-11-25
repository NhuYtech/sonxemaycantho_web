"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Database, FileText, Palette, User } from "lucide-react";
import { SettingsTab } from "@/types/settings";

import IoTSettingsTab from "@/components/settings/IoTSettingsTab";
import LogsSettingsTab from "@/components/settings/LogsSettingsTab";
import UISettingsTab from "@/components/settings/UISettingsTab";
import AccountSettingsTab from "@/components/settings/AccountSettingsTab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("iot");

  // Mock data - in production, fetch from Firebase/Auth
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
    { id: "iot" as const, label: "Hệ thống IoT", icon: Database },
    { id: "logs" as const, label: "Logs & Thông báo", icon: FileText },
    { id: "ui" as const, label: "Giao diện", icon: Palette },
    { id: "account" as const, label: "Tài khoản", icon: User },
  ];

  const handleSaveIoT = async (settings: typeof iotSettings) => {
    // Save to Firebase
    setIoTSettings(settings);
    console.log("Saving IoT settings:", settings);
  };

  const handleSaveLogs = async (settings: typeof logsSettings) => {
    // Save to Firebase
    setLogsSettings(settings);
    console.log("Saving Logs settings:", settings);
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
          <h1 className="text-3xl font-bold text-orange-300">Cài đặt</h1>
          <p className="text-gray-400">Quản lý hệ thống và tùy chỉnh giao diện</p>
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
        {activeTab === "ui" && <UISettingsTab settings={uiSettings} onSave={handleSaveUI} />}
        {activeTab === "account" && <AccountSettingsTab profile={userProfile} />}
      </div>
    </div>
  );
}
