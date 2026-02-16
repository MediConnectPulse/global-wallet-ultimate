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

const WITHDRAWAL_METHODS = [
  { id: "upi", name: "UPI Transfer", icon: "smartphone" },
  { id: "bank", name: "Bank Transfer", icon: "briefcase" },
];

export default function WithdrawalScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>("upi");
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);

  const availableBalance = user?.wallet_balance || 0;
  const MIN_WITHDRAWAL = 100;
  const MAX_WITHDRAWAL = 50000;

  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return "Please enter a valid amount";
    }
    if (numAmount < MIN_WITHDRAWAL) {
      return `Minimum withdrawal is ₹${MIN_WITHDRAWAL}`;
    }
    if (numAmount > availableBalance) {
      return "Insufficient wallet balance";
    }
    if (numAmount > MAX_WITHDRAWAL) {
      return `Maximum withdrawal is ₹${MAX_WITHDRAWAL}`;
    }
    return null;
  };

  const handleWithdrawal = async () => {
    const amountError = validateAmount();
    if (amountError) {
      Alert.alert("Invalid Amount", amountError);
      return;
    }

    if (selectedMethod === "upi" && !upiId) {
      Alert.alert("Error", "Please enter UPI ID");
      return;
    }

    if (selectedMethod === "bank") {
      if (!accountNumber || !ifscCode || !accountName) {
        Alert.alert("Error", "Please fill all bank details");
        return;
      }
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      Alert.alert(
        "Withdrawal Requested",
        `Your withdrawal request of ₹${amount} has been submitted successfully. It will be processed within 24-48 hours.`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to request withdrawal");
    } finally {
      setLoading(false);
    }
  };

  const setMaxAmount = () => {
    const maxAvailable = Math.min(availableBalance, MAX_WITHDRAWAL);
    setAmount(maxAvailable.toString());
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
            Withdraw Funds
          </ThemedText>
        </View>

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Logo size={60} showText={false} animated={true} />
          </View>

          <GlassCard style={styles.balanceCard}>
            <ThemedText type="small" style={styles.balanceLabel}>
              Available Balance
            </ThemedText>
            <ThemedText type="h1" style={styles.balanceAmount}>
              ₹{availableBalance.toFixed(2)}
            </ThemedText>
          </GlassCard>

          <GlassCard style={styles.card}>
            <ThemedText type="h3" style={styles.cardTitle}>
              Withdrawal Details
            </ThemedText>

            <View style={styles.sectionTitle}>
              <ThemedText type="subtitle">Select Method</ThemedText>
            </View>

            <View style={styles.methods}>
              {WITHDRAWAL_METHODS.map((method) => (
                <Pressable
                  key={method.id}
                  style={[
                    styles.methodCard,
                    selectedMethod === method.id && styles.methodCardSelected,
                  ]}
                  onPress={() => {
                    setSelectedMethod(method.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Feather
                    name={method.icon as any}
                    size={20}
                    color={
                      selectedMethod === method.id
                        ? Colors.gold
                        : Colors.dark.textSecondary
                    }
                  />
                  <ThemedText
                    type="subtitle"
                    style={[
                      styles.methodText,
                      selectedMethod === method.id && styles.methodTextSelected,
                    ]}
                  >
                    {method.name}
                  </ThemedText>
                  {selectedMethod === method.id && (
                    <Feather
                      name="check-circle"
                      size={20}
                      color={Colors.gold}
                    />
                  )}
                </Pressable>
              ))}
            </View>

            <View style={styles.divider} />

            <AnimatedInput
              label="Amount (₹)"
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              icon="dollar-sign"
              placeholder={`Min: ₹${MIN_WITHDRAWAL}`}
            >
              <Pressable onPress={setMaxAmount} style={styles.maxButton}>
                <ThemedText type="caption" style={styles.maxButtonText}>
                  MAX
                </ThemedText>
              </Pressable>
            </AnimatedInput>

            {selectedMethod === "upi" ? (
              <>
                <AnimatedInput
                  label="UPI ID"
                  value={upiId}
                  onChangeText={setUpiId}
                  icon="smartphone"
                  placeholder="yourname@upi"
                  autoCapitalize="none"
                />
                <View style={styles.infoBox}>
                  <Feather
                    name="info"
                    size={16}
                    color={Colors.dark.textSecondary}
                  />
                  <ThemedText type="caption" style={styles.infoText}>
                    Amount will be credited to your UPI ID within 24-48 hours
                  </ThemedText>
                </View>
              </>
            ) : (
              <>
                <AnimatedInput
                  label="Account Number"
                  value={accountNumber}
                  onChangeText={(text) =>
                    setAccountNumber(text.replace(/[^0-9]/g, ""))
                  }
                  keyboardType="number-pad"
                  icon="credit-card"
                  placeholder="Enter account number"
                  maxLength={18}
                />
                <AnimatedInput
                  label="IFSC Code"
                  value={ifscCode}
                  onChangeText={(text) =>
                    setIfscCode(text.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                  }
                  icon="database"
                  placeholder="ABCD0123456"
                  autoCapitalize="characters"
                  maxLength={11}
                />
                <AnimatedInput
                  label="Account Holder Name"
                  value={accountName}
                  onChangeText={setAccountName}
                  icon="user"
                  placeholder="Name as per bank records"
                  autoCapitalize="words"
                />
                <View style={styles.infoBox}>
                  <Feather
                    name="info"
                    size={16}
                    color={Colors.dark.textSecondary}
                  />
                  <ThemedText type="caption" style={styles.infoText}>
                    Bank transfers take 24-48 hours. Account details must match
                    registered name.
                  </ThemedText>
                </View>
              </>
            )}

            <GoldButton
              onPress={handleWithdrawal}
              loading={loading}
              disabled={loading || !amount}
              icon="arrow-up-circle"
              style={styles.submitButton}
            >
              Request Withdrawal
            </GoldButton>
          </GlassCard>

          <GlassCard style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Feather name="clock" size={16} color={Colors.gold} />
              <ThemedText type="caption" style={styles.infoItemText}>
                Processing Time: 24-48 hours
              </ThemedText>
            </View>
            <View style={styles.infoItem}>
              <Feather name="lock" size={16} color={Colors.gold} />
              <ThemedText type="caption" style={styles.infoItemText}>
                Secure Transactions
              </ThemedText>
            </View>
            <View style={styles.infoItem}>
              <Feather name="zap" size={16} color={Colors.gold} />
              <ThemedText type="caption" style={styles.infoItemText}>
                Instant UPI transfers
              </ThemedText>
            </View>
          </GlassCard>
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
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing.xl,
  },
  balanceCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
  },
  balanceLabel: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  balanceAmount: {
    color: Colors.gold,
    textAlign: "center",
  },
  card: {
    marginBottom: Spacing.xl,
  },
  cardTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  methods: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  methodCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.glassBackground,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    gap: Spacing.sm,
  },
  methodCardSelected: {
    backgroundColor: `${Colors.gold}15`,
    borderColor: Colors.gold,
  },
  methodText: {
    color: Colors.dark.textSecondary,
    flex: 1,
  },
  methodTextSelected: {
    color: Colors.gold,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.glassBorder,
    marginVertical: Spacing.lg,
  },
  maxButton: {
    backgroundColor: `${Colors.gold}20`,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },
  maxButtonText: {
    color: Colors.gold,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.dark.textSecondary}15`,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  infoText: {
    color: Colors.dark.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  submitButton: {
    marginTop: Spacing.xl,
  },
  infoCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  infoItemText: {
    color: Colors.dark.textSecondary,
    flex: 1,
  },
});
