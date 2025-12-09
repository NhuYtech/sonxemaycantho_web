# Firebase Realtime Database Structure

## Cấu trúc dữ liệu Firebase cho CanTho FireGuard

```json
{
  "sensor": {
    "mq2": 0,             // Nồng độ gas (ppm) từ cảm biến MQ-2
    "fire": 1,            // Cảm biến lửa: 1 = có cháy, 0 = không cháy
    "temp": -1,           // Nhiệt độ cũ (°C) - deprecated, dùng temperature
    "temperature": 31.1,  // Nhiệt độ mới (°C) từ DHT22
    "humi": -1,           // Độ ẩm cũ (%) - deprecated, dùng humidity
    "humidity": 70.1      // Độ ẩm mới (%) từ DHT22
  },
  
  "control": {
    "relay1": 0,          // Relay 1: 0 = TẮT, 1 = BẬT
    "relay2": 0,          // Relay 2: 0 = TẮT, 1 = BẬT
    "buzzer": 0           // Còi báo động: 0 = TẮT, 1 = BẬT
  },
  
  "settings": {
    "threshold": 400,     // Ngưỡng cảnh báo gas (ppm)
    "mode": 1,            // Chế độ: 1 = AUTO, 0 = MANUAL
    "mode_command": 1     // Lệnh thay đổi chế độ từ web
  },

  "history": {
    "2025-12-08": {       // Lịch sử theo ngày (YYYY-MM-DD)
      "-NhuYtech001": {
        "gas": 320,
        "temp": 28,
        "temperature": 28,
        "humi": 65,
        "humidity": 65,
        "fire": 0,
        "timestamp": 1733654400000
      },
      "-NhuYtech002": {
        "gas": 340,
        "temp": 29,
        "temperature": 29,
        "humi": 64,
        "humidity": 64,
        "fire": 0,
        "timestamp": 1733654460000
      }
    }
  }
}
```

## Luồng dữ liệu

### 1. Từ IoT Device → Firebase → Web
- ESP32 đọc cảm biến và ghi vào `/sensor`
  - Ghi cả 2 field: `temperature`/`humidity` (mới) và `temp`/`humi` (cũ) để tương thích
  - Giá trị -1 có nghĩa là sensor chưa khởi tạo hoặc lỗi
- Web lắng nghe realtime thay đổi tại `/sensor`
  - Ưu tiên đọc `temperature`/`humidity`, fallback về `temp`/`humi`
  - Bỏ qua giá trị -1 (sensor lỗi)
- Web tự động lưu lịch sử vào `/history/{date}` mỗi 1 phút
- Web hiển thị giá trị gas, fire, temperature, humidity ngay lập tức

### 2. Từ Web → Firebase → IoT Device
- User thay đổi relay/mode trên web
- Web ghi vào `/control` hoặc `/settings`
- ESP32 lắng nghe và thực hiện điều khiển phần cứng

### 3. Lưu trữ lịch sử
- Dữ liệu sensor được lưu vào `/history/{YYYY-MM-DD}` mỗi phút
- Mỗi ngày có 1 node riêng, giúp query nhanh và tiết kiệm dung lượng
- Giữ tối đa 100 record gần nhất cho mỗi ngày
- Hiển thị 20 điểm dữ liệu gần nhất trên chart

## Quy tắc bảo mật Firebase (Rules)

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "sensor": {
      ".read": true,
      ".write": "auth != null"
    },
    "control": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "settings": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "history": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["timestamp"]
    }
  }
}
```

## Code ESP32 mẫu (Arduino)

```cpp
#include <WiFi.h>
#include <FirebaseESP32.h>

// Firebase config
#define FIREBASE_HOST "sonxemay-cantho-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "YOUR_DATABASE_SECRET"

FirebaseData fbdo;

void setup() {
  Serial.begin(115200);
  
  // Kết nối WiFi
  WiFi.begin("YOUR_SSID", "YOUR_PASSWORD");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  // Kết nối Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // Đọc cảm biến MQ-2
  int gasValue = analogRead(34); // GPIO 34
  Firebase.setInt(fbdo, "/sensor/mq2", gasValue);
  
  // Đọc cảm biến lửa
  int fireValue = digitalRead(35); // GPIO 35
  Firebase.setInt(fbdo, "/sensor/fire", fireValue);
  
  // Đọc lệnh điều khiển từ Firebase
  if (Firebase.getInt(fbdo, "/control/relay1")) {
    int relay1 = fbdo.intData();
    digitalWrite(25, relay1); // GPIO 25
  }
  
  if (Firebase.getInt(fbdo, "/control/relay2")) {
    int relay2 = fbdo.intData();
    digitalWrite(26, relay2); // GPIO 26
  }
  
  delay(1000); // Cập nhật mỗi giây
}
```

## Testing Firebase Connection

Để test kết nối Firebase từ web console:

1. Mở Firebase Console: https://console.firebase.google.com/
2. Chọn project "sonxemay-cantho"
3. Vào Realtime Database
4. Thử ghi dữ liệu test:
   ```json
   {
     "sensor": {
       "mq2": 350,
       "fire": 0
     }
   }
   ```
5. Mở web dashboard → Xem dữ liệu hiển thị ngay lập tức
6. Thay đổi relay trên web → Xem giá trị trong Firebase Database thay đổi

## Notes

- Hook `useFirebaseDevice` tự động subscribe realtime changes
- Khi slider threshold thay đổi → tự động ghi vào `/settings/threshold`
- Khi toggle relay → tự động ghi vào `/control/relay1` hoặc `/control/relay2`
- Gas history được tạo local trên web (20 điểm gần nhất)
