import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, Gradients } from "@/constants/theme";

export default function TermsOfServiceScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

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
            Terms of Service
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
            <ThemedText type="h2" style={styles.title}>
              Terms of Service
            </ThemedText>

            <ThemedText type="small" style={styles.lastUpdated}>
              Last Updated: {new Date().toLocaleDateString()}
            </ThemedText>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                1. Acceptance of Terms
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                By downloading, accessing, or using the Global Wallet application,
                you agree to be bound by these Terms of Service. If you do not
                agree to these terms, please do not use the application.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                2. Eligibility
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                You must be at least 18 years of age to use Global Wallet. By
                using the application, you represent and warrant that you meet
                this age requirement.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                3. Account Registration
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                To use certain features of Global Wallet, you must register for an
                account. You agree to:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <ThemedText type="small" style={styles.bullet}>
                  • Provide accurate and complete information
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Maintain the security of your PIN and recovery key
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Notify us immediately of unauthorized access
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Accept responsibility for all activities under your account
                </ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                4. Wallet Services
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                Global Wallet provides digital wallet services including:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <ThemedText type="small" style={styles.bullet}>
                  • Fund addition via UPI, QR code, or bank transfer
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Wallet balance management
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Withdrawal to UPI or bank account
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Referral rewards and bonuses
                </ThemedText>
              </View>

              <ThemedText type="small" style={styles.sectionText}>
                All transactions are subject to verification and may take 24-48
                hours to process.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                5. Referral Program
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                Global Wallet offers a referral program with tier-1 and tier-2
                rewards:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <ThemedText type="small" style={styles.bullet}>
                  • Tier-1: Direct referrals earn you rewards
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Tier-2: Referrals of your referrals earn additional rewards
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Rewards are credited upon successful first deposit
                </ThemedText>
              </View>

              <ThemedText type="small" style={styles.warningText}>
                Abuse of the referral program may result in account suspension or
                termination.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                6. Subscription Plans
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                Global Wallet offers free and premium subscription tiers:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <ThemedText type="small" style={styles.bullet}>
                  • Free: Basic features, limited referrals
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Premium: Unlimited referrals, advanced reports, priority support
                </ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                7. Acceptable Use Policy
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                You agree not to use Global Wallet for any unlawful purpose or
                in any way that could damage the service. Prohibited activities
                include:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <ThemedText type="small" style={styles.bullet}>
                  • Fraud, money laundering, or illegal transactions
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Creating multiple accounts
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Using bots, scripts, or automated tools
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Attempting to circumvent security measures
                </ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                8. Account Termination
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                We reserve the right to suspend or terminate your account if you
                violate these terms or engage in fraudulent activity. Upon
                termination, your account balance will be subject to review and
                may be forfeited.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                9. Limitation of Liability
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                Global Wallet shall not be liable for any indirect, incidental,
                special, or consequential damages resulting from your use of the
                service. Our liability is limited to the amount of fees you have
                paid to us.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                10. Privacy
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                Your use of Global Wallet is also governed by our Privacy Policy.
                Please review it to understand how we collect, use, and protect
                your information.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                11. Changes to Terms
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                We may update these terms from time to time. Continued use of the
                service after changes constitutes acceptance of the new terms.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                12. Contact Us
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                If you have questions about these terms, please contact us at:
              </ThemedText>
              <ThemedText type="small" style={styles.email}>
                legal@globalwallet.app
              </ThemedText>
            </View>

            <ThemedText type="caption" style={styles.footer}>
              By using Global Wallet, you acknowledge that you have read,
              understood, and agree to these Terms of Service.
            </ThemedText>
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
  card: {
    padding: Spacing.xl,
  },
  title: {
    color: Colors.gold,
    marginBottom: Spacing.sm,
  },
  lastUpdated: {
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xl,
    fontStyle: "italic",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  sectionText: {
    color: Colors.dark.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  warningText: {
    color: Colors.dark.warningAmber,
    lineHeight: 22,
    marginTop: Spacing.sm,
    fontWeight: "600",
  },
  bulletPoints: {
    marginLeft: Spacing.md,
  },
  bullet: {
    color: Colors.dark.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xs,
  },
  email: {
    color: Colors.gold,
    marginTop: Spacing.sm,
  },
  footer: {
    color: Colors.dark.textTertiary,
    textAlign: "center",
    marginTop: Spacing.xl,
    lineHeight: 18,
  },
});
