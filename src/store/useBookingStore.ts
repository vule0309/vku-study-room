import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, BookingStatus, SlotStatus, UserProfile } from '../types/booking';
import { TIME_SLOTS, formatDateToYYYYMMDD, getCurrentSlot, isSlotExpired } from '../utils/dateUtils';
import { generateBookingReference } from '../utils/qrUtils';
import { scheduleBookingReminder, cancelBookingReminder } from '../services/notificationService';

export const DEFAULT_USER: UserProfile = {
  id: 'usr-vku-01',
  studentId: '22IT108',
  fullName: 'Nguyễn Văn An',
  email: 'annv.22it@vku.udn.vn',
  faculty: 'Khoa Khoa học Máy tính',
  classCode: '22IT3',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
};

export const DEMO_STUDENTS: UserProfile[] = [
  DEFAULT_USER,
  {
    id: 'usr-vku-02',
    studentId: '21IT045',
    fullName: 'Trần Thị Mai',
    email: 'maitt.21it@vku.udn.vn',
    faculty: 'Khoa Kỹ thuật Mạng & An toàn Thông tin',
    classCode: '21IT1',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'usr-vku-03',
    studentId: '23BA012',
    fullName: 'Lê Hoàng Nam',
    email: 'namlh.23ba@vku.udn.vn',
    faculty: 'Khoa Kinh tế Số & Thương mại Điện tử',
    classCode: '23BA2',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  },
];

// Helper to generate seed campus reservations around today & upcoming days
function generateInitialSeedBookings(): Booking[] {
  const today = new Date();
  const todayStr = formatDateToYYYYMMDD(today);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = formatDateToYYYYMMDD(tomorrow);

  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);
  const dayAfterStr = formatDateToYYYYMMDD(dayAfter);

  return [
    {
      id: 'seed-bk-1',
      referenceCode: 'VKU-V401-202610-S2-8821',
      roomId: 'room-v401',
      roomCode: 'V.401',
      roomName: 'AI & Data Innovation Hub',
      building: 'V',
      floor: 4,
      date: todayStr,
      slotId: 'slot-2',
      startTime: '09:30',
      endTime: '11:30',
      shiftName: 'Ca 2 Sáng',
      studentId: '21IT099',
      studentName: 'Trần Quang Huy',
      studentEmail: 'huytq.21it@vku.udn.vn',
      purpose: 'Training mô hình Deep Learning đồ án tốt nghiệp',
      memberCount: 6,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    },
    {
      id: 'seed-bk-2',
      referenceCode: 'VKU-V401-202610-S4-4192',
      roomId: 'room-v401',
      roomCode: 'V.401',
      roomName: 'AI & Data Innovation Hub',
      building: 'V',
      floor: 4,
      date: todayStr,
      slotId: 'slot-4',
      startTime: '15:00',
      endTime: '17:00',
      shiftName: 'Ca 2 Chiều',
      studentId: '20IT104',
      studentName: 'Lê Minh Quân',
      studentEmail: 'quanlm.20it@vku.udn.vn',
      purpose: 'Lab thực hành Computer Vision',
      memberCount: 8,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    },
    {
      id: 'seed-bk-3',
      referenceCode: 'VKU-B305-202610-S3-5510',
      roomId: 'room-b305',
      roomCode: 'B.305',
      roomName: 'Software Engineering Lab',
      building: 'B',
      floor: 3,
      date: todayStr,
      slotId: 'slot-3',
      startTime: '13:00',
      endTime: '15:00',
      shiftName: 'Ca 1 Chiều',
      studentId: '22IT012',
      studentName: 'Hoàng Hải Đăng',
      studentEmail: 'danghh.22it@vku.udn.vn',
      purpose: 'Họp Sprint nhóm đề án React Native & Cloud',
      memberCount: 5,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    },
    {
      id: 'seed-bk-4',
      referenceCode: 'VKU-A201-202610-S3-9012',
      roomId: 'room-a201',
      roomCode: 'A.201',
      roomName: 'Executive Seminar Room',
      building: 'A',
      floor: 2,
      date: tomorrowStr,
      slotId: 'slot-3',
      startTime: '13:00',
      endTime: '15:00',
      shiftName: 'Ca 1 Chiều',
      studentId: '22IT108', // Current user's booking for demo
      studentName: 'Nguyễn Văn An',
      studentEmail: 'annv.22it@vku.udn.vn',
      purpose: 'Thuyết trình Đề tài NCKH Sinh viên cấp trường',
      memberCount: 12,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    },
    {
      id: 'seed-bk-5',
      referenceCode: 'VKU-C204-202610-S1-3319',
      roomId: 'room-c204',
      roomCode: 'C.204',
      roomName: 'IoT & Smart Device Prototyping',
      building: 'C',
      floor: 2,
      date: dayAfterStr,
      slotId: 'slot-1',
      startTime: '07:30',
      endTime: '09:30',
      shiftName: 'Ca 1 Sáng',
      studentId: '21ET033',
      studentName: 'Phạm Đức Trọng',
      studentEmail: 'trongpd.21et@vku.udn.vn',
      purpose: 'Kiểm thử mạch cảm biến Lora Gateway',
      memberCount: 4,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    },
  ];
}

export interface BookingState {
  currentUser: UserProfile;
  bookings: Booking[];
  hasInitializedSeed: boolean;

