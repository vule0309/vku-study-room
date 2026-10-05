import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Room } from '../../types/booking';
import { colors } from '../../theme/colors';
import { Badge } from '../common/Badge';
import { EquipmentBadge } from './EquipmentBadge';

export const ROOM_CARD_HEIGHT = 290; // Fixed layout height for FlatList getItemLayout optimization

interface RoomCardProps {
  room: Room;
  isAvailableNow: boolean;
  onPress: (room: Room) => void;
}

const RoomCardComponent: React.FC<RoomCardProps> = ({
  room,
  isAvailableNow,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(room)}
      activeOpacity={0.88}
    >
      {/* Cover Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Real-time Status Badge Overlay */}
        <View style={styles.statusOverlay}>
          <Badge
            label={isAvailableNow ? 'Trống hiện tại' : 'Đang sử dụng'}
            variant={isAvailableNow ? 'available' : 'occupied'}
            icon={
              <Ionicons
                name={isAvailableNow ? 'checkmark-circle' : 'time'}
                size={12}
                color={isAvailableNow ? colors.available : colors.occupied}
              />
            }
            size="sm"
          />
        </View>

        {/* Building & Floor Badge Overlay */}
        <View style={styles.locationOverlay}>
          <Badge
            label={`Tòa ${room.building} • Tầng ${room.floor}`}
            variant="building"
            buildingId={room.building}
            size="sm"
          />
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{room.code}</Text>
          </View>
          <View style={styles.capacityBadge}>
            <Ionicons name="people-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.capacityText}>{room.capacity} chỗ</Text>
          </View>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {room.name}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {room.description}
        </Text>

        {/* Equipment Badges */}
        <View style={styles.equipmentRow}>
          {room.equipment.slice(0, 3).map((eq) => (
            <EquipmentBadge key={eq} equipment={eq} compact />
          ))}
          {room.equipment.length > 3 && (
            <View style={styles.moreEquipment}>
              <Text style={styles.moreEquipmentText}>
                +{room.equipment.length - 3}
              </Text>
            </View>
          )}
        </View>

        {/* Action Row */}
        <View style={styles.footerRow}>
          <Text style={styles.bookPrompt}>Chạm để chọn ca & xem lịch</Text>
          <View style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Đặt phòng</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Optimized React.memo equality comparator for 60fps scrolling
export const RoomCard = React.memo(RoomCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.room.id === nextProps.room.id &&
    prevProps.isAvailableNow === nextProps.isAvailableNow &&
    prevProps.room.name === nextProps.room.name &&
    prevProps.room.capacity === nextProps.room.capacity
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  locationOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  content: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  codeBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  capacityText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  moreEquipment: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  moreEquipmentText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
    marginTop: 2,
  },
  bookPrompt: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
