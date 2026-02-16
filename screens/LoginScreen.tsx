import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth";

import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedInput } from "@/components/AnimatedInput";
import { GoldButton } from "@/components/GoldButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, Gradients } from "@/constants/theme";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ mobile: "", pin: "" });

  const validateForm = () => {
    const newErrors = { mobile: "", pin: "" };
    let isValid = true;

    if (mobile.length !== 10) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
      isValid = false;
    }

    if (pin.length !== 4) {
      newErrors.pin = "Enter a valid 4-digit PIN";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await login(mobile, pin);
    if (!result.success) {
      Alert.alert("Access Denied", "Invalid mobile number or PIN. Please try again.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Gradients.primary}
        style={StyleSheet.absoluteFill}
      />
      
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
            <View style={styles.logoContainer}>
              <Logo size={100} showText={true} animated={true} />
            </View>

            <GlassCard style={styles.card} variant="medium">
              <ThemedText type="h2" style={styles.title}>
                Welcome Back
              </ThemedText>
              <ThemedText type="small" style={styles.subtitle}>
                Sign in to access your vault
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
                  label="4-Digit PIN"
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

                <Pressable
                  onPress={() => navigation.navigate("ForgotPin")}
                  style={styles.forgotPinButton}
                >
                  <ThemedText type="small" style={styles.forgotPinText}>
                    Forgot your PIN?
                  </ThemedText>
                </Pressable>

                <GoldButton
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading}
                  icon="unlock"
                  style={styles.loginButton}
                >
                  Open Vault
                </GoldButton>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <ThemedText type="caption" style={styles.dividerText}>
                    OR
                  </ThemedText>
                  <View style={styles.dividerLine} />
                </View>

                <Pressable
                  onPress={() => navigation.navigate("Signup")}
                  style={styles.signupButton}
                >
                  <ThemedText type="bodyMedium" style={styles.signupText}>
                    Don't have an account?{" "}
                    <ThemedText type="bodyMedium" style={styles.signupLink}>
                      Create Account
                    </ThemedText>
                  </ThemedText>
                </Pressable>
              </View>
            </GlassCard>

            <View style={styles.footer}>
              <ThemedText type="caption" style={styles.footerText}>
                Secured by 256-bit encryption
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
    paddingVertical: Spacing["3xl"],
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing["4xl"],
    marginTop: Spacing["2xl"],
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
  forgotPinButton: {
    alignSelf: "flex-end",
    marginBottom: Spacing.xl,
    marginTop: -Spacing.sm,
  },
  forgotPinText: {
    color: Colors.dark.electricGold,
    textDecorationLine: "underline",
  },
  loginButton: {
    marginBottom: Spacing.xl,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.divider,
  },
  dividerText: {
    color: Colors.dark.textSecondary,
    marginHorizontal: Spacing.md,
  },
  signupButton: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  signupText: {
    color: Colors.dark.textSecondary,
  },
  signupLink: {
    color: Colors.dark.electricGold,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    marginTop: Spacing["3xl"],
  },
  footerText: {
    color: Colors.dark.textTertiary,
    textAlign: "center",
  },
});
