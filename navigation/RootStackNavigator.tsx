import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../lib/auth";

// --- SCREENS ---
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ForgotPinScreen from "../screens/ForgotPinScreen";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator();

export default function RootStackNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPin" component={ForgotPinScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
