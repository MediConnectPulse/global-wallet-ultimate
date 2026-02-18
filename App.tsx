import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';

// This fix ensures Supabase works on Android APKs
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, LogBox, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { Feather } from "@expo/vector-icons";
import { QueryClientProvider } from "@tanstack/react-query";

// --- ARCHITECT'S PATH ALIGNMENT (Using relative paths to prevent APK crashes) ---
import { queryClient } from "./lib/query-client";
import RootStackNavigator from "./navigation/RootStackNavigator";
import { AuthProvider } from "./lib/auth";
import SplashScreen from "./screens/SplashScreen";
import { Colors } from "./constants/theme";

// Ignore unnecessary warning logs in the APK
LogBox.ignoreAllLogs();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepareVault() {
      try {
        // 1. THE ICON VACCINE: Force-loading Feather shapes to prevent "Boxes" on mobile
        await Font.loadAsync(Feather.font);

        // 2. STABILITY DELAY: Ensures Supabase handshake is established
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn("Architecture Warning (Font Load):", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepareVault();
  }, []);

  // Show Gold Loading Wheel until the Nervous System is active
  if (!appIsReady) {
    return (
      <View style={styles.gate}>
        <ActivityIndicator size="large" color={Colors.dark.electricGold} />
      </View>
    );
  }

  // Hide splash screen after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <NavigationContainer>
                {/* THE MASTER MAP OF SCREENS */}
                <RootStackNavigator />
              </NavigationContainer>
              <ExpoStatusBar style="light" backgroundColor={Colors.dark.deepSpaceBlue} />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  gate: {
    flex: 1,
    backgroundColor: Colors.dark.deepSpaceBlue,
    justifyContent: "center",
    alignItems: "center",
  },
});
