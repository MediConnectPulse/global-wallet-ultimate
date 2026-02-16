import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedInput } from "@/components/AnimatedInput";
import { GoldButton } from "@/components/GoldButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, Gradients } from "@/constants/theme";

export default function ForgotPinScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { resetPin } = useAuth();
  const [mobile, setMobile] = useState("");
  const [key, setKey] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ mobile: "", key: "", pin: "" });

  const validateForm = () => {
    const newErrors = { mobile: "", key: "", pin: "" };
    let isValid = true;

    if (mobile.length !== 10) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
      isValid = false;
    }

    if (key.length !== 6) {
      newErrors.key = "Recovery key must be 6 digits";
      isValid = false;
    }

    if (newPin.length !== 4) {
      newErrors.pin = "PIN must be exactly 4 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleReset = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await resetPin(mobile, key, newPin);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "PIN updated. Login with your new 4-digit PIN.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } else {
      Alert.alert("Vault Error", "Invalid Mobile or Recovery Key");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.primary} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color={Colors.dark.text} />
            </Pressable>

            <View style={styles.logoContainer}>
              <Logo size={80} showText={false} animated={true} />
            </View>

            <GlassCard style={styles.card} variant="medium">
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: `${Colors.dark.errorRed}20` },
                  ]}
                >
                  <Feather name="unlock" size={32} color={Colors.dark.errorRed} />
                </View>
              </View>

              <ThemedText type="h2" style={styles.title}>
                Vault Recovery
              </ThemedText>
              <ThemedText type="small" style={styles.subtitle}>
                Enter your recovery key to reset your PIN
              </ThemedText>

              <View style={styles.form}>
                <AnimatedInput
                  label="Mobile Number"
                  value={mobile}
                  onChangeText={(text) => {
                    setMobile(text.replace(/[^0-9]/g, ""));
                    setErrors({ ...errors, mobile: "" });
                  }}
                  keyboardType="number-pad"
                  maxLength={10}
                  icon="smartphone"
                  prefix="+91"
                  error={errors.mobile}
                />

                <AnimatedInput
                  label="6-Digit Recovery Key"
                  value={key}
                  onChangeText={(text) => {
                    setKey(text.replace(/[^0-9]/g, "").toUpperCase());
                    setErrors({ ...errors, key: "" });
                  })}
                  maxLength={6}
                  icon="key"
                  error={errors.key}
                  autoCapitalize="characters"
                />

                <AnimatedInput
                  label="New 4-Digit PIN"
                  value={newPin}
                  onChangeText={(text) => {
                    setNewPin(text.replace(/[^0-9]/g, ""));
                    setErrors({ ...errors, pin: "" });
                  }}
                  keyboardType="number-pad"
                  maxLength={4}
                  isPassword
                  icon="lock"
                  error={errors.pin}
                />

                <GoldButton
                  onPress={handleReset}
                  loading={loading}
                  disabled={loading}
                  icon="shield"
                  style={styles.resetButton}
                >
                  Reset PIN & Unlock
                </GoldButton>
              </View>
            </GlassCard>

            <View style={styles.warningBox}>
              <Feather
                name="alert-triangle"
                size={16}
                color={Colors.dark.warningAmber}
              />
              <ThemedText type="caption" style={styles.warningText}>
                Make sure to store your recovery key in a secure location
              </ThemedText>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.glassBackground,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  card: {
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  form: {
    width: "100%",
  },
  resetButton: {
    marginTop: Spacing.lg,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.dark.warningAmber}15`,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.warningAmber,
    gap: Spacing.md,
  },
  warningText: {
    color: Colors.dark.warningAmber,
    flex: 1,
    lineHeight: 16,
  },
});
