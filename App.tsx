import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { registerForPushNotificationsAsync } from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    // Request notification permissions and register channel on startup
    registerForPushNotificationsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
