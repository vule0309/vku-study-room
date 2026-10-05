import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Room } from '../types/booking';
import { MOCK_ROOMS } from '../data/mockRooms';
import { useBookingStore } from '../store/useBookingStore';
import { useFilterStore } from '../store/useFilterStore';
import { RoomCard, ROOM_CARD_HEIGHT } from '../components/room/RoomCard';
import { RoomFilterBar } from '../components/room/RoomFilterBar';
import { colors } from '../theme/colors';

export const RoomListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const currentUser = useBookingStore((state) => state.currentUser);
  const isRoomAvailableNow = useBookingStore((state) => state.isRoomAvailableNow);

  const {
    searchQuery,
    building,
    capacityRange,
    equipment,
    onlyAvailableNow,
    resetFilters,
  } = useFilterStore();

  // Multi-parameter filter computation
  const filteredRooms = useMemo(() => {
    return MOCK_ROOMS.filter((room) => {
      // 1. Search Query filter (matches code, name, or description)
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCode = room.code.toLowerCase().includes(query);
        const matchesName = room.name.toLowerCase().includes(query);
        const matchesDesc = room.description.toLowerCase().includes(query);
        const matchesEq = room.equipment.some((eq) => eq.toLowerCase().includes(query));

        if (!matchesCode && !matchesName && !matchesDesc && !matchesEq) {
          return false;
        }
      }

      // 2. Building filter
      if (building !== 'ALL' && room.building !== building) {
        return false;
      }

      // 3. Capacity range filter
      if (capacityRange !== 'ALL') {
        if (capacityRange === '2-6' && (room.capacity < 2 || room.capacity > 6)) return false;
        if (capacityRange === '6-12' && (room.capacity < 6 || room.capacity > 12)) return false;
        if (capacityRange === '12-20' && (room.capacity < 12 || room.capacity > 20)) return false;
      }

      // 4. Equipment multi-select filter (room must have ALL selected equipment)
      if (equipment.length > 0) {
        const hasAllEquipment = equipment.every((item) =>
          room.equipment.includes(item)
        );
        if (!hasAllEquipment) return false;
      }

      // 5. Real-time availability filter
      if (onlyAvailableNow) {
        const available = isRoomAvailableNow(room.id);
        if (!available) return false;
      }

      return true;
    });
  }, [
    searchQuery,
    building,
    capacityRange,
    equipment,
    onlyAvailableNow,
    isRoomAvailableNow,
  ]);

  const handleRoomPress = useCallback(
    (room: Room) => {
      navigation.navigate('RoomDetail', { room });
    },
    [navigation]
  );

  const renderRoomCard = useCallback(
    ({ item }: { item: Room }) => {
      const isAvailable = isRoomAvailableNow(item.id);
      return (
        <RoomCard
          room={item}
          isAvailableNow={isAvailable}
          onPress={handleRoomPress}
        />
      );
    },
    [handleRoomPress, isRoomAvailableNow]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ROOM_CARD_HEIGHT,
      offset: ROOM_CARD_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Campus Hero Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.userGreeting}>
          <Text style={styles.greetingTitle}>VKU StudySpace 🎓</Text>
          <Text style={styles.greetingSubtitle}>
            Xin chào, {currentUser.fullName} ({currentUser.studentId})
          </Text>
        </View>

        <View style={styles.universityBadge}>
          <Text style={styles.universityBadgeText}>VKU</Text>
        </View>
      </View>

      {/* Discovery Multi-Parameter Filter Header */}
      <RoomFilterBar />

      {/* High-Performance FlatList Feed */}
      <FlatList
        data={filteredRooms}
        renderItem={renderRoomCard}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.resultsCount}>
              Tìm thấy {filteredRooms.length} không gian học tập phù hợp
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Không tìm thấy phòng phù hợp</Text>
            <Text style={styles.emptySubtitle}>
              Thử xóa bớt bộ lọc hoặc tìm kiếm bằng từ khóa khác.
            </Text>
            <TouchableOpacity
              style={styles.resetFilterBtn}
              onPress={resetFilters}
              activeOpacity={0.8}
            >
              <Text style={styles.resetFilterText}>Xóa tất cả bộ lọc</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  userGreeting: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  greetingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  universityBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  universityBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  listHeader: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
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
  },
  resetFilterBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetFilterText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
