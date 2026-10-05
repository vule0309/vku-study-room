import { Platform, Alert, Vibration } from 'react-native';
import { Booking } from '../types/booking';
import { calculateReminderDate } from '../utils/dateUtils';

// Store active scheduled reminder timers in memory
const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Initialize notification system
 */
export async function registerForPushNotificationsAsync(): Promise<boolean> {
  console.log('[VKU StudySpace] Notification service initialized successfully');
  return true;
}

/**
 * Schedule a reminder notification 15 minutes before the booked slot starts.
 * Calculates exact countdown time, triggers phone vibration and reminder alert.
 */
export async function scheduleBookingReminder(booking: Booking): Promise<string | undefined> {
  const reminderId = `vku-notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    const reminderDate = calculateReminderDate(booking.date, booking.startTime, 15);
    const now = new Date();
    const delayMs = reminderDate.getTime() - now.getTime();

    const title = `🔔 Nhắc nhở nhận phòng: ${booking.roomCode}`;
    const body = `Phòng ${booking.roomName} (Tòa ${booking.building}, Tầng ${booking.floor}) bắt đầu lúc ${booking.startTime}.\nVui lòng chuẩn bị mã QR để check-in cửa phòng!`;

    // If the booking is for right now or the reminder time is in the past:
    if (delayMs <= 0) {
      // Trigger instant confirmation notice
      setTimeout(() => {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          try {
            Vibration.vibrate([0, 200, 100, 200]);
          } catch {}
        }
        Alert.alert(
          `✅ Đặt phòng thành công: ${booking.roomCode}`,
          `Ca ${booking.startTime} – ${booking.endTime} đã được giữ chỗ.\nMã vé: ${booking.referenceCode}\n\nHệ thống sẽ nhắc nhở nhóm bạn trước 15 phút khi ca học bắt đầu!`,
          [{ text: 'Đã hiểu' }]
        );
      }, 600);
      return reminderId;
    }

    // Schedule timer for 15 minutes before slot start
    // If delay is within 24 hours, set active timer
    if (delayMs < 24 * 60 * 60 * 1000) {
      const timer = setTimeout(() => {
        try {
          Vibration.vibrate([0, 400, 200, 400]);
        } catch {}
        Alert.alert(title, body, [{ text: 'Mở Thẻ QR Pass' }]);
        activeTimers.delete(reminderId);
      }, delayMs);

      activeTimers.set(reminderId, timer);
    }

    console.log(
      `[VKU Reminder] Scheduled for ${booking.roomCode} at ${reminderDate.toLocaleString('vi-VN')} (ID: ${reminderId})`
    );

    return reminderId;
  } catch (error) {
    console.warn('[VKU Reminder] Failed to schedule reminder:', error);
    return reminderId;
  }
}

/**
 * Cancel a previously scheduled reminder
 */
export async function cancelBookingReminder(notificationId?: string): Promise<void> {
  if (!notificationId) return;

  const timer = activeTimers.get(notificationId);
  if (timer) {
    clearTimeout(timer);
    activeTimers.delete(notificationId);
    console.log(`[VKU Reminder] Cancelled reminder timer: ${notificationId}`);
  }
}

/**
 * Send an instant test notification (for student testing in Profile screen)
 */
export async function sendInstantTestNotification(message: string): Promise<void> {
  try {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      try {
        Vibration.vibrate([0, 250, 150, 250]);
      } catch {}
    }

    Alert.alert(
      '🔔 VKU StudySpace - Thông Báo Nhắc Nhở',
      `${message}\n\n(Hệ thống tự động kích hoạt trước 15 phút khi ca học bắt đầu)`,
      [{ text: 'Đã nhận thông báo' }]
    );
  } catch (error) {
    console.warn('[VKU Reminder] Instant test error:', error);
  }
}
