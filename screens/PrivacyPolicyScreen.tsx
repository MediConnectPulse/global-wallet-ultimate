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

export default function PrivacyPolicyScreen({ navigation }: any) {
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
            Privacy Policy
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
              Global Wallet - Privacy Policy
            </ThemedText>

            <ThemedText type="small" style={styles.lastUpdated}>
              Last Updated: {new Date().toLocaleDateString()}
            </ThemedText>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                1. Information We Collect
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                We collect the following types of information to provide and
                improve our services:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <ThemedText type="small" style={styles.bullet}>
                  • Personal Information: Mobile number, full name
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Account Information: PIN code, recovery key, wallet balance
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Transaction Data: Payments, withdrawals, referrals
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Device Information: Device ID, operating system, app version
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Usage Data: Features used, session duration, interactions
                </ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                2. How We Use Your Information
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                We use the collected information for the following purposes:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <ThemedText type="small" style={styles.bullet}>
                  • Provide and maintain your account
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Process transactions and manage your wallet
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Send important notifications and updates
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Improve our services and user experience
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Detect and prevent fraud and abuse
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Comply with legal obligations
                </ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                3. Data Security
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                We implement industry-standard security measures to protect
                your information:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <ThemedText type="small" style={styles.bullet}>
                  • End-to-end encryption for sensitive data
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Secure authentication using PIN codes
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Regular security audits and updates
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Limited access to user data
                </ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                4. Data Retention
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                We retain your data for as long as necessary to provide our
                services. Upon account deletion, your personal information is
                permanently removed from our systems within 30 days, except for
                records required by law or for legitimate business purposes.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                5. Third-Party Services
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                We use the following third-party services:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <ThemedText type="small" style={styles.bullet}>
                  • Supabase: Cloud database and authentication services
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Google Play Services: App distribution and analytics
                </ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                6. Your Rights
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                You have the following rights regarding your data:
              </ThemedText>

              <View style={styles.bulletPoints}>
                <ThemedText type="small" style={styles.bullet}>
                  • Access your personal information
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Request correction of inaccurate data
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Request deletion of your account
                </ThemedText>
                <ThemedText type="small" style={styles.bullet}>
                  • Opt-out of non-essential communications
                </ThemedText>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                7. Children's Privacy
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                Global Wallet is not intended for children under 18 years of age.
                We do not knowingly collect personal information from children
                under 18.
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                8. Contact Us
              </ThemedText>
              <ThemedText type="small" style={styles.sectionText}>
                If you have questions or concerns about this privacy policy,
                please contact us at:
              </ThemedText>
              <ThemedText type="small" style={styles.email}>
                support@globalwallet.app
              </ThemedText>
            </View>

            <ThemedText type="caption" style={styles.footer}>
              By using Global Wallet, you agree to this privacy policy.
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
