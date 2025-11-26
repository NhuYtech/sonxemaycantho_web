"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useUI } from "@/contexts/UIContext";

export default function Header() {
  const { t } = useUI();
  const [user, setUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-red-900/30 bg-[#1A0A00]/60 backdrop-blur-md flex items-center justify-between px-6">

      <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-gray-100">
        CanTho FireGuard
      </h1>

      {/* RIGHT */}
      <div className="ml-auto relative">
        {user && (
          <>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-900/20 transition"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  className="w-8 h-8 rounded-full"
                  alt="avatar"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              )}

              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold">{user.displayName}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>

              <ChevronDown size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#2A1410] border border-red-900/30 rounded-lg shadow-lg z-50">
                
                {/* User Info */}
                <div className="p-4 border-b border-red-900/30">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photoURL}
                      className="w-12 h-12 rounded-full"
                      alt="avatar"
                    />
                    <div>
                      <p className="font-semibold text-gray-100">{user.displayName}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-900/20 transition text-sm font-medium"
                >
                  <LogOut size={16} /> {t("header.logout")}
                </button>

              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
