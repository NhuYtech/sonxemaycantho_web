# Database Structure Update - December 9, 2025

## Thay đổi cấu trúc Database

### Sensor Data Structure
**TRƯỚC:**
```json
{
  "sensor": {
    "mq2": 320,
    "fire": 0,    // 0 = fire, 1 = normal
    "temp": 28,
    "humi": 65
  }
}
```

**SAU:**
```json
{
  "sensor": {
    "mq2": 0,
    "fire": 1,           // 1 = fire, 0 = normal (ĐÃ ĐỔI)
    "temp": -1,          // deprecated field
    "temperature": 31.1, // field mới
    "humi": -1,          // deprecated field  
    "humidity": 70.1     // field mới
  }
}
```

## Chi tiết thay đổi

### 1. Fire Detection Logic (ĐÃ ĐỔI)
- **Trước**: `fire: 0` = có cháy, `fire: 1` = bình thường
- **Sau**: `fire: 1` = có cháy, `fire: 0` = bình thường
- **Code update**: `const fire = val.fire === 1;`

### 2. Temperature & Humidity Fields
- **Thêm mới**: `temperature` và `humidity` (tên đầy đủ)
- **Deprecated**: `temp` và `humi` (giữ lại để tương thích)
- **Giá trị -1**: Có nghĩa là sensor chưa khởi tạo hoặc lỗi
- **Xử lý fallback**:
  ```typescript
  let temperature = val.temperature ?? val.temp ?? 0;
  let humidity = val.humidity ?? val.humi ?? 0;
  if (temperature === -1) temperature = val.temp ?? 0;
  if (humidity === -1) humidity = val.humi ?? 0;
  ```

### 3. History Data Structure
Giờ lưu cả 2 format để đảm bảo tương thích:
```json
{
  "history": {
    "2025-12-09": {
      "-NhuYtech001": {
        "gas": 320,
        "temp": 28,
        "temperature": 28,      // thêm mới
        "humi": 65,
        "humidity": 65,         // thêm mới
        "fire": 1,
        "timestamp": 1733654400000
      }
    }
  }
}
```

## Files đã cập nhật

### 1. `hooks/useFirebaseDevice.ts`
- ✅ Đổi logic fire detection: `val.fire === 1`
- ✅ Ưu tiên đọc `temperature`/`humidity`
- ✅ Fallback về `temp`/`humi` nếu cần
- ✅ Xử lý giá trị -1 (sensor lỗi)
- ✅ Lưu cả 2 format vào history
- ✅ Lọc giá trị không hợp lệ khi tính average

### 2. `FIREBASE_STRUCTURE.md`
- ✅ Cập nhật schema mới
- ✅ Thêm comment giải thích các field deprecated
- ✅ Cập nhật luồng dữ liệu

## Testing Checklist

- [ ] Dashboard hiển thị đúng temperature từ sensor (31.1°C)
- [ ] Dashboard hiển thị đúng humidity từ sensor (70.1%)
- [ ] Fire alert hiển thị khi `sensor/fire = 1`
- [ ] Gas chart hiển thị đúng giá trị 0 ppm
- [ ] Không có lỗi console về giá trị -1
- [ ] History được lưu đúng cả 2 format
- [ ] Logs timeline ghi nhận đúng trạng thái fire

## Tương thích ngược

✅ **Backward compatible**: Code mới vẫn hỗ trợ đọc dữ liệu cũ (temp/humi)
✅ **Forward compatible**: Lưu cả 2 format để ESP32 có thể cập nhật dần

## Lưu ý cho ESP32

Cập nhật code ESP32 để:
1. Ghi vào cả 2 field: `temperature`/`temp` và `humidity`/`humi`
2. Đổi logic fire: gửi `1` khi phát hiện lửa, `0` khi bình thường
3. Gửi giá trị -1 khi sensor chưa sẵn sàng hoặc lỗi

### Ví dụ code ESP32:
```cpp
// Khi sensor sẵn sàng
Firebase.setFloat(firebaseData, "/sensor/temperature", dht.temperature);
Firebase.setFloat(firebaseData, "/sensor/temp", dht.temperature); // backward compat
Firebase.setFloat(firebaseData, "/sensor/humidity", dht.humidity);
Firebase.setFloat(firebaseData, "/sensor/humi", dht.humidity); // backward compat

// Khi sensor chưa sẵn sàng
Firebase.setInt(firebaseData, "/sensor/temperature", -1);
Firebase.setInt(firebaseData, "/sensor/temp", -1);

// Fire detection (ĐỔI LOGIC)
Firebase.setInt(firebaseData, "/sensor/fire", fireDetected ? 1 : 0);
```
