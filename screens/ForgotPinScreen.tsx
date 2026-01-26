import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { GoldButton } from "@/components/GoldButton";
import { GoldInput } from "@/components/GoldInput";
import { GoldCard } from "@/components/GoldCard";
import { useAuth } from "@/lib/auth";

export default function ForgotPinScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { resetPin } = useAuth();
  const [mobile, setMobile] = useState("");
  const [key, setKey] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (mobile.length !== 10 || key.length !== 6 || newPin.length !== 4) {
      Alert.alert(
        "Error",
        "Please fill all fields correctly (PIN must be 4 digits)",
      );
      return;
    }
    setLoading(true);
    const result = await resetPin(mobile, key, newPin);
    if (result.success) {
      Alert.alert("Success", "PIN updated. Login with your new 4-digit PIN.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } else {
      Alert.alert("Vault Error", "Invalid Mobile or Recovery Key");
    }
    setLoading(false);
  };

  return (
    <LinearGradient colors={["#0A192F", "#0D1F3C"]} style={{ flex: 1 }}>
      <View style={{ padding: 20, paddingTop: insets.top + 40 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 20 }}
        >
          <Feather name="arrow-left" size={24} color="#FFD700" />
        </Pressable>
        <ThemedText type="h2" style={{ color: "#FFD700", marginBottom: 10 }}>
          Vault Recovery
        </ThemedText>
        <ThemedText style={{ color: "#888", marginBottom: 30 }}>
          Enter your Recovery Key to set a new PIN.
        </ThemedText>

        <GoldCard>
          <GoldInput
            label="Mobile Number"
            prefix="+91"
            maxLength={10}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
          <GoldInput
            label="6-Digit Recovery Key"
            placeholder="XXXXXX"
            maxLength={6}
            value={key}
            onChangeText={setKey}
          />
          <GoldInput
            label="New 4-Digit PIN"
            placeholder="0000"
            maxLength={4}
            value={newPin}
            onChangeText={setNewPin}
            keyboardType="number-pad"
            isPassword
          />
          <GoldButton
            onPress={handleReset}
            loading={loading}
            style={{ marginTop: 20 }}
          >
            Reset PIN & Unlock
          </GoldButton>
        </GoldCard>
      </View>
    </LinearGradient>
  );
}
