# VKU StudySpace 🎓
### Real-Time Study Room & Computer Lab Booking App (React Native & Expo)

Ứng dụng di động quản lý và đặt chỗ phòng tự học, phòng thực hành máy tính thời gian thực dành cho sinh viên và các nhóm nghiên cứu Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (**VKU - Đại học Đà Nẵng**).

---

## 🎯 Mục Tiêu Đạt Được (Core Objectives & Features)

1. **Hiệu năng cao với FlatList (60fps Scrolling)**:
   - Tối ưu hóa card phòng với `React.memo` và hàm so sánh tùy biến chống re-render thừa.
   - Thiết lập `getItemLayout` tính trước chiều cao cố định (`ROOM_CARD_HEIGHT = 290`), loại bỏ chi phí đo layout động.
   - Tinh chỉnh FlatList: `initialNumToRender={6}`, `maxToRenderPerBatch={8}`, `windowSize={7}`, `removeClippedSubviews`.
2. **Bộ lọc đa tham số & Tìm kiếm tức thì (Multi-Parameter Discovery)**:
   - Tìm kiếm thời gian thực theo tên phòng, mã phòng, từ khóa thiết bị.
   - Lọc theo Tòa nhà VKU: **Khu A, Khu B, Khu C, Khu V**.
   - Lọc theo Sức chứa: **2–6 bạn, 6–12 bạn, 12–20 bạn**.
   - Lọc thiết bị chuyên dụng: **High-spec PC, Projector, Whiteboard, AC, Sound System, Dual Monitors**.
   - Lọc trạng thái trực tiếp: **Chỉ hiển thị phòng trống hiện tại** (Available Now).
3. **Bộ chọn ca học 7 ngày & Động cơ Chống Xung Đột (Conflict Engine)**:
   - Thanh trượt 7 ngày liên tục (`DaySelector`) linh hoạt.
   - 6 ca học 2 tiếng chuẩn campus:
     - `07:30 – 09:30` (Ca 1 Sáng)
     - `09:30 – 11:30` (Ca 2 Sáng)
     - `13:00 – 15:00` (Ca 1 Chiều)
     - `15:00 – 17:00` (Ca 2 Chiều)
     - `17:30 – 19:30` (Ca Tối 1)
     - `19:30 – 21:30` (Ca Tối 2)
   - Khóa và vô hiệu hóa trực quan các ca đã có nhóm khác giữ chỗ trước (chống trùng lịch 100%).
   - Tự động phát hiện và khóa các ca học đã trôi qua trong ngày.
4. **Vé Điện Tử Thông Minh & Giả Lập Check-in QR**:
   - Tự động sinh mã định danh duy nhất (`VKU-ROOM-YYYYMMDD-SX-XXXX`).
   - Kết xuất mã QR thời gian thực bằng `react-native-qrcode-svg`.
   - Nút giả lập check-in tại cửa phòng mở khóa từ và ghi nhận timestamp check-in.
5. **Quản lý State Toàn Cục với Zustand & AsyncStorage**:
   - Quản lý phiên sinh viên đăng nhập (`currentUser`), danh sách đặt phòng (`bookings`).
   - Lưu trữ bền vững offline qua `@react-native-async-storage/async-storage` (dữ liệu không mất khi tắt app).
   - Cơ chế nạp sẵn dữ liệu mẫu (Seed bookings) phục vụ trình diễn và chấm điểm.
6. **Hệ Thống Nhắc Nhở & Thông Báo (Local Reminder & Notifications)**:
   - Tự động tính toán thời gian kích hoạt trước **15 phút** khi ca học bắt đầu (`calculateReminderDate`).
   - Tích hợp rung máy phản hồi xúc giác (`Vibration`) và hộp thoại nhắc nhở trực quan (`Alert`).
   - Hủy thông báo/nhắc nhở tự động khi sinh viên thực hiện hủy đặt phòng.
   - Nút kiểm thử thông báo nhắc nhở trực tiếp trong màn hình Tài khoản (Profile).
   - Tương thích 100% không bị lỗi thiếu native module trên **Expo Go** (Android & iOS).

---

## 📐 Kiến Trúc Module Hóa (Modular & Clean Architecture)

