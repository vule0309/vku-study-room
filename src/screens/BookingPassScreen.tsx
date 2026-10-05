import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Header } from '../components/common/Header';
import { Badge } from '../components/common/Badge';
import { colors } from '../theme/colors';
import { formatVietnameseDate } from '../utils/dateUtils';
import { generateQrPayload } from '../../src/utils/qrUtils';
import { useBookingStore } from '../store/useBookingStore';

type BookingPassRouteProp = RouteProp<RootStackParamList, 'BookingPass'>;

export const BookingPassScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<BookingPassRouteProp>();
  const { booking: initialBooking } = route.params;

  const checkInBooking = useBookingStore((state) => state.checkInBooking);
  const bookings = useBookingStore((state) => state.bookings);

  // Keep fresh booking reference from store
  const booking = bookings.find((b) => b.id === initialBooking.id) || initialBooking;
  const isCheckedIn = booking.status === 'checked_in';

  const handleSimulateCheckIn = () => {
    const success = checkInBooking(booking.id);
    if (success) {
      Alert.alert(
        '🎉 Check-in thành công!',
        `Xác nhận quét mã QR tại cảm biến cửa phòng ${booking.roomCode}.\nKhóa từ đã mở cho nhóm của bạn. Chúc bạn học tập hiệu quả tại VKU!`,
        [{ text: 'Đóng' }]
      );
    }
  };

  const qrPayload = generateQrPayload(booking);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Thẻ Ra Vào Kỹ Thuật Số"
        subtitle={`Mã vé: ${booking.referenceCode}`}
        showBack
        onBack={() => navigation.navigate('MainTabs')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Pass Card Container */}
        <View style={styles.passCard}>
          {/* Card Top Brand Header */}
          <View style={styles.passHeader}>
            <View style={styles.logoRow}>
              <View style={styles.vkuLogo}>
                <Text style={styles.vkuLogoText}>VKU</Text>
              </View>
              <View>
                <Text style={styles.passTitle}>VKU STUDYSPACE PASS</Text>
                <Text style={styles.passSub}>Thẻ thông minh mở cửa phòng tự học</Text>
              </View>
            </View>

            <Badge
              label={isCheckedIn ? 'Đã Check-in' : 'Chưa Check-in'}
              variant={isCheckedIn ? 'available' : 'accent'}
              size="sm"
            />
          </View>

          {/* Room Details */}
          <View style={styles.roomSection}>
            <View style={styles.roomCodeBox}>
              <Text style={styles.roomCodeText}>{booking.roomCode}</Text>
            </View>
            <View style={styles.roomInfo}>
              <Text style={styles.roomName}>{booking.roomName}</Text>
              <Text style={styles.roomMeta}>
                Tòa {booking.building} • Tầng {booking.floor} • {booking.memberCount} thành viên
              </Text>
            </View>
          </View>

          {/* Date & Shift Details Grid */}
          <View style={styles.detailGrid}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>NGÀY SỬ DỤNG</Text>
              <Text style={styles.detailVal}>{formatVietnameseDate(booking.date)}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>CA ĐẶT CHỖ</Text>
              <Text style={styles.detailValHighlight}>
                {booking.startTime} – {booking.endTime}
              </Text>
              <Text style={styles.detailShift}>({booking.shiftName})</Text>
            </View>
          </View>

          {/* Student Session Details */}
          <View style={styles.studentSection}>
            <View style={styles.studentRow}>
              <Ionicons name="person-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.studentName}>
                {booking.studentName} ({booking.studentId})
              </Text>
            </View>
            <Text style={styles.purposeText} numberOfLines={2}>
              Mục đích: {booking.purpose}
            </Text>
          </View>

          {/* Notch Perforation Divider */}
          <View style={styles.perforationWrapper}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <Text style={styles.qrPrompt}>
              Quét mã QR tại cửa phòng {booking.roomCode} để mở khóa từ
            </Text>

            <View style={styles.qrContainer}>
              <QRCode
                value={qrPayload}
                size={190}
                color="#0F172A"
                backgroundColor="#FFFFFF"
              />
            </View>

            <Text style={styles.refLabel}>MÃ ĐẶT CHỖ HỆ THỐNG</Text>
            <Text style={styles.refCode}>{booking.referenceCode}</Text>
          </View>

          {/* Check-in CTA Button */}
          <View style={styles.actionSection}>
            {isCheckedIn ? (
              <View style={styles.checkedInBox}>
                <Ionicons name="checkmark-done-circle" size={26} color={colors.available} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkedInTitle}>Cửa phòng đã mở thành công</Text>
                  <Text style={styles.checkedInTime}>
                    Đã check-in lúc:{' '}
                    {booking.checkedInAt
                      ? new Date(booking.checkedInAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
                      : 'Vừa xong'}
                  </Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.checkInBtn}
                onPress={handleSimulateCheckIn}
                activeOpacity={0.8}
              >
                <Ionicons name="scan" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.checkInBtnText}>Giả lập Quét Check-in tại Cửa</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Back to Discovery Feed */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('MainTabs')}
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.homeBtnText}>Quay lại danh sách phòng học</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  passCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
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
  vkuLogo: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  vkuLogoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  passTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  passSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  roomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  roomCodeBox: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  roomCodeText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roomMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  detailValHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
    marginTop: 2,
  },
  detailShift: {
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
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  purposeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
  perforationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    backgroundColor: colors.surface,
  },
  notchLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    marginLeft: -12,
    borderRightWidth: 1,
    borderRightColor: colors.border,
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
    backgroundColor: colors.background,
    marginRight: -12,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  qrSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  qrPrompt: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  qrContainer: {
    padding: 14,
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
  refLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  refCode: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
  },
  checkInBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  checkedInBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.availableBg,
    borderWidth: 1,
    borderColor: colors.availableBorder,
    padding: 12,
    borderRadius: 14,
    gap: 10,
  },
  checkedInTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.available,
  },
  checkedInTime: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    width: '100%',
    maxWidth: 380,
  },
  homeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});
