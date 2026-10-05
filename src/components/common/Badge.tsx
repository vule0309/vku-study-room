import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'accent' | 'available' | 'occupied' | 'neutral' | 'building';
  buildingId?: 'A' | 'B' | 'C' | 'V';
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  buildingId,
  icon,
  size = 'md',
  style,
}) => {
  let bgColor = colors.borderLight;
  let textColor = colors.textSecondary;
  let borderColor = colors.border;

  if (variant === 'primary') {
    bgColor = '#E0F2FE';
    textColor = colors.primary;
    borderColor = '#BAE6FD';
  } else if (variant === 'accent') {
    bgColor = '#FFF7ED';
    textColor = colors.accent;
    borderColor = '#FED7AA';
  } else if (variant === 'available') {
    bgColor = colors.availableBg;
    textColor = colors.available;
    borderColor = colors.availableBorder;
  } else if (variant === 'occupied') {
    bgColor = colors.occupiedBg;
    textColor = colors.occupied;
    borderColor = colors.occupiedBorder;
  } else if (variant === 'building' && buildingId) {
    switch (buildingId) {
      case 'A':
        bgColor = '#EFF6FF';
        textColor = colors.buildingA;
        borderColor = '#BFDBFE';
        break;
      case 'B':
        bgColor = '#F5F3FF';
        textColor = colors.buildingB;
        borderColor = '#DDD6FE';
        break;
      case 'C':
        bgColor = '#ECFDF5';
        textColor = colors.buildingC;
        borderColor = '#A7F3D0';
        break;
      case 'V':
        bgColor = '#FFF7ED';
        textColor = colors.buildingV;
        borderColor = '#FED7AA';
        break;
    }
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          borderColor,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 6 : 8,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize: isSmall ? 11 : 12,
            fontWeight: '600',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {},
});
