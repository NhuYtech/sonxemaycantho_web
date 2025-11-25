"use client";

import { useState } from "react";
import { UISettings } from "@/types/settings";
import { Save, Palette, Globe } from "lucide-react";

interface UISettingsTabProps {
  settings: UISettings;
  onSave: (settings: UISettings) => void;
}

export default function UISettingsTab({ settings, onSave }: UISettingsTabProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(localSettings);
    setSaving(false);
  };

  const themes = [
    { value: "dark" as const, label: "Dark Mode", desc: "Giao diện tối mặc định" },
    { value: "fire" as const, label: "Fire Mode", desc: "Chủ đề lửa đỏ cam" },
    { value: "high-contrast" as const, label: "High Contrast", desc: "Độ tương phản cao" },
  ];

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
          <Palette size={20} />
          Chủ đề giao diện
        </h3>
        <div className="grid gap-3">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => setLocalSettings({ ...localSettings, theme: theme.value })}
              className={`p-4 rounded-lg text-left transition-all ${
                localSettings.theme === theme.value
                  ? "bg-orange-600 border-2 border-orange-500 text-white"
                  : "bg-red-950/30 border border-red-900/20 text-gray-300 hover:bg-red-950/40"
              }`}
            >
              <p className="font-semibold">{theme.label}</p>
              <p className="text-sm opacity-80">{theme.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Units */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4">Đơn vị đo</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Khí gas</label>
            <div className="grid grid-cols-1 gap-3">
              <button
                className="p-3 rounded-lg bg-orange-600 text-white font-semibold cursor-not-allowed"
                disabled
              >
                ppm (parts per million)
              </button>
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 block">Nhiệt độ</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLocalSettings({ ...localSettings, tempUnit: "C" })}
                className={`py-3 rounded-lg font-semibold transition-all ${
                  localSettings.tempUnit === "C"
                    ? "bg-orange-600 text-white"
                    : "bg-red-950/30 text-gray-400 border border-red-900/20"
                }`}
              >
                °C (Celsius)
              </button>
              <button
                onClick={() => setLocalSettings({ ...localSettings, tempUnit: "F" })}
                className={`py-3 rounded-lg font-semibold transition-all ${
                  localSettings.tempUnit === "F"
                    ? "bg-orange-600 text-white"
                    : "bg-red-950/30 text-gray-400 border border-red-900/20"
                }`}
              >
                °F (Fahrenheit)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
          <Globe size={20} />
          Ngôn ngữ
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setLocalSettings({ ...localSettings, language: "vi" })}
            className={`py-4 rounded-lg font-semibold transition-all ${
              localSettings.language === "vi"
                ? "bg-orange-600 text-white"
                : "bg-red-950/30 text-gray-400 border border-red-900/20"
            }`}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            onClick={() => setLocalSettings({ ...localSettings, language: "en" })}
            className={`py-4 rounded-lg font-semibold transition-all ${
              localSettings.language === "en"
                ? "bg-orange-600 text-white"
                : "bg-red-950/30 text-gray-400 border border-red-900/20"
            }`}
          >
            🇬🇧 English
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
