import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore, DEMO_STUDENTS } from '../store/useBookingStore';
import { Header } from '../components/common/Header';
import { colors } from '../theme/colors';
import { sendInstantTestNotification } from '../services/notificationService';

export const ProfileScreen: React.FC = () => {
  const currentUser = useBookingStore((state) => state.currentUser);
  const setUser = useBookingStore((state) => state.setUser);
  const bookings = useBookingStore((state) => state.bookings);
  const resetToDefaultSeed = useBookingStore((state) => state.resetToDefaultSeed);

  // Stats calculation
  const myBookings = bookings.filter((b) => b.studentId === currentUser.studentId);
  const activeCount = myBookings.filter((b) => b.status === 'confirmed').length;
  const checkedInCount = myBookings.filter((b) => b.status === 'checked_in').length;

  const handleTestNotification = async () => {
    try {
      await sendInstantTestNotification(
        '🔔 VKU StudySpace: Bạn có ca học phòng V.401 trong 15 phút nữa! Vui lòng chuẩn bị mã QR check-in.'
      );
      Alert.alert(
        'Đã gửi thông báo thử nghiệm',
        'Một thông báo local push đã được kích hoạt. Hãy kiểm tra thanh thông báo (Notification Bar) của thiết bị.'
      );
    } catch (e: any) {
      Alert.alert('Thông báo', 'Không thể kích hoạt thông báo push trên môi trường này.');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Đặt lại dữ liệu mẫu',
      'Hành động này sẽ khôi phục danh sách các phòng và các ca đặt phòng ban đầu để bạn kiểm tra tính năng chống xung đột (Conflict Engine).',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đặt lại',
          style: 'destructive',
          onPress: () => {
            resetToDefaultSeed();
            Alert.alert('Thành công', 'Đã khôi phục dữ liệu mẫu ban đầu!');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Tài Khoản Sinh Viên" subtitle="Cổng thông tin tự học & nghiên cứu VKU" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: currentUser.avatar }} style={styles.avatarImg} />
            <View style={styles.verifiedDot}>
              <Ionicons name="checkmark" size={10} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.fullName}>{currentUser.fullName}</Text>
          <Text style={styles.studentId}>MSSV: {currentUser.studentId}</Text>

          <View style={styles.tagRow}>
            <View style={styles.studentBadge}>
              <Text style={styles.studentBadgeText}>{currentUser.classCode}</Text>
            </View>
            <View style={styles.facultyBadge}>
              <Text style={styles.facultyBadgeText}>{currentUser.faculty}</Text>
            </View>
          </View>

          <Text style={styles.emailText}>{currentUser.email}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{myBookings.length}</Text>
            <Text style={styles.statLabel}>Tổng lượt đặt</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{activeCount}</Text>
            <Text style={styles.statLabel}>Sắp tới (Active)</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.available }]}>{checkedInCount}</Text>
            <Text style={styles.statLabel}>Đã check-in</Text>
          </View>
        </View>

        {/* Switch Demo Student Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Chuyển đổi tài khoản sinh viên (Demo)</Text>
          <Text style={styles.sectionSubtitle}>
            Chuyển qua lại giữa các sinh viên để kiểm tra tính năng chặn xung đột lịch đặt chéo phòng:
          </Text>

          {DEMO_STUDENTS.map((student) => {
            const isSelected = student.id === currentUser.id;
            return (
              <TouchableOpacity
                key={student.id}
                style={[styles.studentItem, isSelected && styles.studentItemSelected]}
                onPress={() => setUser(student)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: student.avatar }} style={styles.studentItemAvatar} />
                <View style={styles.studentItemInfo}>
                  <Text style={[styles.studentItemName, isSelected && { color: colors.primary }]}>
                    {student.fullName} ({student.studentId})
                  </Text>
                  <Text style={styles.studentItemSub}>{student.classCode} • {student.faculty}</Text>
                </View>

                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                ) : (
                  <Ionicons name="radio-button-off" size={20} color={colors.textMuted} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* System & Notification Tools */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Công cụ & Kiểm thử hệ thống</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleTestNotification}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="notifications" size={18} color={colors.primary} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Kiểm tra Thông báo trước 15 phút</Text>
              <Text style={styles.actionDesc}>
                Kích hoạt thông báo đẩy ngay lập tức để kiểm thử tính năng thông báo
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleResetData}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="refresh" size={18} color={colors.occupied} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, { color: colors.occupied }]}>
                Khôi phục Dữ liệu Mẫu (Reset Demo)
              </Text>
              <Text style={styles.actionDesc}>
                Đặt lại các ca phòng occupied và conflict để thuyết trình đồ án
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
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
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImg: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  verifiedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.available,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  fullName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  studentId: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 6,
  },
  studentBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  studentBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  facultyBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  facultyBadgeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  emailText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 8,
    gap: 10,
  },
  studentItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0F9FF',
  },
  studentItemAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  studentItemInfo: {
    flex: 1,
  },
  studentItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  studentItemSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 12,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
