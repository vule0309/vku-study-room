import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Header } from '../components/common/Header';
import { Badge } from '../components/common/Badge';
import { EquipmentBadge } from '../components/room/EquipmentBadge';
import { DaySelector } from '../components/booking/DaySelector';
import { TimeSlotGrid } from '../components/booking/TimeSlotGrid';
import { colors } from '../theme/colors';
import { formatDateToYYYYMMDD, formatVietnameseDate, TIME_SLOTS } from '../utils/dateUtils';
import { useBookingStore } from '../store/useBookingStore';

type RoomDetailRouteProp = RouteProp<RootStackParamList, 'RoomDetail'>;

export const RoomDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RoomDetailRouteProp>();
  const { room } = route.params;

  // Selected date defaults to today
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDateToYYYYMMDD(new Date())
  );
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const isRoomAvailableNow = useBookingStore((state) => state.isRoomAvailableNow(room.id));
  const selectedSlot = TIME_SLOTS.find((s) => s.id === selectedSlotId);

  const handleContinueBooking = () => {
    if (!selectedSlotId) {
      Alert.alert('Chưa chọn ca học', 'Vui lòng chọn một khung giờ 2 tiếng còn trống trước khi tiếp tục.');
      return;
    }

    navigation.navigate('BookingConfirm', {
      room,
      date: selectedDate,
      slotId: selectedSlotId,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={`Phòng ${room.code}`}
        subtitle={`${room.name} (Tòa ${room.building})`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover Photo */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: room.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.badgeOverlay}>
            <Badge
              label={isRoomAvailableNow ? 'Trống hiện tại' : 'Đang sử dụng'}
              variant={isRoomAvailableNow ? 'available' : 'occupied'}
            />
          </View>
        </View>

        {/* Room Header Info */}
        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{room.code}</Text>
            </View>
            <View style={styles.metaRow}>
              <Badge
                label={`Tòa ${room.building}`}
                variant="building"
                buildingId={room.building}
              />
              <Badge label={`Tầng ${room.floor}`} variant="neutral" />
              <Badge
                label={`${room.capacity} chỗ`}
                variant="neutral"
                icon={<Ionicons name="people-outline" size={13} color={colors.textSecondary} />}
              />
            </View>
          </View>

          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.description}>{room.description}</Text>

          {/* Equipment list */}
          <Text style={styles.sectionHeading}>Trang thiết bị đi kèm:</Text>
          <View style={styles.equipmentWrap}>
            {room.equipment.map((eq) => (
              <EquipmentBadge key={eq} equipment={eq} />
            ))}
          </View>
        </View>

        {/* Guidelines Box */}
        <View style={styles.guidelinesCard}>
          <View style={styles.guidelineHeader}>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.guidelineTitle}>Quy định phòng tự học VKU</Text>
          </View>
          {room.guidelines.map((rule, idx) => (
            <View key={idx} style={styles.ruleItem}>
              <Text style={styles.ruleDot}>•</Text>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        {/* 7-Day Date Selector */}
        <DaySelector
          selectedDate={selectedDate}
          onSelectDate={(newDate) => {
            setSelectedDate(newDate);
            setSelectedSlotId(null); // reset slot selection when switching day
          }}
        />

        {/* 2-Hour Discrete Time Slot Grid with Conflict Prevention */}
        <TimeSlotGrid
          roomId={room.id}
          selectedDate={selectedDate}
          selectedSlotId={selectedSlotId}
          onSelectSlot={(slotId) => setSelectedSlotId(slotId)}
        />
      </ScrollView>

      {/* Floating Bottom Booking Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.slotSummary}>
          <Text style={styles.slotSummaryLabel}>
            {selectedSlot ? 'Ca học đã chọn:' : 'Vui lòng chọn ca:'}
          </Text>
          <Text style={styles.slotSummaryTime}>
            {selectedSlot
              ? `${selectedSlot.label} (${selectedSlot.shiftName})`
              : 'Chưa chọn khung giờ'}
          </Text>
          <Text style={styles.slotSummaryDate}>
            Ngày: {formatVietnameseDate(selectedDate)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.continueBtn,
            !selectedSlotId && styles.continueBtnDisabled,
          ]}
          onPress={handleContinueBooking}
          disabled={!selectedSlotId}
          activeOpacity={0.8}
        >
          <Text style={styles.continueBtnText}>Tiếp tục</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
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
    paddingBottom: 110,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  codeContainer: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
  },
  roomName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  equipmentWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  guidelinesCard: {
    backgroundColor: '#F8FAFC',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guidelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  guidelineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 3,
  },
  ruleDot: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 6,
  },
  ruleText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  slotSummary: {
    flex: 1,
    marginRight: 12,
  },
  slotSummaryLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  slotSummaryTime: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  slotSummaryDate: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  continueBtnDisabled: {
    backgroundColor: colors.border,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
