# 🔥 ESP32 Firebase Integration Guide

## 📝 Hướng dẫn cấu hình ESP32 để ghi dữ liệu vào Firebase

### 1️⃣ Cấu trúc dữ liệu Firebase

```
firebase-root/
├── sensor/              ← Dữ liệu realtime hiện tại
│   ├── mq2: 320        (Gas level ppm)
│   ├── fire: 0         (0=fire, 1=normal)
│   ├── temp: 28        (Temperature °C)
│   └── humi: 65        (Humidity %)
│
├── control/             ← Điều khiển thiết bị
│   └── buzzer: 0
│
├── settings/            ← Cài đặt hệ thống
│   ├── threshold: 400  (Gas threshold ppm)
│   └── mode: 1         (1=AUTO, 0=MANUAL)
│
└── history/             ← Lịch sử dữ liệu (CHỈ GHI THÊM)
    └── 2025-12-08/     ← Theo ngày YYYY-MM-DD
        ├── -NhuYtech001
        ├── -NhuYtech002
        └── ...
```

### 2️⃣ Code ESP32 mẫu (Arduino)

```cpp
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>
#include <time.h>

// ===== FIREBASE CONFIG =====
#define FIREBASE_HOST "your-project.firebaseio.com"
#define FIREBASE_AUTH "your-firebase-secret"

// ===== WIFI CONFIG =====
#define WIFI_SSID "Your_WiFi"
#define WIFI_PASSWORD "Your_Password"

// ===== PIN CONFIG =====
#define MQ2_PIN 34        // Analog pin for MQ-2
#define FIRE_PIN 35       // Digital pin for Fire sensor
#define DHT_PIN 4         // DHT22 data pin
#define BUZZER_PIN 25

// ===== OBJECTS =====
FirebaseData firebaseData;
DHT dht(DHT_PIN, DHT22);

// ===== TIMING =====
unsigned long lastSensorRead = 0;
unsigned long lastHistorySave = 0;
const long SENSOR_INTERVAL = 2000;      // Đọc cảm biến mỗi 2 giây
const long HISTORY_INTERVAL = 60000;    // Lưu lịch sử mỗi 1 PHÚT

// ===== DATA =====
int gasValue = 0;
int fireValue = 1;  // 1=normal, 0=fire
float temperature = 0;
float humidity = 0;

void setup() {
  Serial.begin(115200);
  
  // Setup pins
  pinMode(MQ2_PIN, INPUT);
  pinMode(FIRE_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Start DHT22
  dht.begin();
  
  // Connect WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected!");
  Serial.println(WiFi.localIP());
  
  // Connect Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  Serial.println("✅ Firebase Connected!");
  
  // Configure time (for timestamp)
  configTime(7 * 3600, 0, "pool.ntp.org");  // GMT+7 (Vietnam)
}

void loop() {
  unsigned long currentMillis = millis();
  
  // 📊 ĐỌC CẢM BIẾN (Mỗi 2 giây)
  if (currentMillis - lastSensorRead >= SENSOR_INTERVAL) {
    lastSensorRead = currentMillis;
    readSensors();
    updateRealtimeData();
  }
  
  // 💾 LƯU LỊCH SỬ (Mỗi 1 phút - APPEND)
  if (currentMillis - lastHistorySave >= HISTORY_INTERVAL) {
    lastHistorySave = currentMillis;
    saveHistory();
  }
  
  // 🎛️ LẮNG NGHE LỆNH ĐIỀU KHIỂN
  listenControl();
}

// ===== ĐỌC CẢM BIẾN =====
void readSensors() {
  // MQ-2 Gas sensor
  int rawGas = analogRead(MQ2_PIN);
  gasValue = map(rawGas, 0, 4095, 0, 1000);  // Convert to ppm (điều chỉnh theo cảm biến)
  
  // Fire sensor
  fireValue = digitalRead(FIRE_PIN);
  
  // DHT22
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  
  // Check if reads failed
  if (isnan(temperature)) temperature = 0;
  if (isnan(humidity)) humidity = 0;
  
  Serial.printf("📊 Gas: %d ppm | Fire: %d | Temp: %.1f°C | Humi: %.1f%%\n", 
                gasValue, fireValue, temperature, humidity);
}

// ===== CẬP NHẬT DỮ LIỆU REALTIME =====
void updateRealtimeData() {
  // Update /sensor node
  Firebase.setInt(firebaseData, "/sensor/mq2", gasValue);
  Firebase.setInt(firebaseData, "/sensor/fire", fireValue);
  Firebase.setFloat(firebaseData, "/sensor/temp", temperature);
  Firebase.setFloat(firebaseData, "/sensor/humi", humidity);
}

// ===== LƯU LỊCH SỬ (APPEND) =====
void saveHistory() {
  // Get current date and timestamp
  time_t now;
  time(&now);
  struct tm* timeinfo = localtime(&now);
  
  char dateStr[11];
  strftime(dateStr, sizeof(dateStr), "%Y-%m-%d", timeinfo);
  
  unsigned long timestamp = now * 1000UL;  // Convert to milliseconds
  int hour = timeinfo->tm_hour;
  
  // Create path: /history/2025-12-08/auto-generated-key
  String path = "/history/" + String(dateStr);
  
  // Create JSON object
  FirebaseJson json;
  json.set("gas", gasValue);
  json.set("temp", temperature);
  json.set("humi", humidity);
  json.set("fire", fireValue);
  json.set("timestamp", timestamp);
  json.set("hour", hour);
  
  // APPEND (push) to Firebase
  if (Firebase.pushJSON(firebaseData, path, json)) {
    Serial.println("✅ History saved to: " + path);
  } else {
    Serial.println("❌ Failed to save history: " + firebaseData.errorReason());
  }
}

// ===== LẮNG NGHE LỆNH ĐIỀU KHIỂN =====
void listenControl() {
  // Read buzzer state
  if (Firebase.getInt(firebaseData, "/control/buzzer")) {
    int buzzer = firebaseData.intData();
    digitalWrite(BUZZER_PIN, buzzer);
  }
}
```

