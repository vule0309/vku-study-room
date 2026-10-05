import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TIME_SLOTS } from '../../utils/dateUtils';
import { colors } from '../../theme/colors';
import { SlotStatus } from '../../types/booking';
import { useBookingStore } from '../../store/useBookingStore';

interface TimeSlotGridProps {
  roomId: string;
  selectedDate: string;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  roomId,
  selectedDate,
  selectedSlotId,
  onSelectSlot,
}) => {
  const getSlotStatus = useBookingStore((state) => state.getSlotStatus);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Khung giờ 2 tiếng (Ca học)</Text>
        <Text style={styles.subtitle}>Chọn ca còn trống để đăng ký</Text>
      </View>

      {/* Visual Status Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.available }]} />
          <Text style={styles.legendText}>Còn trống</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.occupied }]} />
          <Text style={styles.legendText}>Đã đặt (Khóa)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.textMuted }]} />
          <Text style={styles.legendText}>Đã qua</Text>
        </View>
      </View>

      {/* Grid of 2-Hour Time Slots */}
      <View style={styles.grid}>
        {TIME_SLOTS.map((slot) => {
          const { status, booking } = getSlotStatus(
            roomId,
            selectedDate,
            slot.id,
            slot.startTime
          );

          const isSelected = selectedSlotId === slot.id;
          const isAvailable = status === 'available';
          const isBooked = status === 'booked';
          const isExpired = status === 'expired';
          const isMine = status === 'mine';

          let cardStyle = styles.slotAvailable;
          let textColor = colors.textPrimary;
          let subTextColor = colors.textSecondary;

          if (isBooked) {
            cardStyle = styles.slotBooked;
            textColor = colors.occupied;
            subTextColor = colors.occupied;
          } else if (isExpired) {
            cardStyle = styles.slotExpired;
            textColor = colors.textMuted;
            subTextColor = colors.textMuted;
          } else if (isMine) {
            cardStyle = styles.slotMine;
            textColor = colors.primary;
            subTextColor = colors.primary;
          }

          if (isSelected) {
            cardStyle = styles.slotSelected;
            textColor = '#FFFFFF';
            subTextColor = '#E0F2FE';
          }

          return (
            <TouchableOpacity
              key={slot.id}
              style={[styles.slotCard, cardStyle]}
              onPress={() => {
                if (isAvailable) {
                  onSelectSlot(slot.id);
                }
              }}
              disabled={!isAvailable}
              activeOpacity={0.8}
            >
              <View style={styles.slotHeader}>
                <Text
                  style={[
                    styles.shiftName,
                    { color: subTextColor },
                    isSelected && { color: '#E0F2FE' },
                  ]}
                >
                  {slot.shiftName}
                </Text>

                {isBooked && (
                  <View style={styles.conflictBadge}>
                    <Ionicons name="lock-closed" size={12} color={colors.occupied} />
                    <Text style={styles.conflictText}>Đã đặt</Text>
                  </View>
                )}

                {isExpired && (
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                )}

                {isMine && (
                  <View style={styles.mineBadge}>
                    <Ionicons name="person" size={11} color={colors.primary} />
                    <Text style={styles.mineText}>Của bạn</Text>
                  </View>
                )}

                {isAvailable && !isSelected && (
                  <View style={styles.availableDot} />
                )}

                {isSelected && (
                  <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                )}
              </View>

              <Text
                style={[
                  styles.timeLabel,
                  { color: textColor },
                  isSelected && { color: '#FFFFFF' },
                ]}
              >
                {slot.label}
              </Text>

              <Text
                style={[
                  styles.statusHint,
                  { color: subTextColor },
                  isSelected && { color: '#E0F2FE' },
                ]}
              >
                {isBooked
                  ? `Đang giữ chỗ (${booking?.studentName || 'Sinh viên'})`
                  : isExpired
                  ? 'Hết thời hạn đăng ký'
                  : isMine
                  ? 'Đã xác nhận giữ phòng'
                  : isSelected
                  ? 'Đang chọn ca này'
                  : 'Sẵn sàng đặt chỗ'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  headerRow: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  grid: {
    gap: 10,
    marginTop: 6,
  },
  slotCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
  },
  slotAvailable: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  slotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  slotBooked: {
    backgroundColor: colors.occupiedBg,
    borderColor: colors.occupiedBorder,
    opacity: 0.85,
  },
  slotExpired: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.7,
  },
  slotMine: {
    backgroundColor: '#E0F2FE',
    borderColor: '#7DD3FC',
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  shiftName: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 2,
  },
  statusHint: {
    fontSize: 12,
    marginTop: 2,
  },
  conflictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  conflictText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.occupied,
  },
  mineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#BAE6FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mineText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.available,
  },
});
