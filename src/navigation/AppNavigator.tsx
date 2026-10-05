import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { TabNavigator } from './TabNavigator';
import { RoomDetailScreen } from '../screens/RoomDetailScreen';
import { BookingConfirmScreen } from '../screens/BookingConfirmScreen';
import { BookingPassScreen } from '../screens/BookingPassScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
        <Stack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
        <Stack.Screen
          name="BookingPass"
          component={BookingPassScreen}
          options={{
            animation: 'slide_from_bottom',
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
