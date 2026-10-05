import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { DayInfo, getUpcoming7Days } from '../../utils/dateUtils';
import { colors } from '../../theme/colors';

interface DaySelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const days: DayInfo[] = getUpcoming7Days();

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Chọn ngày đặt phòng (7 ngày tới)</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((day) => {
          const isSelected = day.date === selectedDate;

          return (
            <TouchableOpacity
              key={day.date}
              style={[
                styles.dayCard,
                isSelected ? styles.dayCardSelected : styles.dayCardUnselected,
              ]}
              onPress={() => onSelectDate(day.date)}
              activeOpacity={0.75}
            >
              {day.isToday && (
                <View style={[styles.todayBadge, isSelected && styles.todayBadgeSelected]}>
                  <Text style={[styles.todayBadgeText, isSelected && styles.todayBadgeTextSelected]}>
                    Hôm nay
                  </Text>
                </View>
              )}

              <Text
                style={[
                  styles.dayOfWeekText,
                  isSelected ? styles.textSelected : styles.textSecondary,
                ]}
              >
                {day.shortDay}
              </Text>

              <Text
                style={[
                  styles.dayNumberText,
                  isSelected ? styles.textSelectedBold : styles.textPrimaryBold,
                ]}
              >
                {day.dayNumber}
              </Text>

              <Text
                style={[
                  styles.monthText,
                  isSelected ? styles.textSelected : styles.textMuted,
                ]}
              >
                {day.monthName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  dayCard: {
    width: 68,
    height: 94,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
    paddingVertical: 6,
  },
  dayCardUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  dayCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  todayBadge: {
    position: 'absolute',
    top: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  todayBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  todayBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
  },
  todayBadgeTextSelected: {
    color: '#FFFFFF',
  },
  dayOfWeekText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
  },
  dayNumberText: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 2,
  },
  monthText: {
    fontSize: 10,
    fontWeight: '500',
  },
  textSelected: {
    color: '#E0F2FE',
  },
  textSelectedBold: {
    color: '#FFFFFF',
  },
  textPrimaryBold: {
    color: colors.textPrimary,
  },
  textSecondary: {
    color: colors.textSecondary,
  },
  textMuted: {
    color: colors.textMuted,
  },
});
