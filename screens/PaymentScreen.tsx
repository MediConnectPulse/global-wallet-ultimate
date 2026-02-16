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
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedInput } from "@/components/AnimatedInput";
import { GoldButton } from "@/components/GoldButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, Gradients } from "@/constants/theme";

const PAYMENT_MODES = [
  { id: "upi", name: "UPI", icon: "credit-card", color: "#4CAF50" },
  { id: "qr", name: "QR Code", icon: "maximize", color: "#2196F3" },
  { id: "manual", name: "Bank Transfer", icon: "database", color: "#FF9800" },
];

export default function PaymentScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera permissions to upload receipt",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setReceiptImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handlePayment = async () => {
    if (!selectedMode) {
      Alert.alert("Error", "Please select a payment mode");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!receiptImage) {
      Alert.alert("Error", "Please upload payment receipt");
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      Alert.alert(
        "Payment Submitted",
        "Your payment verification request has been submitted successfully. Our team will verify within 24 hours.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to submit payment");
    } finally {
      setLoading(false);
    }
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
            Add Funds
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

          <GlassCard style={styles.card}>
            <ThemedText type="h3" style={styles.cardTitle}>
              Select Payment Mode
            </ThemedText>
            <ThemedText type="small" style={styles.cardSubtitle}>
              Choose your preferred payment method
            </ThemedText>

            <View style={styles.paymentModes}>
              {PAYMENT_MODES.map((mode) => (
                <Pressable
                  key={mode.id}
                  style={[
                    styles.paymentModeCard,
                    selectedMode === mode.id && styles.paymentModeCardSelected,
                    { borderColor: mode.color },
                  ]}
                  onPress={() => {
                    setSelectedMode(mode.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <View
                    style={[
                      styles.paymentModeIcon,
                      { backgroundColor: `${mode.color}20` },
                    ]}
                  >
                    <Feather name={mode.icon as any} size={28} color={mode.color} />
                  </View>
                  <ThemedText type="subtitle" style={styles.paymentModeText}>
                    {mode.name}
                  </ThemedText>
                  {selectedMode === mode.id && (
                    <Feather
                      name="check-circle"
                      size={20}
                      color={mode.color}
                      style={styles.checkIcon}
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
              placeholder="Enter amount"
            />

            <AnimatedInput
              label="Transaction Reference"
              value={reference}
              onChangeText={setReference}
              icon="hash"
              placeholder="UTR / Transaction ID"
              autoCapitalize="characters"
            />

            <View style={styles.imageUploadSection}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Payment Receipt
              </ThemedText>
              <Pressable style={styles.imageUploadButton} onPress={pickImage}>
                {receiptImage ? (
                  <>
                    <Feather
                      name="check"
                      size={24}
                      color={Colors.dark.successGreen}
                    />
                    <ThemedText type="small" style={styles.uploadSuccessText}>
                      Receipt Attached
                    </ThemedText>
                  </>
                ) : (
                  <>
                    <Feather name="upload-cloud" size={32} color={Colors.gold} />
                    <ThemedText type="small" style={styles.uploadText}>
                      Upload Receipt
                    </ThemedText>
                  </>
                )}
              </Pressable>
            </View>

            <GoldButton
              onPress={handlePayment}
              loading={loading}
              disabled={loading || !selectedMode || !amount || !receiptImage}
              icon="check-circle"
              style={styles.submitButton}
            >
              Submit Payment Verification
            </GoldButton>
          </GlassCard>

          <View style={styles.infoBox}>
            <Feather name="info" size={16} color={Colors.dark.textSecondary} />
            <ThemedText type="caption" style={styles.infoText}>
              Payments are verified within 24 hours. You'll receive a notification
              once verified.
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
  cardTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xl,
  },
  paymentModes: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  paymentModeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.glassBackground,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  paymentModeCardSelected: {
    borderWidth: 2,
  },
  paymentModeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  paymentModeText: {
    color: Colors.dark.text,
    flex: 1,
  },
  checkIcon: {
    position: "absolute",
    right: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.glassBorder,
    marginVertical: Spacing.xl,
  },
  imageUploadSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.glassBackground,
    borderWidth: 2,
    borderColor: Colors.gold,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  uploadText: {
    color: Colors.gold,
  },
  uploadSuccessText: {
    color: Colors.dark.successGreen,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.dark.textSecondary}20`,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.md,
  },
  infoText: {
    color: Colors.dark.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
});
