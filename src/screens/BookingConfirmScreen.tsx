import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Header } from '../components/common/Header';
import { colors } from '../theme/colors';
import { formatVietnameseDate, TIME_SLOTS } from '../utils/dateUtils';
import { useBookingStore } from '../store/useBookingStore';

type BookingConfirmRouteProp = RouteProp<RootStackParamList, 'BookingConfirm'>;

export const BookingConfirmScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<BookingConfirmRouteProp>();
  const { room, date, slotId } = route.params;

  const currentUser = useBookingStore((state) => state.currentUser);
  const createBooking = useBookingStore((state) => state.createBooking);

  const [purpose, setPurpose] = useState('');
  const [memberCount, setMemberCount] = useState(2);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetSlot = TIME_SLOTS.find((s) => s.id === slotId);

  const handleSubmit = async () => {
    if (!agreedTerms) {
      Alert.alert('Chưa đồng ý quy định', 'Vui lòng xác nhận đồng ý với quy định sử dụng phòng học VKU.');
      return;
    }

    if (!purpose.trim()) {
      Alert.alert('Chưa nhập mục đích', 'Vui lòng nhập ngắn gọn mục đích sử dụng phòng (ví dụ: Học nhóm, Đồ án tốt nghiệp...).');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        room: {
          id: room.id,
          code: room.code,
          name: room.name,
          building: room.building,
          floor: room.floor,
        },
        date,
        slotId,
        purpose: purpose.trim(),
        memberCount,
      });

      setIsSubmitting(false);

      if (!result.success || !result.booking) {
        Alert.alert(
          'Không thể hoàn tất đặt phòng',
          result.error || 'Đã có xung đột khung giờ hoặc lỗi hệ thống. Vui lòng thử lại!'
        );
        return;
      }

      // Success -> navigate to BookingPass screen
      navigation.replace('BookingPass', { booking: result.booking });
    } catch (err: any) {
      setIsSubmitting(false);
      Alert.alert('Lỗi', err.message || 'Có lỗi xảy ra trong quá trình đặt phòng.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Xác nhận đặt phòng"
        subtitle={`${room.code} • ${date}`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Booking Slot Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Thông tin đăng ký</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phòng học:</Text>
            <Text style={styles.infoValueBold}>
              {room.code} – {room.name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vị trí:</Text>
            <Text style={styles.infoValue}>
              Tòa {room.building}, Tầng {room.floor} (Khuôn viên VKU)
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày đăng ký:</Text>
            <Text style={styles.infoValueBold}>{formatVietnameseDate(date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Khung giờ (Ca):</Text>
            <Text style={styles.infoValueHighlight}>
              {targetSlot?.label} ({targetSlot?.shiftName})
            </Text>
          </View>
        </View>

        {/* Student Session Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Thông tin sinh viên đại diện</Text>

          <View style={styles.userRow}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.userName}>{currentUser.fullName}</Text>
              <Text style={styles.userSub}>
                MSSV: {currentUser.studentId} • Lớp: {currentUser.classCode}
              </Text>
              <Text style={styles.userEmail}>{currentUser.email}</Text>
            </View>
          </View>
        </View>

        {/* Additional Reservation Details Form */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Thông tin buổi học nhóm</Text>

          {/* Member count stepper */}
          <View style={styles.stepperSection}>
            <View>
              <Text style={styles.inputLabel}>Số thành viên tham gia</Text>
              <Text style={styles.inputSub}>
                Sức chứa tối đa của phòng: {room.capacity} bạn
              </Text>
            </View>

            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={[
                  styles.stepperBtn,
                  memberCount <= 1 && styles.stepperBtnDisabled,
                ]}
                onPress={() => setMemberCount((c) => Math.max(1, c - 1))}
                disabled={memberCount <= 1}
              >
                <Ionicons name="remove" size={18} color={memberCount <= 1 ? colors.textMuted : colors.primary} />
              </TouchableOpacity>

              <Text style={styles.stepperValue}>{memberCount}</Text>

              <TouchableOpacity
                style={[
                  styles.stepperBtn,
                  memberCount >= room.capacity && styles.stepperBtnDisabled,
                ]}
                onPress={() => setMemberCount((c) => Math.min(room.capacity, c + 1))}
                disabled={memberCount >= room.capacity}
              >
                <Ionicons name="add" size={18} color={memberCount >= room.capacity ? colors.textMuted : colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Purpose Input */}
          <Text style={[styles.inputLabel, { marginTop: 16 }]}>Mục đích sử dụng phòng *</Text>
          <TextInput
            style={styles.textInput}
            value={purpose}
            onChangeText={setPurpose}
            placeholder="Ví dụ: Ôn tập giải thuật, làm bài tập lớn React Native..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Notification Alert Notice */}
        <View style={styles.noticeCard}>
          <Ionicons name="notifications-outline" size={20} color={colors.primary} />
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Hệ thống nhắc nhở tự động</Text>
            <Text style={styles.noticeText}>
              Ứng dụng sẽ gửi thông báo đến điện thoại trước 15 phút khi ca học bắt đầu để bạn kịp di chuyển đến phòng và check-in QR.
            </Text>
          </View>
        </View>

        {/* Terms Agreement */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAgreedTerms(!agreedTerms)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={agreedTerms ? 'checkbox' : 'square-outline'}
            size={22}
            color={agreedTerms ? colors.primary : colors.textMuted}
          />
          <Text style={styles.termsText}>
            Tôi cam kết bảo quản trang thiết bị máy móc, giữ vệ sinh chung và check-in đúng giờ quy định của Nhà trường VKU.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation CTA Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, isSubmitting && styles.confirmBtnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.confirmBtnText}>Xác nhận đặt phòng & Tạo vé QR</Text>
              <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  infoValueBold: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  infoValueHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textMuted,
  },
  stepperSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  inputSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  stepperBtnDisabled: {
    opacity: 0.4,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    fontSize: 13,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    height: 80,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  noticeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 4,
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 14,
  },
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
