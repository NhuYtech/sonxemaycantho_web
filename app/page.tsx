"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Flame, Wind, Bell, Settings, Shield, Activity } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#3d130e] via-[#4f1c13] to-[#f0703a] flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#3d130e] via-[#4f1c13] to-[#f0703a] text-white">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-[#1A0A00]/60 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <img src="/favicon.ico" alt="logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">CanTho FireGuard</h1>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full font-semibold transition"
        >
          Đi tới Dashboard
        </button>
    </div>
</header>


      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            ⭐ CanTho FireGuard
          </h1>
          <h2 className="text-3xl font-bold mb-4 text-orange-300">
            Hệ thống giám sát & cảnh báo cháy tự động
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Chào mừng bạn đến với <span className="font-bold">CanTho FireGuard</span>, hệ thống theo dõi khí gas và lửa theo thời gian thực, giúp bảo vệ xưởng sơn – kho hàng – khu vực sản xuất một cách an toàn và thông minh.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full text-xl font-bold transition shadow-lg"
          >
            Xem Dashboard ngay
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          🔥 Tính năng chính của hệ thống
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div id="feature-1" data-animate className={`bg-[#1A0A00]/60 backdrop-blur-md border border-red-700/50 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,60,60,0.3)] transition-all duration-700 ${visibleSections.has('feature-1') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="flex items-start gap-4">
              <Wind className="w-12 h-12 text-orange-400 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-3">1️⃣ Theo dõi khí gas theo thời gian thực (ppm)</h3>
                <ul className="space-y-2 text-gray-200">
                  <li>• Hệ thống hiển thị mức khí gas hiện tại</li>
                  <li>• Khi gas vượt ngưỡng → trạng thái <span className="text-red-400 font-semibold">Cảnh báo</span></li>
                  <li>• Màu sắc trực quan: <span className="text-green-400">🟢 An toàn</span> | <span className="text-red-400">🔴 Nguy hiểm</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div id="feature-2" data-animate className={`bg-[#1A0A00]/60 backdrop-blur-md border border-red-700/50 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,60,60,0.3)] transition-all duration-700 ${visibleSections.has('feature-2') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="flex items-start gap-4">
              <Flame className="w-12 h-12 text-red-500 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-3">2️⃣ Phát hiện lửa (Flame Sensor)</h3>
                <ul className="space-y-2 text-gray-200">
                  <li>• Cảm biến lửa hoạt động độc lập</li>
                  <li>• Khi phát hiện ánh sáng lửa:</li>
                  <li className="ml-4">→ UI hiện "Phát hiện cháy"</li>
                  <li className="ml-4">→ Gửi cảnh báo màu đỏ</li>
                  <li className="ml-4">→ Bật còi / relay (nếu IoT hoạt động)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div id="feature-3" data-animate className={`bg-[#1A0A00]/60 backdrop-blur-md border border-red-700/50 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,60,60,0.3)] transition-all duration-700 delay-100 ${visibleSections.has('feature-3') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="flex items-start gap-4">
              <Settings className="w-12 h-12 text-blue-400 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-3">3️⃣ Tùy chỉnh ngưỡng cảnh báo</h3>
                <ul className="space-y-2 text-gray-200">
                  <li>• Điều chỉnh mức ngưỡng gas (300, 400, 500 ppm...)</li>
                  <li>• Ngưỡng càng thấp → hệ thống càng nhạy</li>
                  <li>• Phù hợp với:</li>
                  <li className="ml-4">→ Xưởng sơn: ngưỡng cao hơn</li>
                  <li className="ml-4">→ Khu vực thường: ngưỡng thấp hơn</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div id="feature-4" data-animate className={`bg-[#1A0A00]/60 backdrop-blur-md border border-red-700/50 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,60,60,0.3)] transition-all duration-700 delay-100 ${visibleSections.has('feature-4') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="flex items-start gap-4">
              <Activity className="w-12 h-12 text-green-400 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-3">4️⃣ Xem trạng thái thiết bị IoT</h3>
                <ul className="space-y-2 text-gray-200">
                  <li>• Trạng thái kết nối WiFi</li>
                  <li>• Trạng thái Blynk/Firebase</li>
                  <li>• Trạng thái relay</li>
                  <li>• Cửa/sổ hút khói</li>
                  <li>• Còi báo động</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="container mx-auto px-6 py-16 bg-[#1A0A00]/40">
        <h2 className="text-4xl font-bold text-center mb-12">
          🟧 Hướng dẫn sử dụng hệ thống
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          <div id="guide-1" data-animate className={`bg-[#2A1410]/60 border border-orange-700/50 rounded-xl p-6 transition-all duration-700 ${visibleSections.has('guide-1') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-bold mb-3 text-orange-300">1️⃣ Đăng nhập</h3>
            <p className="text-gray-200">
              • Nhấn "Đăng nhập bằng Google"<br />
              • Sau khi đăng nhập, bạn sẽ vào trang Dashboard
            </p>
          </div>

          <div id="guide-2" data-animate className={`bg-[#2A1410]/60 border border-orange-700/50 rounded-xl p-6 transition-all duration-700 delay-150 ${visibleSections.has('guide-2') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-bold mb-3 text-orange-300">2️⃣ Theo dõi chỉ số trên Dashboard</h3>
            <p className="text-gray-200">Trong Dashboard bạn sẽ thấy:</p>
            <ul className="text-gray-200 ml-4 mt-2 space-y-1">
              <li>• Mức gas hiện tại (ppm)</li>
              <li>• Ngưỡng cảnh báo</li>
              <li>• Trạng thái cảm biến lửa</li>
              <li>• Biểu đồ gas theo thời gian</li>
              <li>• Trạng thái hoạt động của thiết bị IoT</li>
            </ul>
          </div>

          <div id="guide-3" data-animate className={`bg-[#2A1410]/60 border border-orange-700/50 rounded-xl p-6 transition-all duration-700 delay-300 ${visibleSections.has('guide-3') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-bold mb-3 text-orange-300">3️⃣ Điều chỉnh ngưỡng cảnh báo gas</h3>
            <p className="text-gray-200">
              • Kéo thanh trượt "Ngưỡng cảnh báo"<br />
              • Ngưỡng mới sẽ:<br />
              <span className="ml-4">→ Cập nhật ngay trên UI</span><br />
              <span className="ml-4">→ Gửi xuống ESP32</span><br />
              <span className="ml-4">→ Lưu vào EEPROM (không mất khi mất điện)</span>
            </p>
          </div>

          <div id="guide-4" data-animate className={`bg-[#2A1410]/60 border border-orange-700/50 rounded-xl p-6 transition-all duration-700 delay-[450ms] ${visibleSections.has('guide-4') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-bold mb-3 text-orange-300">4️⃣ Cảnh báo khi có sự cố</h3>
            <p className="text-gray-200">Hệ thống sẽ:</p>
            <ul className="text-gray-200 ml-4 mt-2 space-y-1">
              <li>• Hiển thị thông báo "Cảnh báo!"</li>
              <li>• Chuyển màu đỏ</li>
              <li>• Bật còi báo (nếu có IoT)</li>
              <li>• Gửi dữ liệu real-time</li>
            </ul>
          </div>

          <div id="guide-5" data-animate className={`bg-[#2A1410]/60 border border-orange-700/50 rounded-xl p-6 transition-all duration-700 delay-[600ms] ${visibleSections.has('guide-5') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-bold mb-3 text-orange-300">5️⃣ Reset hoặc kiểm tra lại</h3>
            <p className="text-gray-200">
              Trong trường hợp:<br />
              • IoT mất WiFi<br />
              • IoT vừa khởi động lại<br />
              <br />
              Bạn chỉ cần vào Dashboard → xem trạng thái thiết bị.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          🟦 Lưu ý quan trọng khi sử dụng
        </h2>

        <div id="notes" data-animate className={`max-w-4xl mx-auto bg-red-900/20 border-2 border-red-600 rounded-2xl p-8 transition-all duration-700 ${visibleSections.has('notes') ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="space-y-4 text-gray-100">
            <p>
              <span className="font-bold text-orange-300">⚠️ MQ2 cần 5–10 phút</span> để ổn định sau khi bật nguồn.
            </p>
            <p>
              <span className="font-bold text-orange-300">⚠️ Ngưỡng nên điều chỉnh</span> dựa trên môi trường thực tế:
            </p>
            <ul className="ml-6 space-y-2">
              <li>• <span className="text-green-300">Bình thường:</span> 300–500 ppm</li>
              <li>• <span className="text-yellow-300">Xưởng sơn:</span> 400–800 ppm (tùy lượng dung môi)</li>
            </ul>
            <p className="mt-4">
              <span className="font-bold text-orange-300">⚠️ Nếu cảm biến lửa báo liên tục</span>, hãy kiểm tra:
            </p>
            <ul className="ml-6 space-y-2">
              <li>• Ánh sáng mạnh</li>
              <li>• Tia lửa nhỏ từ thiết bị máy móc</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto bg-[#1A0A00]/60 backdrop-blur-md border border-red-700 rounded-2xl p-12">
          <Shield className="w-20 h-20 text-orange-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="text-gray-200 mb-8">
            Truy cập Dashboard để theo dõi hệ thống của bạn ngay bây giờ.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-orange-500 hover:bg-orange-600 px-10 py-4 rounded-full text-xl font-bold transition shadow-lg"
          >
            Mở Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-red-900/30 bg-[#1A0A00]/60 py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>Được phát triển bởi <span className="text-red-400 font-semibold">NHƯ Ý</span></p>
          <p className="mt-2 text-sm">© 2025 CanTho FireGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}