  // Actions
  setUser: (user: UserProfile) => void;
  createBooking: (params: {
    room: {
      id: string;
      code: string;
      name: string;
      building: any;
      floor: number;
    };
    date: string;
    slotId: string;
    purpose: string;
    memberCount: number;
  }) => Promise<{ success: boolean; booking?: Booking; error?: string }>;

  cancelBooking: (bookingId: string) => Promise<boolean>;
  checkInBooking: (bookingId: string) => boolean;

  // Queries / Conflict engine helpers
  getSlotStatus: (
    roomId: string,
    date: string,
    slotId: string,
    startTime: string
  ) => {
    status: SlotStatus;
    booking?: Booking;
  };

  isRoomAvailableNow: (roomId: string) => boolean;
  getActiveBookingsForUser: () => Booking[];
  resetToDefaultSeed: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      currentUser: DEFAULT_USER,
      bookings: generateInitialSeedBookings(),
      hasInitializedSeed: true,

      setUser: (user) => set({ currentUser: user }),

      createBooking: async ({ room, date, slotId, purpose, memberCount }) => {
        const { bookings, currentUser } = get();

        // 1. Conflict Prevention Check
        const targetSlot = TIME_SLOTS.find((s) => s.id === slotId);
        if (!targetSlot) {
          return { success: false, error: 'Khung giờ không hợp lệ.' };
        }

        // Check if expired
        if (isSlotExpired(date, targetSlot.startTime)) {
          return {
            success: false,
            error: 'Khung giờ này đã trôi qua. Vui lòng chọn ca học khác.',
          };
        }

        // Check collision against existing active bookings
        const existingCollision = bookings.find(
          (b) =>
            b.roomId === room.id &&
            b.date === date &&
            b.slotId === slotId &&
            b.status !== 'cancelled'
        );

        if (existingCollision) {
          return {
            success: false,
            error: `Khung giờ ${targetSlot.label} ngày ${date} tại phòng ${room.code} đã có người đặt trước! Vui lòng chọn khung giờ khác.`,
          };
        }

        // 2. Generate unique booking pass reference
        const referenceCode = generateBookingReference(room.code, date, slotId);
        const newBookingId = `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newBooking: Booking = {
          id: newBookingId,
          referenceCode,
          roomId: room.id,
          roomCode: room.code,
          roomName: room.name,
          building: room.building,
          floor: room.floor,
          date,
          slotId,
          startTime: targetSlot.startTime,
          endTime: targetSlot.endTime,
          shiftName: targetSlot.shiftName,
          studentId: currentUser.studentId,
          studentName: currentUser.fullName,
          studentEmail: currentUser.email,
          purpose,
          memberCount,
          createdAt: new Date().toISOString(),
          status: 'confirmed',
        };

        // 3. Schedule 15-min reminder notification
        try {
          const notificationId = await scheduleBookingReminder(newBooking);
          if (notificationId) {
            newBooking.notificationId = notificationId;
          }
        } catch (err) {
          console.warn('Failed to schedule reminder notification:', err);
        }

        // 4. Save to store
        set((state) => ({
          bookings: [newBooking, ...state.bookings],
        }));

        return { success: true, booking: newBooking };
      },

      cancelBooking: async (bookingId: string) => {
        const { bookings } = get();
        const target = bookings.find((b) => b.id === bookingId);
        if (!target) return false;

        // Cancel scheduled notification
        if (target.notificationId) {
          await cancelBookingReminder(target.notificationId);
        }

        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' as BookingStatus } : b
          ),
        }));

        return true;
      },

      checkInBooking: (bookingId: string) => {
        const { bookings } = get();
        const target = bookings.find((b) => b.id === bookingId);
        if (!target || target.status === 'cancelled') return false;

        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  status: 'checked_in' as BookingStatus,
                  checkedInAt: new Date().toISOString(),
                }
              : b
          ),
        }));

        return true;
      },

      getSlotStatus: (roomId: string, date: string, slotId: string, startTime: string) => {
        const { bookings, currentUser } = get();

        // 1. Check if past
        if (isSlotExpired(date, startTime)) {
          return { status: 'expired' as SlotStatus };
        }

        // 2. Check collision with confirmed or checked_in bookings
        const existing = bookings.find(
          (b) =>
            b.roomId === roomId &&
            b.date === date &&
            b.slotId === slotId &&
            b.status !== 'cancelled'
        );

        if (!existing) {
          return { status: 'available' as SlotStatus };
        }

        // Check if current user booked it
        if (existing.studentId === currentUser.studentId) {
          return { status: 'mine' as SlotStatus, booking: existing };
        }

        return { status: 'booked' as SlotStatus, booking: existing };
      },

      isRoomAvailableNow: (roomId: string) => {
        const currentSlot = getCurrentSlot();
        if (!currentSlot) {
          // Outside study shifts (e.g. night hours or between shifts) -> default available
          return true;
        }

        const todayStr = formatDateToYYYYMMDD(new Date());
        const { bookings } = get();

        const activeBooking = bookings.find(
          (b) =>
            b.roomId === roomId &&
            b.date === todayStr &&
            b.slotId === currentSlot.id &&
            b.status !== 'cancelled'
        );

        return !activeBooking;
      },

      getActiveBookingsForUser: () => {
        const { bookings, currentUser } = get();
        return bookings.filter(
          (b) =>
            b.studentId === currentUser.studentId &&
            b.status !== 'cancelled'
        );
      },

      resetToDefaultSeed: () => {
        set({
          bookings: generateInitialSeedBookings(),
          currentUser: DEFAULT_USER,
        });
      },
    }),
    {
      name: 'vku-booking-storage-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
