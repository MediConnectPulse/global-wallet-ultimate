import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "@/screens/LoginScreen";
import SignupScreen from "@/screens/SignupScreen";
import ForgotPinScreen from "@/screens/ForgotPinScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPin: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPin" component={ForgotPinScreen} />
    </Stack.Navigator>
  );
}
