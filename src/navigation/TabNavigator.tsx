import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabParamList } from '../types/navigation';
import { RoomListScreen } from '../screens/RoomListScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { CampusMapScreen } from '../screens/CampusMapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { useBookingStore } from '../store/useBookingStore';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  const currentUser = useBookingStore((state) => state.currentUser);
  const bookings = useBookingStore((state) => state.bookings);

  // Active bookings count for tab badge
  const activeCount = bookings.filter(
    (b) => b.studentId === currentUser.studentId && b.status === 'confirmed'
  ).length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Discovery"
        component={RoomListScreen}
        options={{
          tabBarLabel: 'Khám phá',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          tabBarLabel: 'Lịch của tôi',
          tabBarBadge: activeCount > 0 ? activeCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.accent,
            fontSize: 10,
            fontWeight: '700',
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="CampusMap"
        component={CampusMapScreen}
        options={{
          tabBarLabel: 'Khu nhà VKU',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'business' : 'business-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
