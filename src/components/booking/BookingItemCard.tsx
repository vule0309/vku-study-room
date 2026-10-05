import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../../types/booking';
import { colors } from '../../theme/colors';
import { formatVietnameseDate } from '../../utils/dateUtils';
import { Badge } from '../common/Badge';

interface BookingItemCardProps {
  booking: Booking;
  onViewPass: (booking: Booking) => void;
  onCancel: (bookingId: string) => void;
}

export const BookingItemCard: React.FC<BookingItemCardProps> = ({
  booking,
  onViewPass,
  onCancel,
}) => {
  const isCancelled = booking.status === 'cancelled';
  const isCheckedIn = booking.status === 'checked_in';
  const isConfirmed = booking.status === 'confirmed';

  const handleCancelConfirm = () => {
    Alert.alert(
      'Xác nhận hủy đặt phòng',
      `Bạn có chắc chắn muốn hủy lịch đặt phòng ${booking.roomCode} vào ngày ${booking.date} (Ca ${booking.startTime} - ${booking.endTime}) không?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy lịch',
          style: 'destructive',
          onPress: () => onCancel(booking.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, isCancelled && styles.cardCancelled]}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.roomCodeBox}>
          <Text style={styles.roomCodeText}>{booking.roomCode}</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.roomNameText} numberOfLines={1}>
            {booking.roomName}
          </Text>
          <Text style={styles.locationText}>
            Tòa {booking.building} • Tầng {booking.floor}
          </Text>
        </View>

        <Badge
          label={
            isCancelled
              ? 'Đã hủy'
              : isCheckedIn
              ? 'Đã check-in'
              : 'Đã xác nhận'
          }
          variant={
            isCancelled
              ? 'neutral'
              : isCheckedIn
              ? 'available'
              : 'primary'
          }
          size="sm"
        />
      </View>

      {/* Date & Time Slot Information */}
      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={15} color={colors.textSecondary} />
          <Text style={styles.detailText}>{formatVietnameseDate(booking.date)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={15} color={colors.accent} />
          <Text style={styles.timeHighlight}>
            {booking.startTime} – {booking.endTime} ({booking.shiftName})
          </Text>
        </View>
      </View>

      {/* Purpose & Reference */}
      <View style={styles.metaRow}>
        <Text style={styles.purposeText} numberOfLines={1}>
          Mục đích: {booking.purpose || 'Học nhóm đồ án'}
        </Text>
        <Text style={styles.refCodeText}>Ref: {booking.referenceCode}</Text>
      </View>

      {/* Action Buttons */}
      {!isCancelled && (
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={handleCancelConfirm}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={14} color={colors.occupied} style={{ marginRight: 4 }} />
            <Text style={styles.cancelBtnText}>Hủy đặt phòng</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.passBtn}
            onPress={() => onViewPass(booking)}
            activeOpacity={0.8}
          >
            <Ionicons name="qr-code-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.passBtnText}>Mở Thẻ QR</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardCancelled: {
    opacity: 0.6,
    backgroundColor: '#F8FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomCodeBox: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
  },
  roomCodeText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  headerInfo: {
    flex: 1,
    marginRight: 8,
  },
  roomNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    gap: 6,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  timeHighlight: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '700',
  },
  metaRow: {
    marginBottom: 12,
  },
  purposeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  refCodeText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.occupied,
  },
  passBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  passBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
