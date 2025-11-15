"use client";

export default function Header({ onLogout }: { onLogout?: () => void }) {
  return (
    <header className="h-16 border-b border-red-900/30 bg-[#1A0A00]/60 backdrop-blur-md flex items-center justify-between px-6">

      {/* Middle Title */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-gray-100">
        CanTho FireGuard
      </h1>

      {/* Right Side Profile */}
      <div className="ml-auto flex items-center gap-3">

        <button 
          onClick={onLogout}
          className="bg-red-700/60 hover:bg-red-600 transition px-4 py-2 rounded-lg text-sm font-medium"
        >
          Đăng xuất
        </button>

        <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center text-xl">
          👤
        </div>
      </div>

    </header>
  );
}
