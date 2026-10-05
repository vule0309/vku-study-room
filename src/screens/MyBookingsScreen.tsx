import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Booking } from '../types/booking';
import { useBookingStore } from '../store/useBookingStore';
import { BookingItemCard } from '../components/booking/BookingItemCard';
import { BookingPassModal } from '../components/booking/BookingPassModal';
import { Header } from '../components/common/Header';
import { colors } from '../theme/colors';

export const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const currentUser = useBookingStore((state) => state.currentUser);
  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);

  const [filterTab, setFilterTab] = useState<'upcoming' | 'all'>('upcoming');
  const [selectedPassBooking, setSelectedPassBooking] = useState<Booking | null>(null);

  // Filter bookings for current logged-in user
  const userBookings = bookings.filter((b) => b.studentId === currentUser.studentId);

  const displayedBookings = userBookings.filter((b) => {
    if (filterTab === 'upcoming') {
      return b.status === 'confirmed';
    }
    return true; // all
  });

  const handleCancelBooking = async (bookingId: string) => {
    const success = await cancelBooking(bookingId);
    if (success) {
      Alert.alert('Thành công', 'Lịch đặt phòng đã được hủy. Khung giờ này hiện đã mở lại cho các bạn sinh viên khác.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Lịch Đặt Chỗ Của Tôi"
        subtitle={`Sinh viên: ${currentUser.fullName} (${currentUser.studentId})`}
      />

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            filterTab === 'upcoming' && styles.tabButtonActive,
          ]}
          onPress={() => setFilterTab('upcoming')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              filterTab === 'upcoming' && styles.tabTextActive,
            ]}
          >
            Sắp tới ({userBookings.filter((b) => b.status === 'confirmed').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            filterTab === 'all' && styles.tabButtonActive,
          ]}
          onPress={() => setFilterTab('all')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              filterTab === 'all' && styles.tabTextActive,
            ]}
          >
            Tất cả lịch ({userBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={displayedBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingItemCard
            booking={item}
            onViewPass={(b) => setSelectedPassBooking(b)}
            onCancel={handleCancelBooking}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Chưa có lịch đặt phòng nào</Text>
            <Text style={styles.emptySubtitle}>
              {filterTab === 'upcoming'
                ? 'Bạn không có lịch học nhóm sắp tới nào. Hãy đặt phòng mới để học tập cùng nhóm!'
                : 'Lịch sử đặt phòng của bạn đang trống.'}
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('MainTabs')}
              activeOpacity={0.8}
            >
              <Text style={styles.exploreBtnText}>Tìm & Đặt phòng ngay</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Digital QR Pass Modal */}
      <BookingPassModal
        visible={!!selectedPassBooking}
        booking={selectedPassBooking}
        onClose={() => setSelectedPassBooking(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.borderLight,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingTop: 14,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  exploreBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
