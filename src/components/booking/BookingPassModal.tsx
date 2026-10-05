import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../../types/booking';
import { colors } from '../../theme/colors';
import { formatVietnameseDate } from '../../utils/dateUtils';
import { generateQrPayload } from '../../utils/qrUtils';
import { useBookingStore } from '../../store/useBookingStore';
import { Badge } from '../common/Badge';

interface BookingPassModalProps {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export const BookingPassModal: React.FC<BookingPassModalProps> = ({
  visible,
  booking,
  onClose,
}) => {
  const [isCheckedInAnimation, setIsCheckedInAnimation] = useState(false);
  const checkInBooking = useBookingStore((state) => state.checkInBooking);

  if (!booking) return null;

  const qrPayload = generateQrPayload(booking);
  const isCheckedIn = booking.status === 'checked_in' || isCheckedInAnimation;

  const handleSimulateCheckIn = () => {
    const success = checkInBooking(booking.id);
    if (success) {
      setIsCheckedInAnimation(true);
      Alert.alert(
        '🎉 Check-in thành công!',
        `Xác nhận quét mã QR tại cảm biến cửa phòng ${booking.roomCode}.\nKhóa từ đã mở cho nhóm của bạn. Chúc bạn học tập hiệu quả tại VKU!`,
        [{ text: 'Hoàn tất' }]
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalContent}>
            {/* Header Close button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <ScrollView
              contentContainerStyle={styles.scrollPass}
              showsVerticalScrollIndicator={false}
            >
              {/* VKU DIGITAL PASS CARD */}
              <View style={styles.passCard}>
                {/* Pass Card Top Header */}
                <View style={styles.passHeader}>
                  <View style={styles.logoRow}>
                    <View style={styles.logoBadge}>
                      <Text style={styles.logoText}>VKU</Text>
                    </View>
                    <View>
                      <Text style={styles.passBrand}>VKU STUDYSPACE PASS</Text>
                      <Text style={styles.passSubBrand}>Thẻ ra vào phòng tự học & Lab</Text>
                    </View>
                  </View>

                  <Badge
                    label={isCheckedIn ? 'Đã Check-in' : 'Chưa Check-in'}
                    variant={isCheckedIn ? 'available' : 'accent'}
                    size="sm"
                  />
                </View>

                {/* Room Info */}
                <View style={styles.roomSection}>
                  <View style={styles.roomCodeBox}>
                    <Text style={styles.roomCodeText}>{booking.roomCode}</Text>
                  </View>
                  <View style={styles.roomMeta}>
                    <Text style={styles.roomNameText} numberOfLines={2}>
                      {booking.roomName}
                    </Text>
                    <Text style={styles.locationText}>
                      Tòa {booking.building} • Tầng {booking.floor} • Sức chứa {booking.memberCount} bạn
                    </Text>
                  </View>
                </View>

                {/* Time & Date Row */}
                <View style={styles.metaGrid}>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>NGÀY SỬ DỤNG</Text>
                    <Text style={styles.metaValue}>{formatVietnameseDate(booking.date)}</Text>
                  </View>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>CA HỌC / THỜI GIAN</Text>
                    <Text style={styles.metaValueHighlight}>
                      {booking.startTime} – {booking.endTime}
                    </Text>
                    <Text style={styles.shiftLabel}>({booking.shiftName})</Text>
                  </View>
                </View>

                {/* Student Info */}
                <View style={styles.studentSection}>
                  <View style={styles.studentRow}>
                    <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
                    <Text style={styles.studentName}>
                      {booking.studentName} ({booking.studentId})
                    </Text>
                  </View>
                  <Text style={styles.purposeText} numberOfLines={2}>
                    Mục đích: {booking.purpose || 'Học nhóm đồ án môn học'}
                  </Text>
                </View>

                {/* Perforation / Ticket Notch Divider */}
                <View style={styles.perforationWrapper}>
                  <View style={styles.notchLeft} />
                  <View style={styles.dashedLine} />
                  <View style={styles.notchRight} />
                </View>

                {/* QR Code Section */}
                <View style={styles.qrSection}>
                  <Text style={styles.qrInstruction}>
                    Đưa mã này vào camera quét cửa phòng hoặc máy quét bảo vệ
                  </Text>

                  <View style={styles.qrContainer}>
                    <QRCode
                      value={qrPayload}
                      size={180}
                      color="#0F172A"
                      backgroundColor="#FFFFFF"
                    />
                  </View>

                  <Text style={styles.refCodeLabel}>MÃ XÁC THỰC</Text>
                  <Text style={styles.refCodeValue}>{booking.referenceCode}</Text>
                </View>

                {/* Interactive Check-in Button */}
                <View style={styles.actionContainer}>
                  {isCheckedIn ? (
                    <View style={styles.checkedInBanner}>
                      <Ionicons name="checkmark-done-circle" size={24} color={colors.available} />
                      <View>
                        <Text style={styles.checkedInBannerTitle}>Đã xác thực ra vào</Text>
                        <Text style={styles.checkedInBannerSub}>
                          Cửa phòng đã mở lúc {booking.checkedInAt ? new Date(booking.checkedInAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong'}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.checkInButton}
                      onPress={handleSimulateCheckIn}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="scan-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={styles.checkInButtonText}>Giả lập Quét Check-in tại cửa</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    width: '100%',
    flex: 1,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scrollPass: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  passCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  passHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  passBrand: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  passSubBrand: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  roomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  roomCodeBox: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomCodeText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  roomMeta: {
    flex: 1,
  },
  roomNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metaGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metaValueHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  shiftLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  studentSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  purposeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  perforationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  notchLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    marginLeft: -12,
  },
  dashedLine: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  notchRight: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    marginRight: -12,
  },
  qrSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  qrInstruction: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  qrContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  refCodeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  refCodeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
  },
  checkInButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  checkedInBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.availableBg,
    borderWidth: 1,
    borderColor: colors.availableBorder,
    padding: 12,
    borderRadius: 14,
    gap: 12,
  },
  checkedInBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.available,
  },
  checkedInBannerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
