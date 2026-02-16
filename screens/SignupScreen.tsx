import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useAuth } from "../lib/auth";

import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedInput } from "@/components/AnimatedInput";
import { GoldButton } from "@/components/GoldButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, Gradients, BorderRadius } from "@/constants/theme";

export default function SignupScreen({ navigation }: any) {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [ref, setRef] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    pin: "",
  });

  const validateForm = () => {
    const newErrors = { name: "", mobile: "", pin: "" };
    let isValid = true;

    if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      isValid = false;
    }

    if (mobile.length !== 10) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
      isValid = false;
    }

    if (pin.length !== 4) {
      newErrors.pin = "PIN must be exactly 4 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!accepted) {
      Alert.alert("Terms Required", "Please accept the terms and conditions to continue");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await signup(mobile, pin, ref, name);
    setLoading(false);

    if (result.success) {
      setRecoveryKey(result.recoveryKey);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Alert.alert("Signup Failed", result.error || "An error occurred. Please try again.");
    }
  };

  const handleCopyRecoveryKey = async () => {
    await Clipboard.setStringAsync(recoveryKey);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Copied!", "Recovery key copied to clipboard");
  };

  if (recoveryKey) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={Gradients.primary} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.successContainer}>
            <GlassCard style={styles.successCard} variant="strong">
              <View style={styles.successIconContainer}>
                <LinearGradient
                  colors={[Colors.dark.successGreen, Colors.dark.successGreenDark]}
                  style={styles.successIconGradient}
                >
                  <Feather name="check-circle" size={60} color={Colors.dark.text} />
                </LinearGradient>
              </View>

              <ThemedText type="h2" style={styles.successTitle}>
                Account Created!
              </ThemedText>
              <ThemedText type="small" style={styles.successSubtitle}>
                Your vault is now active and secured
              </ThemedText>

              <View style={styles.recoveryKeyContainer}>
                <ThemedText type="caption" style={styles.recoveryKeyLabel}>
                  YOUR RECOVERY KEY
                </ThemedText>
                <Pressable onPress={handleCopyRecoveryKey} style={styles.recoveryKeyBox}>
                  <ThemedText type="h1" style={styles.recoveryKeyText}>
                    {recoveryKey}
                  </ThemedText>
                  <Feather
                    name="copy"
                    size={24}
                    color={Colors.dark.electricGold}
                    style={styles.copyIcon}
                  />
                </Pressable>
              </View>

              <View style={styles.warningBox}>
                <Feather name="alert-triangle" size={20} color={Colors.dark.errorRed} />
                <View style={styles.warningTextContainer}>
                  <ThemedText type="small" style={styles.warningTitle}>
                    Critical: Save This Key
                  </ThemedText>
                  <ThemedText type="caption" style={styles.warningText}>
                    This recovery key cannot be retrieved. Store it securely offline.
                  </ThemedText>
                </View>
              </View>

              <GoldButton
                onPress={() => navigation.replace("Login")}
                icon="arrow-right"
                iconPosition="right"
                style={styles.proceedButton}
              >
                I've Saved It Securely
              </GoldButton>
            </GlassCard>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={Colors.dark.text} />
            </Pressable>

            <View style={styles.logoContainer}>
              <Logo size={80} showText={false} animated={true} />
            </View>

            <GlassCard style={styles.card} variant="medium">
              <ThemedText type="h2" style={styles.title}>
                Create Account
              </ThemedText>
              <ThemedText type="small" style={styles.subtitle}>
                Join the ultimate financial platform
              </ThemedText>

              <View style={styles.form}>
                <AnimatedInput
                  label="Full Name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setErrors({ ...errors, name: "" });
                  }}
                  icon="user"
                  error={errors.name}
                  autoCapitalize="words"
                />

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
                  label="Create 4-Digit PIN"
                  value={pin}
                  onChangeText={(text) => {
                    setPin(text.replace(/[^0-9]/g, ""));
                    setErrors({ ...errors, pin: "" });
                  }}
                  keyboardType="number-pad"
                  maxLength={4}
                  isPassword
                  icon="lock"
                  error={errors.pin}
                />

                <AnimatedInput
                  label="Referral Code (Optional)"
                  value={ref}
                  onChangeText={setRef}
                  icon="gift"
                  autoCapitalize="characters"
                />

                <Pressable
                  onPress={() => {
                    setAccepted(!accepted);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={styles.termsContainer}
                >
                  <View
                    style={[
                      styles.checkbox,
                      accepted && styles.checkboxChecked,
                    ]}
                  >
                    {accepted && (
                      <Feather name="check" size={16} color={Colors.dark.textInverse} />
                    )}
                  </View>
                  <ThemedText type="small" style={styles.termsText}>
                    I agree to the{" "}
                    <ThemedText type="small" style={styles.termsLink}>
                      Terms & Conditions
                    </ThemedText>
                    {" "}and{" "}
                    <ThemedText type="small" style={styles.termsLink}>
                      Privacy Policy
                    </ThemedText>
                  </ThemedText>
                </Pressable>

                <GoldButton
                  onPress={handleSignup}
                  loading={loading}
                  disabled={loading}
                  icon="user-plus"
                  style={styles.signupButton}
                >
                  Create Account
                </GoldButton>

                <View style={styles.loginContainer}>
                  <ThemedText type="small" style={styles.loginText}>
                    Already have an account?{" "}
                  </ThemedText>
                  <Pressable onPress={() => navigation.navigate("Login")}>
                    <ThemedText type="smallMedium" style={styles.loginLink}>
                      Sign In
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            </GlassCard>
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.xs,
    borderWidth: 2,
    borderColor: Colors.dark.borderMuted,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.dark.electricGold,
    borderColor: Colors.dark.electricGold,
  },
  termsText: {
    flex: 1,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.dark.electricGold,
    fontWeight: "600",
  },
  signupButton: {
    marginBottom: Spacing.lg,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: Colors.dark.textSecondary,
  },
  loginLink: {
    color: Colors.dark.electricGold,
    fontWeight: "700",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  successCard: {
    alignItems: "center",
  },
  successIconContainer: {
    marginBottom: Spacing["2xl"],
  },
  successIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  successSubtitle: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  recoveryKeyContainer: {
    width: "100%",
    marginBottom: Spacing["2xl"],
  },
  recoveryKeyLabel: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.md,
    letterSpacing: 1,
    fontWeight: "700",
  },
  recoveryKeyBox: {
    backgroundColor: Colors.dark.backgroundPrimary,
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.dark.electricGold,
    alignItems: "center",
    position: "relative",
  },
  recoveryKeyText: {
    color: Colors.dark.electricGold,
    letterSpacing: 8,
    fontWeight: "900",
    textAlign: "center",
  },
  copyIcon: {
    marginTop: Spacing.lg,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: `${Colors.dark.errorRed}20`,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.errorRed,
    marginBottom: Spacing["2xl"],
    gap: Spacing.md,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    color: Colors.dark.errorRed,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  warningText: {
    color: Colors.dark.textSecondary,
    lineHeight: 16,
  },
  proceedButton: {
    width: "100%",
  },
});
