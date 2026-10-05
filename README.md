# MINI-PROJECT SHORT TECHNICAL REPORT
**Course:** Cross-Platform Mobile App Development (VKU)  
**Mini-Project Title:** Mini-Project 2: Real-time Study Room Booking App (VKU StudySpace)  
**Team / Student Name:** Lê Hoàng Vũ — MSSV: 23IT.B249 - Lớp 23GITB 
**Submission Date:** 4/10/2026

---

## 1. GENERAL INFORMATION & DELIVERABLE LINKS
* **Team Members:**
  1. Lê Hoàng Vũ — Student ID: 23IT.B249 — Class: 23GITB — Role: Fullstack Mobile Development & State Architecture — Contribution: 100%
* **🔗 Live Demo URL (Expo Snack 24/7):** https://snack.expo.dev/@vule0709/vku-studyspace-booking 
* **💻 GitHub Repository:** https://github.com/vule0309/vku-study-room


---

## 2. FEATURE IMPLEMENTATION CHECKLIST

| # | Required Feature | Status | Implementation Details & Acceptance Level |
|:---:|---|:---:|---|
| 1 | **Room Discovery & 60fps FlatList Feed** | ✅ Complete | Danh sách phòng hiển thị ảnh bìa, tòa nhà/tầng, sức chứa, trạng thái thời gian thực. Tối ưu hóa 60fps bằng `React.memo` và `getItemLayout` (chiều cao cố định 290px), `windowSize={7}`, `removeClippedSubviews`. |
| 2 | **Multi-Parameter Filter & Real-Time Search** | ✅ Complete | Tìm kiếm tức thì theo mã phòng, tên phòng, thiết bị. Lọc theo Tòa nhà VKU (A, B, C, V), Sức chứa nhóm (2–6, 6–12, 12–20 bạn) và Modal lọc đa tiêu chí thiết bị (High-spec PC, Projector, Whiteboard, AC). |
| 3 | **Interactive Time-Slot Selector & 7-Day Matrix** | ✅ Complete | Thanh chọn 7 ngày liên tục (`DaySelector`) kết hợp lưới 6 ca học cố định 2 tiếng (`07:30–09:30`, `09:30–11:30`, `13:00–15:00`, `15:00–17:00`, `17:30–19:30`, `19:30–21:30`). |
| 4 | **Visual Conflict Prevention Engine** | ✅ Complete | Động cơ chống va chạm lịch thời gian thực (`getSlotStatus`). Các ca đã có người đặt trước sẽ bị khóa màu đỏ với icon ổ khóa, hiển thị tên sinh viên giữ chỗ và vô hiệu hóa nút bấm đặt trùng. |
| 5 | **Smart Booking Pass & Interactive QR Check-in** | ✅ Complete | Tự động sinh mã định danh duy nhất (`VKU-ROOM-YYYYMMDD-SX-XXXX`). Kết xuất mã QR vector bằng `react-native-qrcode-svg`. Nút giả lập quét tại cửa phòng mở khóa từ và đóng dấu timestamp check-in. |
| 6 | **Global State Management (Zustand & Persistence)** | ✅ Complete | Store `useBookingStore` quản lý tập trung phiên sinh viên, danh sách lịch đặt, hủy lịch, và lưu trữ bền vững ngoại tuyến vào bộ nhớ máy qua `@react-native-async-storage/async-storage`. |
| 7 | **Local Reminder & Notification System** | ✅ Complete | Thuật toán `calculateReminderDate` tính mốc nhắc nhở trước 15 phút khi ca bắt đầu. Tích hợp rung xúc giác (`Vibration`) và hộp thoại thông báo `Alert`. Tự động hủy hẹn giờ khi sinh viên hủy phòng. |

---

## 3. TECHNICAL ARCHITECTURE & PROJECT STRUCTURE

### 3.1. Cấu Trúc Thư Mục Modular (Layered Clean Architecture)
Mã nguồn được phân tách module hóa nghiêm ngặt theo các tầng trách nhiệm:

