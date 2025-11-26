"use client";

import { Palette, Globe, Thermometer } from "lucide-react";
import { useUI } from "@/contexts/UIContext";

export default function UISettingsTab() {
  const { theme, setTheme, tempUnit, setTempUnit, language, setLanguage, t } = useUI();

  const themes = [
    {
      value: "dark" as const,
      label: t("settings.ui.theme.dark"),
      desc: t("settings.ui.theme.dark.desc"),
      preview: "bg-gradient-to-br from-gray-900 to-gray-800",
    },
    {
      value: "light" as const,
      label: t("settings.ui.theme.light"),
      desc: t("settings.ui.theme.light.desc"),
      preview: "bg-gradient-to-br from-gray-100 to-white",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
          <Palette size={20} />
          {t("settings.ui.theme")}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`p-4 rounded-xl text-left transition-all ${
                theme === themeOption.value
                  ? "bg-orange-600 border-2 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                  : "bg-red-950/30 border border-red-900/20 text-gray-300 hover:bg-red-950/40 hover:border-orange-900/40"
              }`}
            >
              <div className={`w-full h-20 ${themeOption.preview} rounded-lg mb-3 border-2 border-white/20`}></div>
              <p className="font-bold text-base mb-1">{themeOption.label}</p>
              <p className="text-sm opacity-80">{themeOption.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Temperature Unit */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
          <Thermometer size={20} />
          {t("settings.ui.temp")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTempUnit("C")}
            className={`py-4 rounded-lg font-semibold transition-all ${
              tempUnit === "C"
                ? "bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                : "bg-red-950/30 text-gray-400 border border-red-900/20 hover:bg-red-950/40"
            }`}
          >
            <div className="text-2xl mb-1">°C</div>
            <div className="text-sm">{t("settings.ui.temp.celsius")}</div>
          </button>
          <button
            onClick={() => setTempUnit("F")}
            className={`py-4 rounded-lg font-semibold transition-all ${
              tempUnit === "F"
                ? "bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                : "bg-red-950/30 text-gray-400 border border-red-900/20 hover:bg-red-950/40"
            }`}
          >
            <div className="text-2xl mb-1">°F</div>
            <div className="text-sm">{t("settings.ui.temp.fahrenheit")}</div>
          </button>
        </div>
        <div className="mt-3 p-3 bg-blue-950/30 border border-blue-900/30 rounded-lg">
          <p className="text-blue-300 text-sm">
            📊 {t("settings.ui.temp.example")}: 25°C = {Math.round((25 * 9) / 5 + 32)}°F
          </p>
        </div>
      </div>

      {/* Language */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
          <Globe size={20} />
          {t("settings.ui.language")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setLanguage("vi")}
            className={`py-4 rounded-lg font-semibold transition-all ${
              language === "vi"
                ? "bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                : "bg-red-950/30 text-gray-400 border border-red-900/20 hover:bg-red-950/40"
            }`}
          >
            <div className="text-3xl mb-1">🇻🇳</div>
            <div>{t("settings.ui.language.vi")}</div>
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`py-4 rounded-lg font-semibold transition-all ${
              language === "en"
                ? "bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                : "bg-red-950/30 text-gray-400 border border-red-900/20 hover:bg-red-950/40"
            }`}
          >
            <div className="text-3xl mb-1">🇬🇧</div>
            <div>{t("settings.ui.language.en")}</div>
          </button>
        </div>
      </div>

      {/* Auto-save info */}
      <div className="bg-green-950/30 border border-green-900/30 rounded-xl p-4">
        <p className="text-green-300 text-sm text-center">
          ✓ {language === "vi" ? "Cài đặt được lưu tự động" : "Settings saved automatically"}
        </p>
      </div>
    </div>
  );
}
