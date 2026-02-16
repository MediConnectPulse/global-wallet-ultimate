import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Pressable,
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

export default function AccountDeletionScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [pin, setPin] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmToggle = () => {
    setConfirmed(!confirmed);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDeleteAccount = async () => {
    if (!confirmed) {
      Alert.alert(
        "Confirmation Required",
        "Please confirm that you understand the consequences.",
      );
      return;
    }

    if (!pin || pin.length !== 4) {
      Alert.alert("Invalid PIN", "Please enter your 4-digit PIN to confirm.");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    Alert.alert(
      "Delete Account",
      "This action cannot be undone. Your account, wallet balance, and all data will be permanently deleted. Are you sure you want to continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
              Alert.alert(
                "Account Deleted",
                "Your account has been deleted successfully. We're sorry to see you go.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Signup" }],
                      });
                    },
                  },
                ],
              );
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete account");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.primary} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={Colors.dark.text} />
          </Pressable>
          <ThemedText type="h3" style={styles.headerTitle}>
            Delete Account
          </ThemedText>
        </View>

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <View style={styles.warningIconContainer}>
              <Feather name="alert-triangle" size={64} color={Colors.dark.errorRed} />
            </View>
          </View>

          <GlassCard style={styles.card}>
            <ThemedText type="h2" style={styles.title}>
              Account Deletion
            </ThemedText>
            <ThemedText type="small" style={styles.subtitle}>
              This action is permanent and cannot be undone
            </ThemedText>

            <View style={styles.warningBox}>
              <Feather
                name="alert-circle"
                size={20}
                color={Colors.dark.errorRed}
              />
              <ThemedText type="small" style={styles.warningText}>
                You are about to permanently delete your account and all associated
                data.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                What will be deleted:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <View style={styles.bullet}>
                  <Feather
                    name="check"
                    size={16}
                    color={Colors.dark.errorRed}
                  />
                  <ThemedText type="small" style={styles.bulletText}>
                    Account information and profile
                  </ThemedText>
                </View>
                <View style={styles.bullet}>
                  <Feather
                    name="check"
                    size={16}
                    color={Colors.dark.errorRed}
                  />
                  <ThemedText type="small" style={styles.bulletText}>
                    Wallet balance (non-refundable)
                  </ThemedText>
                </View>
                <View style={styles.bullet}>
                  <Feather
                    name="check"
                    size={16}
                    color={Colors.dark.errorRed}
                  />
                  <ThemedText type="small" style={styles.bulletText}>
                    Transaction history
                  </ThemedText>
                </View>
                <View style={styles.bullet}>
                  <Feather
                    name="check"
                    size={16}
                    color={Colors.dark.errorRed}
                  />
                  <ThemedText type="small" style={styles.bulletText}>
                    Referrals and rewards
                  </ThemedText>
                </View>
                <View style={styles.bullet}>
                  <Feather
                    name="check"
                    size={16}
                    color={Colors.dark.errorRed}
                  />
                  <ThemedText type="small" style={styles.bulletText}>
                    Device fingerprint and session data
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                What will NOT be deleted:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <View style={styles.bullet}>
                  <Feather
                    name="x"
                    size={16}
                    color={Colors.dark.successGreen}
                  />
                  <ThemedText type="small" style={styles.bulletText}>
                    Fraud logs and audit records (for legal compliance)
                  </ThemedText>
                </View>
                <View style={styles.bullet}>
                  <Feather
                    name="x"
                    size={16}
                    color={Colors.dark.successGreen}
                  />
                  <ThemedText type="small" style={styles.bulletText}>
                    Payment processing records (for 7 years)
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Before you delete:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <View style={styles.bullet}>
                  <Feather
                    name="arrow-right"
                    size={16}
                    color={Colors.gold}
                  />
                  <ThemedText type="small" style={styles.bulletText}>
                    Withdraw your remaining wallet balance
                  </ThemedText>
                </View>
                <View style={styles.bullet}>
                  <Feather
                    name="arrow-right"
                    size={16}
                    color={Colors.gold}
                  />
                  <ThemedText type="small" style={styles.bulletText}>
                    Download any important reports or data
                  </ThemedText>
                </View>
                <View style={styles.bullet}>
                  <Feather
                    name="arrow-right"
                    size={16}
                    color={Colors.gold}
                  />
                  <ThemedText type="small" style={styles.bulletText}>
                    Remove any pending withdrawal requests
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.confirmationSection}>
              <Pressable
                style={styles.checkboxContainer}
                onPress={handleConfirmToggle}
              >
                <View
                  style={[
                    styles.checkbox,
                    confirmed && styles.checkboxChecked,
                  ]}
                >
                  {confirmed && (
                    <Feather name="check" size={16} color={Colors.dark.background} />
                  )}
                </View>
                <ThemedText type="small" style={styles.checkboxText}>
                  I understand that this action cannot be undone and I want to
                  permanently delete my account.
                </ThemedText>
              </Pressable>

              <AnimatedInput
                label="Confirm with PIN"
                value={pin}
                onChangeText={(text) => setPin(text.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                maxLength={4}
                isPassword
                icon="lock"
                placeholder="Enter your 4-digit PIN"
              />
            </View>

            <Pressable
              style={[
                styles.deleteButton,
                loading && styles.deleteButtonDisabled,
              ]}
              onPress={handleDeleteAccount}
              disabled={loading || !confirmed || !pin}
            >
              {loading ? (
                <ThemedText type="subtitle" style={styles.deleteButtonText}>
                  Deleting...
                </ThemedText>
              ) : (
                <>
                  <Feather
                    name="trash-2"
                    size={20}
                    color={Colors.dark.background}
                  />
                  <ThemedText type="subtitle" style={styles.deleteButtonText}>
                    Delete My Account
                  </ThemedText>
                </>
              )}
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <ThemedText type="subtitle" style={styles.cancelButtonText}>
                Cancel & Keep Account
              </ThemedText>
            </Pressable>
          </GlassCard>

          <View style={styles.infoBox}>
            <Feather name="info" size={16} color={Colors.dark.textSecondary} />
            <ThemedText type="caption" style={styles.infoText}>
              If you change your mind after deletion, you'll need to create a new
              account. Your previous data cannot be recovered.
            </ThemedText>
          </View>
        </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.glassBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  headerTitle: {
    color: Colors.dark.text,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  warningIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Colors.dark.errorRed}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing.xl,
  },
  card: {
    marginBottom: Spacing.xl,
  },
  title: {
    color: Colors.dark.errorRed,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.lg,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: `${Colors.dark.errorRed}15`,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  warningText: {
    color: Colors.dark.errorRed,
    flex: 1,
    lineHeight: 18,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  bulletPoints: {
    gap: Spacing.sm,
  },
  bullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  bulletText: {
    color: Colors.dark.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.glassBorder,
    marginVertical: Spacing.xl,
  },
  confirmationSection: {
    marginBottom: Spacing.xl,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.dark.errorRed,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.dark.errorRed,
  },
  checkboxText: {
    color: Colors.dark.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.errorRed,
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: Colors.dark.background,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  cancelButtonText: {
    color: Colors.gold,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: `${Colors.dark.textSecondary}20`,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.md,
  },
  infoText: {
    color: Colors.dark.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
});
