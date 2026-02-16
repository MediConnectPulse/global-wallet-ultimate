import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { GoldButton } from "@/components/GoldButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Gradients } from "@/constants/theme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, setUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    age: String(user?.age || ""),
    gender: user?.gender || "",
    bank_name: user?.bank_name || "",
    account_holder_name: user?.account_holder_name || "",
    ifsc_code: user?.ifsc_code || "",
  });

  const handleSaveProfile = async () => {
    const { error } = await supabase
      .from("users")
      .update({
        full_name: formData.full_name,
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        bank_name: formData.bank_name,
        account_holder_name: formData.account_holder_name,
        ifsc_code: formData.ifsc_code,
      })
      .eq("id", user.id);

    if (!error) {
      Alert.alert("Success", "Your profile has been updated successfully.");
      setIsEditing(false);
      const { data } = await supabase.from("users").select("*").eq("id", user.id).single();
      if (data) setUser(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleWithdrawal = () => {
    if (user?.wallet_balance < 500) {
      Alert.alert(
        "Insufficient Balance",
        "Minimum withdrawal amount is ₹500. Keep earning to reach the threshold!"
      );
      return;
    }

    Alert.alert(
      "Withdrawal Request",
      `Request to withdraw ₹${user?.wallet_balance}?\n\nAdmin will verify your bank details and process the payment.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            Alert.alert("Request Submitted", "Your withdrawal request has been sent to admin for processing.");
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const totalLifetimeEarnings =
    (user?.wallet_balance || 0) + (user?.total_withdrawn || 0);

  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.dark} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 120, paddingTop: insets.top + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={Gradients.gold}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ThemedText type="h1" style={styles.avatarText}>
                {user?.full_name?.charAt(0).toUpperCase() || "U"}
              </ThemedText>
            </LinearGradient>
            <ThemedText type="h3" style={styles.userName}>
              {user?.full_name?.toUpperCase()}
            </ThemedText>
            <View style={styles.phoneContainer}>
              <Feather name="phone" size={14} color={Colors.dark.textSecondary} />
              <ThemedText type="small" style={styles.userMobile}>
                +91 {user?.mobile_number}
              </ThemedText>
            </View>
            {user?.subscription_status === "premium" && (
              <View style={styles.premiumBadge}>
                <Feather name="star" size={12} color={Colors.dark.electricGold} />
                <ThemedText type="caption" style={styles.premiumText}>
                  PREMIUM MEMBER
                </ThemedText>
              </View>
            )}
          </View>

          <StatCard
            title="Lifetime Earnings"
            value={`₹${totalLifetimeEarnings.toLocaleString("en-IN")}`}
            subtitle={`Member since ${new Date(user?.created_at).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })}`}
            icon="trending-up"
            trend="up"
            trendValue="+25%"
            variant="gradient"
            gradientColors={["#B8860B", "#806000", "#5A4600"]}
            style={styles.earningsCard}
          />

          <GlassCard style={styles.withdrawalCard} variant="medium">
            <View style={styles.withdrawalHeader}>
              <View>
                <ThemedText type="caption" style={styles.withdrawalLabel}>
                  WALLET BALANCE
                </ThemedText>
                <ThemedText type="h2" style={styles.withdrawalAmount}>
                  ₹{user?.wallet_balance || 0}
                </ThemedText>
                <ThemedText type="caption" style={styles.withdrawalSubtext}>
                  Min. withdrawal: ₹500
                </ThemedText>
              </View>
              <GoldButton
                onPress={handleWithdrawal}
                icon="download"
                disabled={user?.wallet_balance < 500}
                variant="primary"
                style={styles.withdrawButton}
              >
                Withdraw
              </GoldButton>
            </View>
          </GlassCard>

          <View style={styles.sectionHeader}>
            <ThemedText type="h5" style={styles.sectionTitle}>
              Personal Information
            </ThemedText>
            <Pressable
              onPress={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setIsEditing(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <Feather
                name={isEditing ? "save" : "edit-3"}
                size={20}
                color={Colors.dark.electricGold}
              />
            </Pressable>
          </View>

          <GlassCard style={styles.infoCard} variant="medium">
            <InfoField
              label="Full Name"
              value={formData.full_name}
              isEditing={isEditing}
              onChange={(text) => setFormData({ ...formData, full_name: text })}
              icon="user"
            />
            <View style={styles.row}>
              <InfoField
                label="Age"
                value={formData.age}
                isEditing={isEditing}
                onChange={(text) => setFormData({ ...formData, age: text })}
                icon="calendar"
                keyboardType="numeric"
                style={styles.halfField}
              />
              <InfoField
                label="Gender"
                value={formData.gender}
                isEditing={isEditing}
                onChange={(text) => setFormData({ ...formData, gender: text })}
                icon="users"
                style={styles.halfField}
              />
            </View>
          </GlassCard>

          <ThemedText type="h5" style={styles.sectionTitle}>
            Banking Details
          </ThemedText>

          <GlassCard style={styles.infoCard} variant="medium">
            <InfoField
              label="Bank Name"
              value={formData.bank_name}
              isEditing={isEditing}
              onChange={(text) => setFormData({ ...formData, bank_name: text })}
              icon="home"
            />
            <InfoField
              label="Account Holder Name"
              value={formData.account_holder_name}
              isEditing={isEditing}
              onChange={(text) =>
                setFormData({ ...formData, account_holder_name: text })
              }
              icon="user-check"
            />
            <InfoField
              label="IFSC Code"
              value={formData.ifsc_code}
              isEditing={isEditing}
              onChange={(text) =>
                setFormData({ ...formData, ifsc_code: text.toUpperCase() })
              }
              icon="key"
              autoCapitalize="characters"
            />
          </GlassCard>

          <GlassCard style={styles.recoveryCard} variant="strong">
            <Feather
              name="shield"
              size={24}
              color={Colors.dark.electricGold}
              style={styles.recoveryIcon}
            />
            <ThemedText type="caption" style={styles.recoveryLabel}>
              RECOVERY KEY
            </ThemedText>
            <ThemedText type="h3" style={styles.recoveryKey}>
              {user?.recovery_key}
            </ThemedText>
            <ThemedText type="caption" style={styles.recoveryWarning}>
              Keep this key safe. It cannot be retrieved if lost.
            </ThemedText>
          </GlassCard>

          {isEditing && (
            <GoldButton
              onPress={handleSaveProfile}
              icon="check-circle"
              style={styles.saveButton}
            >
              Save Changes
            </GoldButton>
          )}

          <Pressable onPress={logout} style={styles.logoutButton}>
            <Feather name="log-out" size={16} color={Colors.dark.errorRed} />
            <ThemedText type="small" style={styles.logoutText}>
              Logout from Session
            </ThemedText>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

interface InfoFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (text: string) => void;
  icon?: keyof typeof Feather.glyphMap;
  keyboardType?: "default" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: any;
}

function InfoField({
  label,
  value,
  isEditing,
  onChange,
  icon,
  keyboardType = "default",
  autoCapitalize = "sentences",
  style,
}: InfoFieldProps) {
  return (
    <View style={[styles.infoField, style]}>
      <View style={styles.infoFieldHeader}>
        {icon && (
          <Feather name={icon} size={16} color={Colors.dark.textSecondary} />
        )}
        <ThemedText type="caption" style={styles.fieldLabel}>
          {label.toUpperCase()}
        </ThemedText>
      </View>
      {isEditing ? (
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChange}
          placeholder={`Enter ${label.toLowerCase()}...`}
          placeholderTextColor={Colors.dark.textTertiary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      ) : (
        <ThemedText type="bodyMedium" style={styles.fieldValue}>
          {value || "---"}
        </ThemedText>
      )}
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
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    shadowColor: Colors.dark.electricGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  avatarText: {
    color: Colors.dark.textInverse,
    fontWeight: "900",
  },
  userName: {
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  userMobile: {
    color: Colors.dark.textSecondary,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: `${Colors.dark.electricGold}20`,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.dark.electricGold,
  },
  premiumText: {
    color: Colors.dark.electricGold,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  earningsCard: {
    marginBottom: Spacing.xl,
  },
  withdrawalCard: {
    marginBottom: Spacing["3xl"],
  },
  withdrawalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  withdrawalLabel: {
    color: Colors.dark.textSecondary,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  withdrawalAmount: {
    color: Colors.dark.successGreen,
    fontWeight: "900",
    marginBottom: Spacing.xs,
  },
  withdrawalSubtext: {
    color: Colors.dark.textTertiary,
  },
  withdrawButton: {
    paddingHorizontal: Spacing["2xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.dark.text,
  },
  infoCard: {
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  halfField: {
    flex: 1,
  },
  infoField: {
    marginBottom: Spacing.lg,
  },
  infoFieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  fieldLabel: {
    color: Colors.dark.textSecondary,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  fieldValue: {
    color: Colors.dark.text,
  },
  fieldInput: {
    color: Colors.dark.electricGold,
    fontSize: 16,
    fontWeight: "600",
    borderBottomWidth: 2,
    borderBottomColor: Colors.dark.electricGold,
    paddingVertical: Spacing.xs,
  },
  recoveryCard: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  recoveryIcon: {
    marginBottom: Spacing.lg,
  },
  recoveryLabel: {
    color: Colors.dark.textSecondary,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  recoveryKey: {
    color: Colors.dark.electricGold,
    fontWeight: "900",
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  recoveryWarning: {
    color: Colors.dark.errorRed,
    textAlign: "center",
  },
  saveButton: {
    marginBottom: Spacing.xl,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  logoutText: {
    color: Colors.dark.errorRed,
    fontWeight: "600",
  },
});
