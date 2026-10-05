import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { FilterChip } from '../common/FilterChip';
import { SearchInput } from '../common/SearchInput';
import { useFilterStore } from '../../store/useFilterStore';
import { BuildingId, CapacityRange, Equipment } from '../../types/booking';

const BUILDINGS: { id: BuildingId | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Tất cả tòa' },
  { id: 'A', label: 'Khu A' },
  { id: 'B', label: 'Khu B' },
  { id: 'C', label: 'Khu C' },
  { id: 'V', label: 'Khu V' },
];

const CAPACITIES: { id: CapacityRange; label: string }[] = [
  { id: 'ALL', label: 'Mọi sức chứa' },
  { id: '2-6', label: '2 – 6 bạn' },
  { id: '6-12', label: '6 – 12 bạn' },
  { id: '12-20', label: '12 – 20 bạn' },
];

const EQUIPMENTS: Equipment[] = [
  'High-spec PC',
  'Projector',
  'Whiteboard',
  'AC',
  'Sound System',
  'Dual Monitors',
];

export const RoomFilterBar: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    building,
    setBuilding,
    capacityRange,
    setCapacityRange,
    equipment,
    toggleEquipment,
    onlyAvailableNow,
    setOnlyAvailableNow,
    resetFilters,
    getActiveFilterCount,
  } = useFilterStore();

  const activeCount = getActiveFilterCount();

  return (
    <View style={styles.container}>
      {/* Search Input Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm theo phòng (V.401, B.305...), từ khóa..."
          />
        </View>
        <TouchableOpacity
          style={[
            styles.filterModalButton,
            activeCount > 0 && styles.filterModalButtonActive,
          ]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeCount > 0 ? '#FFFFFF' : colors.primary}
          />
          {activeCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{activeCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Building Chips (Horizontal scroll) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {BUILDINGS.map((b) => (
          <FilterChip
            key={b.id}
            label={b.label}
            selected={building === b.id}
            onPress={() => setBuilding(b.id)}
          />
        ))}

        <FilterChip
          label="🟢 Trống ngay"
          selected={onlyAvailableNow}
          onPress={() => setOnlyAvailableNow(!onlyAvailableNow)}
        />
      </ScrollView>

      {/* Detailed Multi-parameter Filter Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bộ lọc nâng cao</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Building Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tòa nhà / Khu vực</Text>
              <View style={styles.chipGrid}>
                {BUILDINGS.map((b) => (
                  <FilterChip
                    key={b.id}
                    label={b.label}
                    selected={building === b.id}
                    onPress={() => setBuilding(b.id)}
                    style={styles.gridChip}
                  />
                ))}
              </View>
            </View>

            {/* Capacity Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sức chứa nhóm sinh viên</Text>
              <View style={styles.chipGrid}>
                {CAPACITIES.map((c) => (
                  <FilterChip
                    key={c.id}
                    label={c.label}
                    selected={capacityRange === c.id}
                    onPress={() => setCapacityRange(c.id)}
                    style={styles.gridChip}
                  />
                ))}
              </View>
            </View>

            {/* Equipment Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trang thiết bị phòng học</Text>
              <Text style={styles.sectionSubtitle}>
                (Có thể chọn nhiều tiêu chí cùng lúc)
              </Text>
              <View style={styles.chipGrid}>
                {EQUIPMENTS.map((eq) => (
                  <FilterChip
                    key={eq}
                    label={eq}
                    selected={equipment.includes(eq)}
                    onPress={() => toggleEquipment(eq)}
                    style={styles.gridChip}
                  />
                ))}
              </View>
            </View>

            {/* Availability */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tình trạng thời gian thực</Text>
              <TouchableOpacity
                style={[
                  styles.toggleRow,
                  onlyAvailableNow && styles.toggleRowActive,
                ]}
                onPress={() => setOnlyAvailableNow(!onlyAvailableNow)}
                activeOpacity={0.7}
              >
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Chỉ hiển thị phòng trống hiện tại</Text>
                  <Text style={styles.toggleSubtitle}>
                    Ẩn các phòng đang có nhóm sử dụng trong ca này
                  </Text>
                </View>
                <Ionicons
                  name={onlyAvailableNow ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={onlyAvailableNow ? colors.primary : colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Modal Footer Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={resetFilters}
              activeOpacity={0.7}
            >
              <Text style={styles.resetBtnText}>Đặt lại</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.applyBtnText}>
                Áp dụng {activeCount > 0 ? `(${activeCount})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  searchInputWrapper: {
    flex: 1,
  },
  filterModalButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterModalButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  chipsScroll: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
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
    marginBottom: 8,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  gridChip: {
    marginBottom: 0,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  toggleRowActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0F9FF',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
