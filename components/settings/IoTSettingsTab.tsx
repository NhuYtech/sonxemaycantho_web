"use client";

import { useState } from "react";
import { IoTSettings } from "@/types/settings";
import { Save } from "lucide-react";

interface IoTSettingsTabProps {
  settings: IoTSettings;
  onSave: (settings: IoTSettings) => void;
}

export default function IoTSettingsTab({ settings, onSave }: IoTSettingsTabProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(localSettings);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Threshold */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4">Ngưỡng cảnh báo</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Ngưỡng gas (ppm)</label>
            <input
              type="number"
              value={localSettings.threshold}
              onChange={(e) => setLocalSettings({ ...localSettings, threshold: parseInt(e.target.value) })}
              className="w-full bg-red-950/30 border border-red-900/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              min="0"
              max="10000"
            />
            <p className="text-gray-500 text-xs mt-1">Hệ thống sẽ cảnh báo khi gas vượt ngưỡng này</p>
          </div>
        </div>
      </div>

      {/* Mode */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4">Chế độ điều khiển</h3>
        <div className="flex gap-4">
          <button
            onClick={() => setLocalSettings({ ...localSettings, autoMode: true })}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              localSettings.autoMode
                ? "bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                : "bg-red-950/30 text-gray-400 border border-red-900/20"
            }`}
          >
            AUTO
          </button>
          <button
            onClick={() => setLocalSettings({ ...localSettings, autoMode: false })}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              !localSettings.autoMode
                ? "bg-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                : "bg-red-950/30 text-gray-400 border border-red-900/20"
            }`}
          >
            MANUAL
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          AUTO: Hệ thống tự động kích hoạt relay khi phát hiện cháy. MANUAL: Điều khiển thủ công.
        </p>
      </div>

      {/* Behavior */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4">Hành vi khi cảnh báo</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-red-950/30 rounded-lg border border-red-900/20">
            <span className="text-gray-300">Bật còi báo động</span>
            <input
              type="checkbox"
              checked={localSettings.behavior.enableBuzzer}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  behavior: { ...localSettings.behavior, enableBuzzer: e.target.checked },
                })
              }
              className="w-5 h-5 accent-orange-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-red-950/30 rounded-lg border border-red-900/20">
            <span className="text-gray-300">Bật Relay 1</span>
            <input
              type="checkbox"
              checked={localSettings.behavior.enableRelay1}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  behavior: { ...localSettings.behavior, enableRelay1: e.target.checked },
                })
              }
              className="w-5 h-5 accent-orange-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-red-950/30 rounded-lg border border-red-900/20">
            <span className="text-gray-300">Bật Relay 2</span>
            <input
              type="checkbox"
              checked={localSettings.behavior.enableRelay2}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  behavior: { ...localSettings.behavior, enableRelay2: e.target.checked },
                })
              }
              className="w-5 h-5 accent-orange-500"
            />
          </label>
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Timeout (giây)</label>
            <input
              type="number"
              value={localSettings.behavior.timeout}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  behavior: { ...localSettings.behavior, timeout: parseInt(e.target.value) },
                })
              }
              className="w-full bg-red-950/30 border border-red-900/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              min="0"
              max="300"
            />
            <p className="text-gray-500 text-xs mt-1">Thời gian tự động tắt relay sau khi kích hoạt</p>
          </div>
        </div>
      </div>

      {/* Data Interval */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4">Tần suất gửi dữ liệu</h3>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 5, 10].map((interval) => (
            <button
              key={interval}
              onClick={() => setLocalSettings({ ...localSettings, dataInterval: interval as any })}
              className={`py-3 rounded-lg font-semibold transition-all ${
                localSettings.dataInterval === interval
                  ? "bg-orange-600 text-white"
                  : "bg-red-950/30 text-gray-400 border border-red-900/20"
              }`}
            >
              {interval}s
            </button>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-2">Khoảng thời gian ESP32 gửi dữ liệu lên Firebase</p>
      </div>

      {/* WiFi Config */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4">Cấu hình WiFi</h3>
        <div className="space-y-3">
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">
            Đổi SSID & Mật khẩu
          </button>
          <button className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-all">
            Reset AP Mode
          </button>
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