Dự án được thiết kế theo mô hình **Kiến trúc phân tầng (Layered Clean Architecture)** với tính độc lập cao giữa các module, đảm bảo mã nguồn dễ bảo trì, dễ mở rộng và đạt chuẩn công nghiệp:

```text
src/
├── types/          # Domain Models & Type Safety Layer
│   ├── booking.ts  # Types: Room, TimeSlot, Booking, Filter, UserProfile
│   └── navigation.ts# Type-safe Route Param Lists cho Stack & Tabs
│
├── store/          # State Management & Business Logic Layer
│   ├── useBookingStore.ts # Quản lý CRUD đặt phòng, Conflict Engine, AsyncStorage persist
│   └── useFilterStore.ts  # Quản lý bộ lọc tìm kiếm đa tham số độc lập
│
├── data/           # Data Layer
│   └── mockRooms.ts# Dữ liệu 10+ phòng thực hành & lab máy tính tại các khu nhà VKU
│
├── services/       # Infrastructure & Hardware Services Layer
│   └── notificationService.ts # Module quản lý hẹn giờ nhắc trước 15 phút, rung máy & Alert
│
├── utils/          # Pure Utilities Layer (Dễ dàng Unit Test)
│   ├── dateUtils.ts# Xử lý ma trận 7 ngày, ca học 2h, tính toán thời gian nhắc nhở
│   └── qrUtils.ts  # Sinh mã vé định danh duy nhất và payload QR Code
│
├── components/     # UI Component Layer (Module hóa theo Atomic Design)
│   ├── common/     # Các thành phần giao diện dùng chung (Header, Badge, SearchInput, FilterChip)
│   ├── room/       # Các module chuyên biệt cho Phòng học (RoomCard memoized, RoomFilterBar, EquipmentBadge)
│   └── booking/    # Các module chuyên biệt cho Đặt chỗ (DaySelector, TimeSlotGrid, BookingPassModal, BookingItemCard)
│
├── screens/        # Presentation / Screen Layer (7 màn hình)
│   ├── RoomListScreen.tsx       # Khám phá phòng học (FlatList 60fps)
│   ├── RoomDetailScreen.tsx     # Chi tiết phòng & chọn ca học 7 ngày
│   ├── BookingConfirmScreen.tsx # Xác nhận thông tin nhóm & mục đích sử dụng
│   ├── BookingPassScreen.tsx    # Vé điện tử độc lập kèm mã QR
│   ├── MyBookingsScreen.tsx     # Danh sách vé cá nhân & hủy ca
│   ├── CampusMapScreen.tsx      # Bản đồ các tòa nhà A, B, C, V và quy định
│   └── ProfileScreen.tsx        # Hồ sơ sinh viên, đổi tài khoản demo test xung đột
│
├── navigation/     # Navigation & Routing Layer
│   ├── AppNavigator.tsx         # Native Stack Navigator (Hiệu ứng chuyển cảnh gốc)
│   └── TabNavigator.tsx         # Bottom Tab Navigator 4 tabs kèm badge thông báo
│
└── theme/          # Design Tokens Layer
    └── colors.ts   # Bảng màu nhận diện thương hiệu VKU & hệ màu trạng thái
```

### Điểm nổi bật của kiến trúc:
- **Tách biệt mối bận tâm (Separation of Concerns)**: Logic tính toán xung đột giờ học (`Conflict Engine`) nằm hoàn toàn trong Zustand Store, tách biệt với giao diện hiển thị (`TimeSlotGrid`).
- **Module hóa UI Component**: Mỗi component chỉ đảm nhận đúng một nhiệm vụ, các thẻ phòng (`RoomCard`) được đóng gói độc lập và tái sử dụng dễ dàng.
- **Type-Safe 100%**: Sử dụng TypeScript Strict Mode cho toàn bộ Props, State, Navigation Params và Domain Entities.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Setup Instructions)

### 1. Yêu cầu môi trường
- **Node.js**: Phiên bản LTS (v18, v20 hoặc v22+)
- **NPM**: v9+ (hoặc Yarn / Bun)
- **Thiết bị chạy thử**: Điện thoại cài ứng dụng **Expo Go** (Android / iOS) hoặc Trình giả lập.

### 2. Cài đặt các gói phụ thuộc (Dependencies)
Mở Terminal trong thư mục dự án và chạy:

