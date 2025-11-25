"use client";

import { useState } from "react";
import { LogSettings } from "@/types/settings";
import { Save, Bell, BellOff } from "lucide-react";

interface LogsSettingsTabProps {
  settings: LogSettings;
  onSave: (settings: LogSettings) => void;
}

export default function LogsSettingsTab({ settings, onSave }: LogsSettingsTabProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(localSettings);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Enable Logs */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-orange-300">Lưu logs</h3>
            <p className="text-gray-500 text-sm">Ghi lại các sự kiện của hệ thống</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.enabled}
              onChange={(e) => setLocalSettings({ ...localSettings, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-red-950/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>

      {/* Log Retention */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4">Giới hạn lưu trữ logs</h3>
        <div className="grid grid-cols-3 gap-3">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setLocalSettings({ ...localSettings, retention: days as any })}
              className={`py-3 rounded-lg font-semibold transition-all ${
                localSettings.retention === days
                  ? "bg-orange-600 text-white"
                  : "bg-red-950/30 text-gray-400 border border-red-900/20"
              }`}
            >
              {days} ngày
            </button>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-2">Logs cũ hơn sẽ tự động bị xóa</p>
      </div>

      {/* Notifications */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
          <Bell size={20} />
          Thông báo
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 bg-red-950/30 rounded-lg border border-red-900/20 cursor-pointer hover:bg-red-950/40 transition-colors">
            <div className="flex items-center gap-3">
              {localSettings.notifications.gasHigh ? (
                <Bell size={20} className="text-yellow-400" />
              ) : (
                <BellOff size={20} className="text-gray-500" />
              )}
              <div>
                <p className="text-gray-300 font-medium">Cảnh báo Gas cao</p>
                <p className="text-gray-500 text-xs">Thông báo khi gas vượt ngưỡng</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={localSettings.notifications.gasHigh}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  notifications: { ...localSettings.notifications, gasHigh: e.target.checked },
                })
              }
              className="w-5 h-5 accent-orange-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-red-950/30 rounded-lg border border-red-900/20 cursor-pointer hover:bg-red-950/40 transition-colors">
            <div className="flex items-center gap-3">
              {localSettings.notifications.fire ? (
                <Bell size={20} className="text-red-400" />
              ) : (
                <BellOff size={20} className="text-gray-500" />
              )}
              <div>
                <p className="text-gray-300 font-medium">Cảnh báo Cháy</p>
                <p className="text-gray-500 text-xs">Thông báo khi phát hiện lửa</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={localSettings.notifications.fire}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  notifications: { ...localSettings.notifications, fire: e.target.checked },
                })
              }
              className="w-5 h-5 accent-orange-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-red-950/30 rounded-lg border border-red-900/20 cursor-pointer hover:bg-red-950/40 transition-colors">
            <div className="flex items-center gap-3">
              {localSettings.notifications.systemOffline ? (
                <Bell size={20} className="text-gray-400" />
              ) : (
                <BellOff size={20} className="text-gray-500" />
              )}
              <div>
                <p className="text-gray-300 font-medium">Hệ thống mất kết nối</p>
                <p className="text-gray-500 text-xs">Thông báo khi ESP32 offline</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={localSettings.notifications.systemOffline}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  notifications: { ...localSettings.notifications, systemOffline: e.target.checked },
                })
              }
              className="w-5 h-5 accent-orange-500"
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Save size={20} />
        {saving ? "Đang lưu..." : "Lưu cài đặt"}
      </button>
    </div>
  );
}
