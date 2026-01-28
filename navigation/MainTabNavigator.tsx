import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth";

// --- IMPORT YOUR SCREENS ---
import DashboardScreen from "../screens/DashboardScreen";
import ReferralsScreen from "../screens/ReferralsScreen";
import AdminScreen from "../screens/AdminScreen";
import ProfileScreen from "../screens/ProfileScreen"; // FIXED: Points to the Compliance/Withdrawal screen

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFD700", // Wealth Gold
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#0A192F",
          borderTopWidth: 0,
          // --- DIGNITY ELEVATION: LIFTS ICONS ABOVE SYSTEM BUTTONS ---
          height: 75 + insets.bottom, 
          paddingBottom: insets.bottom + 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
          marginBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="HOME"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="GROWTH"
        component={ReferralsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="trending-up" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PROFILE"
        component={ProfileScreen} // FIXED: Component changed from Reports to Profile
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={22} color={color} />
          ),
        }}
      />

    {/* 🛡️ MASTER SECURITY GATE: Icon strictly invisible to standard users */}
{user?.is_admin === true && (
  <Tab.Screen 
    name="ADMIN" 
    component={AdminScreen} 
    options={{ 
      tabBarIcon: ({color}) => <Feather name="shield" size={22} color={color}/> 
    }} 
  />
)} 
    </Tab.Navigator>
  );
}