```bash
# Cài đặt toàn bộ thư viện cần thiết
npm install
```

### 3. Kiểm tra tính toàn vẹn của mã nguồn (Kiểm tra lỗi kiểu)
```bash
# Kiểm tra TypeScript typecheck (kỳ vọng 0 lỗi)
npx tsc --noEmit
```

### 4. Khởi chạy ứng dụng Expo

#### Cách A: Chạy trong mạng nội bộ (LAN / Wi-Fi)
```bash
npm start
# hoặc
npx expo start
```

#### Cách B: Chạy chế độ công khai từ xa (Tunnel - Khuyên dùng khi chấm bài)
Chế độ này cho phép giảng viên quét mã QR từ bất kỳ mạng Internet nào (kể cả mạng 4G/Wi-Fi khác):
```bash
npx expo start --tunnel
```

---

## 📱 Trải Nghiệm Ứng Dụng Trên Thiết Bị (Live Demo)

- **Điện thoại Android**:
  1. Mở ứng dụng **Expo Go** trên Android.
  2. Bấm **Scan QR code** và quét mã QR trên màn hình terminal máy tính.
  3. Hoặc bấm **Enter URL manually** và dán đường link dạng `exp://....exp.direct`.
- **Điện thoại iOS (iPhone)**:
  1. Mở ứng dụng **Camera (Máy ảnh)** mặc định của iPhone.
  2. Hướng vào mã QR trên terminal -> Bấm vào thông báo vàng **Open in Expo Go**.
- **Trình duyệt Web máy tính**:
  - Nhấn phím `w` trên terminal để xem phiên bản web.

---

## 🧪 Kịch Bản Kiểm Thử & Thuyết Trình (Demo Walkthrough)

1. **Kiểm tra Hiệu năng cuộn 60fps (FlatList Optimization)**:
   - Vào tab **Khám phá**: Cuộn danh sách phòng với tốc độ cao.
   - Danh sách sử dụng `React.memo` và `getItemLayout` cuộn mượt mà không bị khựng giật hay load lại layout.
2. **Kiểm tra Bộ lọc Đa Tham Số (Multi-Parameter Filtering)**:
   - Nhấn vào các chip lọc: **Khu V**, **Khu B**, **Khu C**, **Khu A**.
   - Bấm vào icon bộ lọc góc phải: Chọn lọc theo nhóm nhỏ (2–6 bạn), máy chiếu, điều hòa...
   - Tìm kiếm thời gian thực: Gõ "AI" hoặc "V.401".
3. **Kiểm tra Động cơ Chống Xung Đột (Conflict Prevention Engine)**:
   - Vào phòng **V.401** ngày hôm nay: Ca **09:30 – 11:30** và **15:00 – 17:00** hiển thị **Màu đỏ (Đã đặt)** có icon ổ khóa và không thể bấm vào.
   - Chọn ca còn trống (Màu xanh lá): Ví dụ ca **13:00 – 15:00** -> Bấm **Tiếp tục**.
   - Điền thông tin nhóm và bấm **Tạo vé QR Check-in**.
   - Sau khi tạo xong, quay lại phòng sẽ thấy ca đó chuyển thành **⭐ Lịch của bạn** (Màu xanh dương).
4. **Kiểm tra Vé QR & Giả Lập Mở Cửa Phòng**:
   - Mở vé vừa tạo: Bấm nút **Giả lập Quét Check-in tại Cửa**.
   - Khóa từ phòng tự động mở, vé chuyển sang trạng thái xanh **Đã Check-in**.
5. **Kiểm tra Chống Xung Đột Chéo (Giữa các sinh viên khác nhau)**:
   - Vào tab **Tài khoản** -> Nhấn chuyển sang sinh viên khác (ví dụ: *Trần Thị Mai*).
   - Quay lại phòng **V.401**: Ca học bạn vừa đặt lúc nãy lập tức chuyển thành **🔒 Đã có người đặt** đối với bạn Mai, bảo đảm không bao giờ xảy ra va chạm lịch trùng phòng!
6. **Kiểm tra Hệ Thống Nhắc Nhở 15 Phút**:
   - Vào tab **Tài khoản** -> Bấm **Kiểm tra Thông báo trước 15 phút** để kiểm tra phản hồi rung và thông báo nhắc nhở tự động.

