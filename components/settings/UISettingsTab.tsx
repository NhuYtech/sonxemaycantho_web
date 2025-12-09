"use client";

import { Globe } from "lucide-react";
import { useUI } from "@/contexts/UIContext";

export default function UISettingsTab() {
  const { language, setLanguage, t } = useUI();

  return (
    <div className="space-y-6">
      {/* Language */}
      <div className="bg-[#152A45]/80 backdrop-blur-sm border border-blue-700/40 rounded-xl p-6">
        <h3 className="text-lg font-bold text-sky-300 mb-4 flex items-center gap-2">
          <Globe size={20} />
          {t("settings.ui.language")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setLanguage("vi")}
            className={`py-4 rounded-lg font-semibold transition-all ${
              language === "vi"
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                : "bg-blue-950/30 text-gray-400 border border-blue-900/20 hover:bg-blue-950/40"
            }`}
          >
            <div className="text-3xl mb-1">🇻🇳</div>
            <div>{t("settings.ui.language.vi")}</div>
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`py-4 rounded-lg font-semibold transition-all ${
              language === "en"
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                : "bg-blue-950/30 text-gray-400 border border-blue-900/20 hover:bg-blue-950/40"
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
