import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Equipment } from '../../types/booking';
import { colors } from '../../theme/colors';

interface EquipmentBadgeProps {
  equipment: Equipment;
  compact?: boolean;
}

export const EquipmentBadge: React.FC<EquipmentBadgeProps> = ({ equipment, compact = false }) => {
  let iconName: keyof typeof Ionicons.glyphMap = 'cube-outline';

  switch (equipment) {
    case 'Projector':
      iconName = 'videocam-outline';
      break;
    case 'Whiteboard':
      iconName = 'easel-outline';
      break;
    case 'High-spec PC':
      iconName = 'desktop-outline';
      break;
    case 'AC':
      iconName = 'snow-outline';
      break;
    case 'Sound System':
      iconName = 'volume-high-outline';
      break;
    case 'Dual Monitors':
      iconName = 'tv-outline';
      break;
  }

  return (
    <View style={[styles.badge, compact && styles.compactBadge]}>
      <Ionicons name={iconName} size={compact ? 12 : 14} color={colors.textSecondary} style={styles.icon} />
      <Text style={[styles.text, compact && styles.compactText]}>{equipment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  compactBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 0,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  compactText: {
    fontSize: 10,
  },
});