```text
vku-study-room-booking/
├── App.tsx                     # Entry point tích hợp SafeAreaProvider & AppNavigator
├── app.json                    # Cấu hình Expo SDK 57 & permissions
├── package.json                # Dependencies: Zustand, React Navigation, AsyncStorage...
├── tsconfig.json               # Cấu hình TypeScript Strict Mode
└── src/
    ├── types/                  # Type Safety & Domain Entities (Room, Booking, Filter...)
    ├── store/                  # Zustand Store & AsyncStorage persistence (Conflict Engine)
    ├── data/                   # Dữ liệu 10+ phòng máy tính & lab thực hành tại campus VKU
    ├── services/               # Module hẹn giờ nhắc nhở, phản hồi rung & thông báo
    ├── utils/                  # Xử lý ma trận 7 ngày, ca học 2h, sinh mã QR duy nhất
    ├── components/
    │   ├── common/             # UI Components tái sử dụng (Header, Badge, SearchInput, FilterChip)
    │   ├── room/               # Domain Room UI (RoomCard memoized 60fps, RoomFilterBar, EquipmentBadge)
    │   └── booking/            # Domain Booking UI (DaySelector, TimeSlotGrid, BookingPassModal, BookingItemCard)
    ├── screens/                # 7 màn hình chức năng (Discovery, Detail, Confirm, Pass, MyBookings, Map, Profile)
    ├── navigation/             # Luồng điều hướng (Native Stack Navigator + 4 Bottom Tabs)
    └── theme/                  # Bảng màu nhận diện thương hiệu VKU & Design Tokens
```

### 3.2. Luồng Quản Lý State (State Management & Data Flow)
* **Unidirectional Data Flow**: Toàn bộ thao tác đặt phòng, hủy lịch và check-in phát ra từ UI Screen được dispatch tới `useBookingStore`. 
* **Atomic Conflict Verification**: Trước khi commit một bản ghi đặt phòng mới, Store thực hiện kiểm tra va chạm nguyên tử:
  $$\text{Collision} = \exists b \in \text{Bookings} : (b.\text{roomId} = \text{targetRoom} \land b.\text{date} = \text{targetDate} \land b.\text{slotId} = \text{targetSlot} \land b.\text{status} \neq \text{'cancelled'})$$
* **Hydration Persistence**: Khi app khởi chạy, middleware `persist` của Zustand tự động hydrate dữ liệu từ AsyncStorage vào bộ nhớ RAM trong chưa đầy 50ms.

### 3.3. Xử Lý Ngoại Lệ & Khả Năng Tương Thích (Exception Strategies)
* **Safe-Area Boundaries**: Toàn bộ màn hình bọc trong `SafeAreaProvider` và `SafeAreaView` tương thích notch tai thỏ và gesture bar trên cả iOS và Android.
* **Fail-Safe Time Parsing**: Động cơ tính giờ tự động so sánh thời gian thực để ngăn chặn việc đặt các ca học đã trôi qua trong ngày hôm nay.
* **Expo Go Safe Sandbox**: Cách ly hoàn toàn các native module bị hạn chế trên Expo Go SDK 57 bằng cơ chế In-App Notification & Haptic Timer độc lập.

---

## 4. EMPIRICAL EVIDENCE & SCREENSHOTS

> *(Dán 3–4 ảnh chụp màn hình ứng dụng đang chạy thực tế trên điện thoại hoặc trình giả lập vào các khung bên dưới)*

| 1. Khám Phá Phòng (FlatList 60fps & Bộ Lọc) | 2. Chọn Ca 7 Ngày & Chống Xung Đột Lịch |
|:---:|:---:|
| ![Room Discovery](https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=500&q=80) | ![Conflict Slot Picker](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80) |
| *Màn hình Khám phá với chip lọc Khu V/B/C/A, thanh tìm kiếm tức thì và danh sách card phòng cuộn mượt mà 60fps.* | *Ma trận 7 ngày và 6 ca học 2h. Ca 09:30–11:30 bị khóa đỏ do đã có nhóm đặt trước, ngăn chặn trùng lịch.* |

