# 🔌 Cách Web Lấy Giá Trị Thực Từ Linh Kiện

## 📡 Luồng dữ liệu hoàn chỉnh

```
ESP32 (Linh kiện) → Firebase Realtime Database → React Web App
    ↓                        ↓                          ↓
  Sensors              Cloud Storage              UI Display
  (MQ-2, DHT22)        (realtime sync)           (Dashboard)
```

---

## 1️⃣ ESP32 đọc cảm biến và gửi lên Firebase

### Code trên ESP32 (Arduino):
```cpp
#include <WiFi.h>
#include <FirebaseESP32.h>

// Đọc cảm biến
int gasValue = analogRead(MQ2_PIN);        // Đọc MQ-2
int fireValue = digitalRead(FIRE_PIN);     // Đọc Fire sensor
float temp = dht.readTemperature();        // Đọc DHT22
float humi = dht.readHumidity();           // Đọc DHT22

// GHI VÀO FIREBASE
Firebase.setInt(firebaseData, "/sensor/mq2", gasValue);
Firebase.setInt(firebaseData, "/sensor/fire", fireValue);
Firebase.setFloat(firebaseData, "/sensor/temp", temp);
Firebase.setFloat(firebaseData, "/sensor/humi", humi);
```

### Firebase structure sau khi ESP32 ghi:
```json
{
  "sensor": {
    "mq2": 320,      ← Giá trị Gas từ cảm biến MQ-2
    "fire": 0,       ← Giá trị Fire sensor (0=fire, 1=safe)
    "temp": 28.5,    ← Nhiệt độ từ DHT22
    "humi": 65.2     ← Độ ẩm từ DHT22
  }
}
```

---

## 2️⃣ React Web lắng nghe Firebase Realtime

### Hook: `useFirebaseDevice.ts`

```typescript
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

// Lắng nghe path /sensor
const sensorRef = ref(db, "/sensor");

const unsub = onValue(sensorRef, (snapshot) => {
  const val = snapshot.val();
  
  // Lấy giá trị từ Firebase
  const gas = val.mq2 ?? 0;          // ← Lấy giá trị gas
  const fire = val.fire === 0;       // ← Lấy trạng thái fire
  const temperature = val.temp ?? 0; // ← Lấy nhiệt độ
  const humidity = val.humi ?? 0;    // ← Lấy độ ẩm
  
  // Cập nhật state React
  setData({
    gas: gas,
    fire: fire,
    temperature: temperature,
    humidity: humidity,
    firebase: true
  });
});
```

### Cơ chế hoạt động:
- `onValue()` **tự động trigger** mỗi khi `/sensor` thay đổi
- ESP32 ghi → Firebase update → `onValue()` callback
- **Không cần polling**, Firebase push data realtime
- Latency: ~100-300ms

---

## 3️⃣ Component hiển thị dữ liệu

### Dashboard Component:
```tsx
import { useFirebaseDevice } from "@/hooks/useFirebaseDevice";

export default function Dashboard() {
  const [state] = useFirebaseDevice();
  
  return (
    <div>
      <h2>Gas: {state.gas} ppm</h2>
      <h2>Temperature: {state.temperature}°C</h2>
      <h2>Humidity: {state.humidity}%</h2>
      <h2>Fire: {state.fire ? "🔥 Detected" : "✅ Safe"}</h2>
    </div>
  );
}
```

---

## 📊 Biểu đồ lấy dữ liệu lịch sử

### GasPerformanceChart lắng nghe `/history/{date}`:

```typescript
// Path: /history/2025-12-08
const historyRef = ref(db, `/history/${today}`);
const historyQuery = query(historyRef, orderByChild('timestamp'));

const unsub = onValue(historyQuery, (snapshot) => {
  const val = snapshot.val();
  
  // Object dạng:
  // {
  //   "-ABC123": { gas: 320, temp: 28, timestamp: 1733654400000 },
  //   "-ABC124": { gas: 330, temp: 29, timestamp: 1733654460000 }
  // }
  
  const dataArray = Object.values(val);
  setRealtimeData(dataArray); // Append vào chart
});
```

---

## 🔄 Timeline Realtime

### Khi ESP32 gửi dữ liệu:

