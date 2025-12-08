"use client";

import { useState } from "react";
import { IoTSettings } from "@/types/settings";
import { Save, Wifi, RefreshCw } from "lucide-react";
import { db } from "@/lib/firebase";
import { ref, set } from "firebase/database";
import { useToast } from "@/contexts/ToastContext";

interface IoTSettingsTabProps {
  settings: IoTSettings;
  onSave: (settings: IoTSettings) => void;
}

export default function IoTSettingsTab({ settings, onSave }: IoTSettingsTabProps) {
  const toast = useToast();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);
  
  // WiFi Config Modals
  const [showWiFiModal, setShowWiFiModal] = useState(false);
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [savingWiFi, setSavingWiFi] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(localSettings);
    setSaving(false);
  };

  const handleSaveWiFi = async () => {
    if (!wifiSSID || !wifiPassword) {
      toast.warning("Vui lòng nhập đầy đủ SSID và mật khẩu!");
      return;
    }

    setSavingWiFi(true);
    try {
      // Save WiFi config to Firebase
      const wifiRef = ref(db, "/wifiConfig");
      await set(wifiRef, {
        ssid: wifiSSID,
        password: wifiPassword,
        timestamp: Date.now(),
        updateRequested: true, // ESP32 will check this flag
      });
      
      toast.success("Đã lưu cấu hình WiFi! ESP32 sẽ tự động cập nhật khi khởi động lại.");
      setShowWiFiModal(false);
      setWifiSSID("");
      setWifiPassword("");
    } catch (error) {
      console.error("Error saving WiFi config:", error);
      toast.error("Lỗi khi lưu cấu hình WiFi!");
    } finally {
      setSavingWiFi(false);
    }
  };

  const handleResetAP = async () => {
    if (!confirm("Bạn có chắc muốn reset về chế độ AP? ESP32 sẽ khởi động lại với WiFi AP mode.")) {
      return;
    }

    try {
      // Send reset AP command to Firebase
      const resetRef = ref(db, "/commands/resetAP");
      await set(resetRef, {
        requested: true,
        timestamp: Date.now(),
      });
      
      toast.success("Đã gửi lệnh reset AP! ESP32 sẽ khởi động lại trong chế độ AP.");
    } catch (error) {
      console.error("Error sending reset AP command:", error);
      toast.error("Lỗi khi gửi lệnh reset!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Threshold */}
      <div className="bg-[#071933]/70 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-sky-300 mb-4">Ngưỡng cảnh báo</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Ngưỡng gas (ppm)</label>
            <input
              type="number"
              value={localSettings.threshold}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  setLocalSettings({ ...localSettings, threshold: value });
                }
              }}
              className="w-full bg-blue-950/30 border border-blue-900/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              min="0"
              max="10000"
            />
            <p className="text-gray-500 text-xs mt-1">Hệ thống sẽ cảnh báo khi gas vượt ngưỡng này</p>
          </div>
        </div>
      </div>

      {/* Data Interval */}
      <div className="bg-[#071933]/70 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-sky-300 mb-4">Tần suất gửi dữ liệu</h3>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 5, 10].map((interval) => (
            <button
              key={interval}
              onClick={() => setLocalSettings({ ...localSettings, dataInterval: interval as any })}
              className={`py-3 rounded-lg font-semibold transition-all ${
                localSettings.dataInterval === interval
                  ? "bg-blue-600 text-white"
                  : "bg-blue-950/30 text-gray-400 border border-blue-900/20"
              }`}
            >
              {interval}s
            </button>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-2">Khoảng thời gian ESP32 gửi dữ liệu lên Firebase</p>
      </div>

      {/* WiFi Config */}
      <div className="bg-[#071933]/70 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-sky-300 mb-4 flex items-center gap-2">
          <Wifi size={20} />
          Cấu hình WiFi
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => setShowWiFiModal(true)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Wifi size={18} />
            Đổi SSID & Mật khẩu
          </button>
          <button
            onClick={handleResetAP}
            className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Reset AP Mode
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-3">
          ⚠️ ESP32 cần khởi động lại để áp dụng cấu hình WiFi mới
        </p>
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

      {/* WiFi Config Modal */}
      {showWiFiModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#071933] border-2 border-blue-500/50 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(249,115,22,0.3)]">
            <h3 className="text-2xl font-bold text-sky-300 mb-4 flex items-center gap-2">
              <Wifi size={24} />
              Cấu hình WiFi
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">WiFi SSID (Tên WiFi)</label>
                <input
                  type="text"
                  value={wifiSSID}
                  onChange={(e) => setWifiSSID(e.target.value)}
                  placeholder="Nhập tên WiFi"
                  className="w-full bg-blue-950/30 border border-blue-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-2 block">Mật khẩu WiFi</label>
                <input
                  type="password"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full bg-blue-950/30 border border-blue-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-blue-950/30 border border-blue-900/30 rounded-lg p-3">
                <p className="text-blue-300 text-xs">
                  ℹ️ Sau khi lưu, ESP32 sẽ cần khởi động lại để kết nối WiFi mới. 
                  Nếu kết nối thất bại, ESP32 sẽ tự động chuyển về chế độ AP.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowWiFiModal(false);
                    setWifiSSID("");
                    setWifiPassword("");
                  }}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveWiFi}
                  disabled={savingWiFi}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {savingWiFi ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
