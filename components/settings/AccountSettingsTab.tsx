"use client";

import { UserProfile } from "@/types/settings";
import { Shield, LogOut, Smartphone } from "lucide-react";
import Image from "next/image";

interface AccountSettingsTabProps {
  profile: UserProfile;
}

export default function AccountSettingsTab({ profile }: AccountSettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4">Thông tin tài khoản</h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {profile.avatar ? (
              <Image src={profile.avatar} alt={profile.name} width={80} height={80} className="object-cover" />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <p className="text-xl font-bold text-orange-300">{profile.name}</p>
            <p className="text-gray-400">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-orange-400" />
            <div>
              <h3 className="text-lg font-bold text-orange-300">Xác thực 2 yếu tố (2FA)</h3>
              <p className="text-gray-500 text-sm">Bảo mật tài khoản với Google Authenticator</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={profile.twoFactorEnabled} className="sr-only peer" readOnly />
            <div className="w-14 h-7 bg-red-950/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
        {!profile.twoFactorEnabled && (
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all">
            Kích hoạt 2FA
          </button>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
          <Smartphone size={20} />
          Phiên đăng nhập
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-red-950/30 rounded-lg border border-red-900/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 font-semibold">Chrome - Windows</p>
              <span className="text-xs text-green-400 bg-green-950/30 px-2 py-1 rounded">Hiện tại</span>
            </div>
            <p className="text-gray-500 text-sm">Cần Thơ, Việt Nam • 5 phút trước</p>
          </div>

          <div className="p-4 bg-red-950/30 rounded-lg border border-red-900/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-300 font-semibold">Safari - iPhone</p>
              <button className="text-xs text-red-400 hover:text-red-300">Đăng xuất</button>
            </div>
            <p className="text-gray-500 text-sm">Cần Thơ, Việt Nam • 2 giờ trước</p>
          </div>
        </div>
      </div>

      {/* Logout All */}
      <div className="bg-[#280E0A]/70 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
        <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2">
          <LogOut size={20} />
          Đăng xuất tất cả thiết bị
        </button>
        <p className="text-gray-500 text-xs text-center mt-2">Bạn sẽ cần đăng nhập lại trên tất cả thiết bị</p>
      </div>
    </div>
  );
}
