import { TimeSlot } from '../types/booking';

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot-1',
    label: '07:30 – 09:30',
    startTime: '07:30',
    endTime: '09:30',
    shiftName: 'Ca 1 Sáng',
  },
  {
    id: 'slot-2',
    label: '09:30 – 11:30',
    startTime: '09:30',
    endTime: '11:30',
    shiftName: 'Ca 2 Sáng',
  },
  {
    id: 'slot-3',
    label: '13:00 – 15:00',
    startTime: '13:00',
    endTime: '15:00',
    shiftName: 'Ca 1 Chiều',
  },
  {
    id: 'slot-4',
    label: '15:00 – 17:00',
    startTime: '15:00',
    endTime: '17:00',
    shiftName: 'Ca 2 Chiều',
  },
  {
    id: 'slot-5',
    label: '17:30 – 19:30',
    startTime: '17:30',
    endTime: '19:30',
    shiftName: 'Ca Tối 1',
  },
  {
    id: 'slot-6',
    label: '19:30 – 21:30',
    startTime: '19:30',
    endTime: '21:30',
    shiftName: 'Ca Tối 2',
  },
];

export interface DayInfo {
  date: string; // YYYY-MM-DD
  dayName: string; // 'Hôm nay', 'Thứ Hai', etc.
  shortDay: string; // 'CN', 'T2', etc.
  dayNumber: string; // '04'
  monthName: string; // 'Thg 10'
  isToday: boolean;
  dateObj: Date;
}

const VI_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const VI_FULL_DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export function formatDateToYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getUpcoming7Days(): DayInfo[] {
  const days: DayInfo[] = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);

    const dateStr = formatDateToYYYYMMDD(d);
    const dayOfWeek = d.getDay();
    const isToday = i === 0;

    days.push({
      date: dateStr,
      dayName: isToday ? 'Hôm nay' : VI_FULL_DAYS[dayOfWeek],
      shortDay: VI_DAYS[dayOfWeek],
      dayNumber: String(d.getDate()).padStart(2, '0'),
      monthName: `Thg ${d.getMonth() + 1}`,
      isToday,
      dateObj: d,
    });
  }

  return days;
}

export function formatVietnameseDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const dayName = VI_FULL_DAYS[dt.getDay()];
    return `${dayName}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
  } catch {
    return dateStr;
  }
}

export function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function isSlotExpired(dateStr: string, startTime: string): boolean {
  const now = new Date();
  const todayStr = formatDateToYYYYMMDD(now);

  if (dateStr < todayStr) return true;
  if (dateStr > todayStr) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const slotMinutes = parseTimeToMinutes(startTime);

  // Consider slot expired if already past start time
  return currentMinutes >= slotMinutes;
}

export function isCurrentlyInSlot(startTime: string, endTime: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);

  return currentMinutes >= start && currentMinutes <= end;
}

export function getCurrentSlot(): TimeSlot | null {
  for (const slot of TIME_SLOTS) {
    if (isCurrentlyInSlot(slot.startTime, slot.endTime)) {
      return slot;
    }
  }
  return null;
}

export function calculateReminderDate(dateStr: string, startTime: string, minutesBefore: number = 15): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [startH, startM] = startTime.split(':').map(Number);

  const slotStart = new Date(y, m - 1, d, startH, startM, 0, 0);
  const reminderTime = new Date(slotStart.getTime() - minutesBefore * 60 * 1000);
  return reminderTime;
}