```
T+0s:    ESP32 đọc cảm biến MQ-2 → gasValue = 320
T+0.1s:  ESP32 ghi Firebase.setInt("/sensor/mq2", 320)
T+0.2s:  Firebase Realtime Database cập nhật /sensor/mq2 = 320
T+0.3s:  Firebase trigger onValue() callback
T+0.4s:  React component nhận data, setData({ gas: 320 })
T+0.5s:  UI re-render, hiển thị "Gas: 320 ppm"
```

**Tổng latency: ~500ms** từ sensor đến màn hình!

---

## 🎯 Các path Firebase quan trọng

| Path | Mục đích | Ai ghi | Ai đọc |
|------|----------|---------|---------|
| `/sensor/mq2` | Giá trị gas realtime | ESP32 | Web (Dashboard) |
| `/sensor/fire` | Trạng thái fire | ESP32 | Web (Dashboard) |
| `/sensor/temp` | Nhiệt độ | ESP32 | Web (Dashboard) |
| `/sensor/humi` | Độ ẩm | ESP32 | Web (Dashboard) |
| `/history/{date}` | Lịch sử append | ESP32 + Web | Web (Chart) |
| `/settings/threshold` | Ngưỡng cảnh báo | Web | ESP32 |

---

## 💡 Ví dụ đầy đủ

### 1. ESP32 gửi dữ liệu:
```cpp
void loop() {
  // Đọc cảm biến mỗi 2 giây
  if (millis() - lastRead > 2000) {
    int gas = analogRead(MQ2_PIN);
    
    // GHI VÀO FIREBASE
    Firebase.setInt(firebaseData, "/sensor/mq2", gas);
    
    Serial.println("✅ Sent gas: " + String(gas));
    lastRead = millis();
  }
}
```

### 2. Web nhận dữ liệu:
```typescript
// Hook tự động chạy khi component mount
useEffect(() => {
  const sensorRef = ref(db, "/sensor");
  
  const unsubscribe = onValue(sensorRef, (snapshot) => {
    const val = snapshot.val();
    console.log("✅ Received gas:", val.mq2); // In ra console
    
    // Cập nhật UI
    setGas(val.mq2);
  });
  
  return () => unsubscribe(); // Cleanup khi unmount
}, []);
```

### 3. Kết quả:
```
[ESP32 Serial Monitor]
✅ Sent gas: 320

[Browser Console]
✅ Received gas: 320

[UI Display]
Gas Level: 320 ppm
```

---

## 🔐 Firebase Configuration

### File: `lib/firebase.ts`
```typescript
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://your-project.firebaseio.com",
  apiKey: "AIza...",
  projectId: "your-project"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); // ← Database instance
```

---

## ⚡ Ưu điểm của Firebase Realtime

1. **Realtime**: Tự động push data, không cần polling
2. **Bi-directional**: ESP32 ↔ Firebase ↔ Web
3. **Offline support**: Cache data khi mất mạng
4. **Scalable**: Hỗ trợ nhiều client cùng lúc
5. **Cross-platform**: Web, Mobile, IoT đều dùng được

---

## 🐛 Troubleshooting

### Web không nhận được data:

**Kiểm tra:**
1. Firebase Console có data không?
2. Firebase Rules cho phép `.read: true`?
3. `databaseURL` đúng không?
4. Network tab có WebSocket connection?

**Console log để debug:**
```typescript
onValue(sensorRef, (snapshot) => {
  console.log("📡 Firebase snapshot:", snapshot.val());
  // Kiểm tra data có về không
});
```

### ESP32 không ghi được:

**Kiểm tra:**
1. WiFi connected?
2. Firebase Auth token đúng?
3. Serial Monitor có lỗi không?
4. Firebase Rules cho phép `.write: true`?

---

## 📝 Tóm tắt

**Cách web lấy giá trị từ linh kiện:**

1. ESP32 đọc sensor → ghi Firebase `/sensor/mq2`
2. Firebase trigger `onValue()` callback
3. React hook nhận data, update state
4. Component re-render, hiển thị giá trị mới

**Công nghệ:** Firebase Realtime Database (WebSocket)  
**Latency:** ~300-500ms  
**Tần suất:** Mỗi khi ESP32 ghi (thường 2 giây/lần)

---

**Tác giả:** NhuYtech  
**Project:** CanTho FireGuard  
**Date:** 8/12/2025