### 3️⃣ Giải thích cơ chế hoạt động

#### 🔄 Realtime Update (/sensor)
- ESP32 đọc cảm biến mỗi **2 giây**
- Ghi vào `/sensor` để web hiển thị realtime
- Web lắng nghe `.onValue()` để cập nhật UI ngay lập tức

#### 💾 History Append (/history/{date})
- ESP32 **APPEND** (push) dữ liệu vào Firebase mỗi **1 phút**
- Lưu vào `/history/{YYYY-MM-DD}` để dễ quản lý theo ngày
- Web chỉ query **1440 bản ghi gần nhất** (24 giờ × 60 phút)
- Firebase tự động tạo key ngẫu nhiên (push key)

#### 🧹 Tự động dọn dẹp dữ liệu cũ
Web dashboard sẽ tự động lọc chỉ hiển thị dữ liệu 24 giờ gần nhất:

```typescript
const last24Hours = dataArray.filter(item => {
  return (Date.now() - item.timestamp) <= 24 * 60 * 60 * 1000;
});
```

### 4️⃣ Tối ưu bộ nhớ Firebase

#### ❌ KHÔNG LÀM (Sai)
```cpp
// ❌ Ghi đè cùng 1 key → Mất dữ liệu cũ
Firebase.setInt(firebaseData, "/history/gas", gasValue);
```

#### ✅ NÊN LÀM (Đúng)
```cpp
// ✅ Push (append) với key tự động → Không mất dữ liệu
Firebase.pushJSON(firebaseData, "/history/2025-12-08", json);
```

### 5️⃣ Cấu trúc dữ liệu lý tưởng

```json
{
  "history": {
    "2025-12-08": {
      "-O1abc123": { "gas": 320, "temp": 28, "timestamp": 1733654400000, "hour": 10 },
      "-O1abc124": { "gas": 330, "temp": 29, "timestamp": 1733654460000, "hour": 10 },
      "-O1abc125": { "gas": 340, "temp": 29, "timestamp": 1733654520000, "hour": 10 }
    },
    "2025-12-09": {
      "-O1def456": { "gas": 310, "temp": 27, "timestamp": 1733740800000, "hour": 8 }
    }
  }
}
```

### 6️⃣ Firebase Rules bảo mật

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    
    "sensor": {
      ".read": true,
      ".write": true
    },
    
    "history": {
      ".read": "auth != null",
      ".write": true,
      "$date": {
        ".indexOn": ["timestamp", "hour"]
      }
    }
  }
}
```

### 7️⃣ Kiểm tra hoạt động

#### Trên Serial Monitor:
```
✅ WiFi Connected!
192.168.1.100
✅ Firebase Connected!
📊 Gas: 320 ppm | Fire: 1 | Temp: 28.0°C | Humi: 65.0%
✅ History saved to: /history/2025-12-08
```

#### Trên Web Dashboard:
- Badge "🔴 LIVE" hiển thị khi có dữ liệu realtime
- Biểu đồ tự động cập nhật mỗi phút
- Tooltip hiển thị giá trị chính xác khi hover

### 8️⃣ Troubleshooting

| Vấn đề | Giải pháp |
|--------|-----------|
| Không kết nối Firebase | Kiểm tra `FIREBASE_HOST` và `FIREBASE_AUTH` |
| Dữ liệu không lưu | Kiểm tra Firebase Rules, đảm bảo `.write: true` |
| Chart không cập nhật | Kiểm tra timestamp đúng định dạng (milliseconds) |
| Quá nhiều dữ liệu | Giảm `HISTORY_INTERVAL` hoặc tăng query limit |

### 9️⃣ Lưu ý quan trọng

⚠️ **KHÔNG** lưu quá dày, mỗi 1 phút là đủ cho biểu đồ  
⚠️ **LUÔN** dùng `push()` thay vì `set()` để append data  
⚠️ **NÊN** sử dụng NTP để có timestamp chính xác  
⚠️ **NÊN** index theo `timestamp` trong Firebase Rules  

✅ Web tự động lọc 24 giờ gần nhất, không cần ESP32 xóa data cũ!
