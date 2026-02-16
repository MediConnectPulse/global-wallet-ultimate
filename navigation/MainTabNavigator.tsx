import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useAuth } from "../lib/auth";

import DashboardScreen from "../screens/DashboardScreen";
import ReferralsScreen from "../screens/ReferralsScreen";
import AdminScreen from "../screens/AdminScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { Colors, Spacing, BorderRadius } from "@/constants/theme";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.dark.electricGold,
        tabBarInactiveTintColor: Colors.dark.textTertiary,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.OS === "ios" ? "transparent" : Colors.dark.backgroundPrimary,
          borderTopWidth: 1,
          borderTopColor: Colors.dark.glassBorder,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 12,
          elevation: 0,
          shadowColor: Colors.dark.electricGold,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.5,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="HOME"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Feather name="home" size={24} color={color} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
      <Tab.Screen
        name="GROWTH"
        component={ReferralsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Feather name="trending-up" size={24} color={color} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />
      <Tab.Screen
        name="PROFILE"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerActive,
              ]}
            >
              <Feather name="user" size={24} color={color} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      />

      {user?.is_admin === true && (
        <Tab.Screen
          name="ADMIN"
          component={AdminScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.iconContainer,
                  focused && styles.iconContainerActive,
                ]}
              >
                <Feather name="shield" size={24} color={color} />
              </View>
            ),
          }}
          listeners={{
            tabPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            },
          }}
        />
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerActive: {
    backgroundColor: `${Colors.dark.electricGold}15`,
  },
});