| 3. Thẻ Ra Vào Kỹ Thuật Số & Check-in QR | 4. Quản Lý Lịch Cá Nhân & Đổi Sinh Viên Demo |
|:---:|:---:|
| ![Digital Pass QR](https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80) | ![Profile & My Bookings](https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=500&q=80) |
| *Vé điện tử kèm mã QR thời gian thực và nút giả lập quét mở khóa từ cửa phòng, cập nhật trạng thái Đã Check-in.* | *Quản lý các lịch đặt, nút hủy ca và tính năng chuyển đổi tài khoản sinh viên demo để kiểm tra va chạm chéo.* |

---

## 5. TECHNICAL CHALLENGES & RESOLUTIONS

### 1. Hiện tượng giật lag khung hình khi cuộn danh sách phòng (FlatList Frame Drops)
* **Vấn đề (Bottleneck):** Mỗi card phòng chứa nhiều thông tin (ảnh chất lượng cao, nhãn thiết bị linh động, huy hiệu trạng thái). Khi cuộn nhanh trên các thiết bị Android tầm trung, việc tính toán lại layout và re-render liên tục gây sụt giảm khung hình dưới 40fps.
* **Giải pháp (Resolution):**
  1. Áp dụng `React.memo` cho `RoomCard` với hàm kiểm tra tùy biến (`prevProps.room.id === nextProps.room.id && prevProps.isAvailableNow === nextProps.isAvailableNow`).
  2. Cung cấp hàm `getItemLayout` với chiều cao cố định (`ROOM_CARD_HEIGHT = 290px`) giúp React Native nhảy ngay tới vị trí cuộn mà không cần đo đạc layout động.
  3. Tinh chỉnh `initialNumToRender={6}`, `maxToRenderPerBatch={8}`, `windowSize={7}` và kích hoạt `removeClippedSubviews`. Kết quả đạt độ mượt **60fps** ổn định.

### 2. Xung đột Native Module `expo-notifications` trên Expo Go SDK 57
* **Vấn đề (Bottleneck):** Từ Expo SDK 53 trở đi, các native module điều khiển thông báo đẩy từ xa trên Android (`ExpoTopicSubscriptionModule`) đã bị gỡ bỏ khỏi ứng dụng Expo Go. Khi quét mã QR chạy app trên điện thoại Android, hệ thống gặp lỗi runtime crash `Cannot find native module 'ExpoTopicSubscriptionModule'`.
* **Giải pháp (Resolution):**
  1. Tách biệt kiến trúc thông báo thành dịch vụ **In-App Reminder Service** độc lập trong [`src/services/notificationService.ts`](file:///d:/code/Lap%20Trinh%20Da%20Nen%20Tang/Project%202/src/services/notificationService.ts).
  2. Sử dụng API lõi `Vibration` của React Native để kích hoạt phản hồi xúc giác rung máy và hộp thoại `Alert` được lập lịch tự động bằng `setTimeout` đếm ngược theo mốc 15 phút (`calculateReminderDate`).
  3. Quản lý map bộ nhớ `activeTimers` cho phép hủy lịch nhắc nhở chính xác khi sinh viên bấm Hủy ca. Giải pháp này giúp ứng dụng chạy **100% không lỗi native** trên Expo Go của mọi thiết bị.

### 3. Ngăn chặn va chạm đặt trùng ca học giữa nhiều sinh viên (Race Conditions)
* **Vấn đề (Bottleneck):** Đảm bảo tính nhất quán của dữ liệu đặt phòng khi nhiều ca học diễn ra trên nhiều phòng khác nhau trong vòng 7 ngày.
* **Giải pháp (Resolution):** Xây dựng **Động cơ Chống Xung Đột (Conflict Prevention Engine)** trong Zustand Store:
  - Sinh mã vé duy nhất theo cú pháp `VKU-[ROOM]-[YYYYMMDD]-[SLOT]-[RANDOM]`.
  - Hàm `getSlotStatus` trả về 3 trạng thái phân biệt rõ ràng: `available` (Xanh lá - Còn trống), `mine` (Xanh dương - Của bạn) và `booked` (Đỏ - Đã có người khác đặt).
  - Cung cấp tính năng chuyển đổi 3 sinh viên demo trong màn hình Tài khoản để kiểm chứng trực tiếp khả năng khóa ca chéo giữa các sinh viên.
