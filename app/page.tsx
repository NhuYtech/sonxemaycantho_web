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
      <header className="border-b border-blue-900/30 bg-[#071933]/60 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <img src="/favicon.ico" alt="logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">CanTho FireGuard</h1>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full font-semibold transition"
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
          <h2 className="text-3xl font-bold mb-4 text-sky-300">
            Hệ thống giám sát & cảnh báo cháy tự động
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Chào mừng bạn đến với <span className="font-bold">CanTho FireGuard</span>
          </p>
            <h2>
               Hệ thống theo dõi khí gas, lửa, nhiệt độ và độ ẩm theo thời gian thực, giúp bảo vệ xưởng sơn – kho hàng – khu vực sản xuất một cách an toàn và thông minh.
            </h2>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-full text-xl font-bold transition shadow-lg"
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
          <div id="feature-1" data-animate className={`bg-[#071933]/60 backdrop-blur-md border border-red-700/50 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,60,60,0.3)] transition-all duration-700 ${visibleSections.has('feature-1') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="flex items-start gap-4">
              <Wind className="w-12 h-12 text-sky-400 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-3">1️⃣ Theo dõi khí gas với MQ-2 (ppm)</h3>
                <ul className="space-y-2 text-gray-200">
                  <li>• Cảm biến MQ-2 đo nồng độ khí gas liên tục</li>
                  <li>• Hiển thị trên LCD 1602 và Web Dashboard</li>
                  <li>• Khi gas vượt ngưỡng → <span className="text-blue-400 font-semibold">Cảnh báo</span> + Bật còi</li>
                  <li>• Màu sắc trực quan: <span className="text-green-400">🟢 An toàn</span> | <span className="text-blue-400">🔴 Nguy hiểm</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div id="feature-2" data-animate className={`bg-[#071933]/60 backdrop-blur-md border border-red-700/50 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,60,60,0.3)] transition-all duration-700 ${visibleSections.has('feature-2') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="flex items-start gap-4">
              <Flame className="w-12 h-12 text-red-500 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-3">2️⃣ Phát hiện lửa (Flame Sensor)</h3>
                <ul className="space-y-2 text-gray-200">
                  <li>• Cảm biến lửa phát hiện ánh sáng hồng ngoại từ ngọn lửa</li>
                  <li>• Phản ứng nhanh khi có cháy:</li>
                  <li className="ml-4">→ Hiển thị cảnh báo trên LCD & Web</li>
                  <li className="ml-4">→ Kích hoạt còi báo động</li>
                  <li className="ml-4">→ Bật relay (thiết bị chữa cháy tự động)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div id="feature-3" data-animate className={`bg-[#071933]/60 backdrop-blur-md border border-red-700/50 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,60,60,0.3)] transition-all duration-700 delay-100 ${visibleSections.has('feature-3') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="flex items-start gap-4">
              <Activity className="w-12 h-12 text-blue-400 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-3">3️⃣ Giám sát nhiệt độ & độ ẩm (DHT22)</h3>
                <ul className="space-y-2 text-gray-200">
                  <li>• Cảm biến DHT22 đo nhiệt độ (°C) và độ ẩm (%)</li>
                  <li>• Cập nhật real-time lên Firebase</li>
                  <li>• Phát hiện môi trường bất thường:</li>
                  <li className="ml-4">→ Nhiệt độ quá cao có thể gây cháy</li>
                  <li className="ml-4">→ Độ ẩm thấp tăng nguy cơ cháy nổ</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div id="feature-4" data-animate className={`bg-[#071933]/60 backdrop-blur-md border border-red-700/50 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(255,60,60,0.3)] transition-all duration-700 delay-100 ${visibleSections.has('feature-4') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="flex items-start gap-4">
              <Settings className="w-12 h-12 text-green-400 shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-3">4️⃣ Điều khiển & giao diện phần cứng</h3>
                <ul className="space-y-2 text-gray-200">
                  <li>• <strong>ESP32:</strong> Vi điều khiển trung tâm kết nối WiFi & Firebase</li>
                  <li>• <strong>LCD 1602 Shield:</strong> Hiển thị thông tin tại chỗ (Gas, Temperature, Humidity)</li>
                  <li>• <strong>Relay 2 kênh:</strong> Điều khiển thiết bị chữa cháy tự động</li>
                  <li>• <strong>Buzzer:</strong> Còi báo động khi phát hiện nguy hiểm</li>
                  <li>• <strong>Nút nhấn:</strong> Tương tác trực tiếp (tắt cảnh báo / chuyển chế độ)</li>
                  <li>• <strong>Nguồn USB 5V:</strong> Cấp nguồn cho toàn bộ hệ thống</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="container mx-auto px-6 py-16 bg-[#071933]/40">
        <h2 className="text-4xl font-bold text-center mb-12">
          🟧 Hướng dẫn sử dụng hệ thống
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          <div id="guide-1" data-animate className={`bg-[#0B2A4A]/60 border border-blue-700/50 rounded-xl p-6 transition-all duration-700 ${visibleSections.has('guide-1') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-bold mb-3 text-sky-300">1️⃣ Kết nối hệ thống</h3>
            <p className="text-gray-200">
              • Cấp nguồn 5V cho ESP32 qua cáp USB (nguồn cho toàn bộ hệ thống)<br />
              • ESP32 tự động kết nối WiFi và Firebase<br />
              • LCD 1602 Shield hiển thị thông tin: Gas (ppm), Temperature (°C), Humidity (%)<br />
              • Relay 2 kênh và Buzzer sẵn sàng hoạt động<br />
              • Hệ thống ổn định sau 5-10 phút (MQ-2 cần thời gian làm nóng)
            </p>
          </div>

          <div id="guide-2" data-animate className={`bg-[#0B2A4A]/60 border border-blue-700/50 rounded-xl p-6 transition-all duration-700 delay-150 ${visibleSections.has('guide-2') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-bold mb-3 text-sky-300">2️⃣ Theo dõi trên Dashboard</h3>
            <p className="text-gray-200">Đăng nhập Web Dashboard để xem:</p>
            <ul className="text-gray-200 ml-4 mt-2 space-y-1">
              <li>• <strong>Nồng độ gas (ppm)</strong> từ cảm biến MQ-2</li>
              <li>• <strong>Nhiệt độ (°C)</strong> và <strong>Độ ẩm (%)</strong> từ DHT22</li>
              <li>• <strong>Trạng thái lửa</strong> từ Flame Sensor</li>
              <li>• <strong>Biểu đồ thời gian thực</strong></li>
              <li>• <strong>Trạng thái Relay, Buzzer, ESP32</strong></li>
            </ul>
          </div>

          <div id="guide-3" data-animate className={`bg-[#0B2A4A]/60 border border-blue-700/50 rounded-xl p-6 transition-all duration-700 delay-300 ${visibleSections.has('guide-3') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-bold mb-3 text-sky-300">3️⃣ Điều chỉnh cài đặt</h3>
            <p className="text-gray-200">
              <strong>Từ Web Dashboard:</strong><br />
              • Thay đổi ngưỡng cảnh báo gas<br />
              • Bật/tắt chế độ AUTO/MANUAL<br />
              • Điều khiển Relay 1, Relay 2<br />
              • Tắt buzzer khi cần<br />
              <br />
              <strong>Từ phần cứng (ESP32 + LCD Shield):</strong><br />
              • Dùng nút nhấn trên LCD 1602 Shield để tương tác trực tiếp<br />
              • Xem thông tin real-time trên màn hình LCD 1602<br />
              • Buzzer phát cảnh báo âm thanh khi có nguy hiểm
            </p>
          </div>

          <div id="guide-4" data-animate className={`bg-[#0B2A4A]/60 border border-blue-700/50 rounded-xl p-6 transition-all duration-700 delay-450 ${visibleSections.has('guide-4') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-bold mb-3 text-sky-300">4️⃣ Khi có cảnh báo</h3>
            <p className="text-gray-200">Hệ thống sẽ tự động:</p>
            <ul className="text-gray-200 ml-4 mt-2 space-y-1">
              <li>• <strong>LCD 1602:</strong> Hiển thị "⚠️ GAS HIGH!" hoặc "🔥 FIRE!"</li>
              <li>• <strong>Buzzer:</strong> Kêu còi báo động liên tục</li>
              <li>• <strong>Web:</strong> Hiển thị banner cảnh báo đỏ</li>
              <li>• <strong>Relay:</strong> Kích hoạt thiết bị chữa cháy (nếu ở chế độ AUTO)</li>
              <li>• <strong>Firebase:</strong> Lưu log sự kiện</li>
            </ul>
          </div>

          <div id="guide-5" data-animate className={`bg-[#0B2A4A]/60 border border-blue-700/50 rounded-xl p-6 transition-all duration-700 delay-600 ${visibleSections.has('guide-5') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h3 className="text-2xl font-bold mb-3 text-sky-300">5️⃣ Xử lý khi mất kết nối</h3>
            <p className="text-gray-200">
              Nếu ESP32 mất kết nối WiFi/Firebase:<br />
              • Hệ thống vẫn hoạt động độc lập (LCD + Buzzer + Relay)<br />
              • LCD hiển thị "⚠️ WiFi Lost" hoặc "⚠️ Firebase Lost"<br />
              • ESP32 tự động kết nối lại sau 30 giây<br />
              • Kiểm tra Dashboard → Trạng thái hệ thống để xem tình trạng
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
            <h3 className="text-xl font-bold text-sky-300 mb-3">⚙️ Về phần cứng:</h3>
            <ul className="ml-6 space-y-2">
              <li>• <strong>ESP32:</strong> Vi điều khiển trung tâm, cần nguồn ổn định 5V qua USB</li>
              <li>• <strong>MQ-2 (Gas):</strong> Cần 5–10 phút làm nóng sau khi bật nguồn</li>
              <li>• <strong>Flame Sensor (Lửa):</strong> Nhạy với ánh sáng mạnh, tránh đặt gần cửa sổ</li>
              <li>• <strong>DHT22 (Nhiệt độ & Độ ẩm):</strong> Cập nhật mỗi 2 giây, không được đọc quá nhanh</li>
              <li>• <strong>LCD 1602 Shield:</strong> Hiển thị tại chỗ, điều chỉnh độ tương phản bằng biến trở</li>
              <li>• <strong>Relay 2 kênh:</strong> Tải tối đa 10A/250VAC mỗi kênh, điều khiển thiết bị chữa cháy</li>
              <li>• <strong>Buzzer:</strong> Còi báo động tích hợp, âm lượng cao khi có cảnh báo</li>
              <li>• <strong>Nút nhấn:</strong> Trên LCD Shield, cho phép tương tác trực tiếp với hệ thống</li>
            </ul>

            <h3 className="text-xl font-bold text-sky-300 mb-3 mt-6">🔥 Về môi trường:</h3>
            <ul className="ml-6 space-y-2">
              <li>• <span className="text-green-300">Bình thường:</span> Gas 300–500 ppm, Nhiệt độ 20-30°C</li>
              <li>• <span className="text-yellow-300">Xưởng sơn:</span> Gas 400–800 ppm (tùy lượng dung môi)</li>
              <li>• <span className="text-red-300">Nguy hiểm:</span> Gas &gt; 1000 ppm hoặc phát hiện lửa</li>
            </ul>

            <h3 className="text-xl font-bold text-sky-300 mb-3 mt-6">⚠️ Xử lý sự cố:</h3>
            <ul className="ml-6 space-y-2">
              <li>• <strong>LCD 1602 không hiển thị:</strong> Kiểm tra nguồn USB 5V, điều chỉnh biến trở độ tương phản</li>
              <li>• <strong>ESP32 không kết nối WiFi:</strong> Hệ thống tự kết nối lại sau 30s, kiểm tra thông tin WiFi</li>
              <li>• <strong>Buzzer kêu liên tục:</strong> Nhấn nút trên LCD Shield hoặc tắt từ Dashboard</li>
              <li>• <strong>Relay không hoạt động:</strong> Kiểm tra nguồn USB, chế độ AUTO/MANUAL và kết nối dây</li>
              <li>• <strong>MQ-2 đọc giá trị sai:</strong> Chờ làm nóng đủ 5-10 phút, hiệu chuẩn lại nếu cần</li>
              <li>• <strong>Nút nhấn không phản hồi:</strong> Kiểm tra kết nối LCD Shield với ESP32</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto bg-[#071933]/60 backdrop-blur-md border border-red-700 rounded-2xl p-12">
          <Shield className="w-20 h-20 text-sky-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="text-gray-200 mb-8">
            Truy cập Dashboard để theo dõi hệ thống của bạn ngay bây giờ.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 px-10 py-4 rounded-full text-xl font-bold transition shadow-lg"
          >
            Mở Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-900/30 bg-[#071933]/60 py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>Được phát triển bởi <span className="text-blue-400 font-semibold">NHƯ Ý</span></p>
          <p className="mt-2 text-sm">© 2025 CanTho FireGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}