"use client";

import { useState, useEffect } from "react";
import { LogOut, Smartphone, Trash2 } from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AccountSettingsTab() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lấy thông tin user hiện tại
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          name: user.displayName || user.email?.split('@')[0] || "User",
          email: user.email || "",
          avatar: user.photoURL || "",
          uid: user.uid,
          createdAt: user.metadata.creationTime,
          lastSignIn: user.metadata.lastSignInTime,
        });

        // Mock sessions - trong production sẽ lấy từ Firebase hoặc backend
        const mockSessions = [
          {
            id: "current",
            device: "Chrome - Windows",
            location: "Cần Thơ, Việt Nam",
            time: "5 phút trước",
            isCurrent: true,
          },
        ];
        setSessions(mockSessions);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Đăng xuất thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (confirm("Bạn có chắc muốn đăng xuất tất cả thiết bị?")) {
      setLoading(true);
      try {
        // Trong production: Xóa tất cả sessions từ backend
        await logout();
        router.push("/login");
      } catch (error) {
        console.error("Error logging out all devices:", error);
        alert("Đăng xuất thất bại");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveSession = async (sessionId: string) => {
    if (sessionId === "current") {
      alert("Không thể xóa phiên hiện tại");
      return;
    }

    if (confirm("Đăng xuất thiết bị này?")) {
      // Trong production: Gọi API xóa session
      setSessions(sessions.filter((s) => s.id !== sessionId));
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sky-400">Loading...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="bg-[#071933]/70 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-sky-300 mb-4">Thông tin tài khoản</h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {currentUser.avatar ? (
              <Image src={currentUser.avatar} alt={currentUser.name} width={80} height={80} className="object-cover" />
            ) : (
              currentUser.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <p className="text-xl font-bold text-sky-300">{currentUser.name}</p>
            <p className="text-gray-400">{currentUser.email}</p>
            <div className="mt-2 space-y-1 text-sm text-gray-500">
              <p>Đăng ký: {new Date(currentUser.createdAt).toLocaleDateString('vi-VN')}</p>
              <p>Đăng nhập gần nhất: {new Date(currentUser.lastSignIn).toLocaleString('vi-VN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-[#071933]/70 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-sky-300 mb-4 flex items-center gap-2">
          <Smartphone size={20} />
          Phiên đăng nhập
        </h3>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 bg-blue-950/30 rounded-lg border border-blue-900/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-300 font-semibold">{session.device}</p>
                <div className="flex items-center gap-2">
                  {session.isCurrent ? (
                    <span className="text-xs text-green-400 bg-green-950/30 px-2 py-1 rounded">Hiện tại</span>
                  ) : (
                    <button
                      onClick={() => handleRemoveSession(session.id)}
                      className="text-xs text-blue-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Xóa
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                {session.location} • {session.time}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Buttons */}
      <div className="bg-[#071933]/70 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6 space-y-3">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <LogOut size={20} />
          {loading ? "Đang đăng xuất..." : "Đăng xuất thiết bị này"}
        </button>
        <button
          onClick={handleLogoutAllDevices}
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <LogOut size={20} />
          {loading ? "Đang đăng xuất..." : "Đăng xuất tất cả thiết bị"}
        </button>
        <p className="text-gray-500 text-xs text-center">Bạn sẽ cần đăng nhập lại trên tất cả thiết bị</p>
      </div>
    </div>
  );
}
