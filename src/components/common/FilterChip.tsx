import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
  count?: number;
  style?: ViewStyle;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected,
  onPress,
  icon,
  count,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <Text
          style={[
            styles.count,
            selected ? styles.countSelected : styles.countUnselected,
          ]}
        >
          {count}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  labelUnselected: {
    color: colors.textSecondary,
  },
  labelSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  count: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  countUnselected: {
    backgroundColor: colors.borderLight,
    color: colors.textSecondary,
  },
  countSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    color: '#FFFFFF',
  },
});
