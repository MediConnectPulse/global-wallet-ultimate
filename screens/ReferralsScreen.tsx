import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, FlatList, Pressable, Alert, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Share from "expo-sharing";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from "react-native-reanimated";

import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { GoldButton } from "@/components/GoldButton";
import { ThemedText } from "@/components/ThemedText";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { Colors, Spacing, BorderRadius, Gradients, SpringConfigs } from "@/constants/theme";

const AnimatedView = Animated.createAnimatedComponent(View);

interface TeamMember {
  full_name: string;
  mobile_number: string;
  subscription_status: string;
}

export default function ReferralsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [directCount, setDirectCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const blinkAnim = useRef(new Animated.SharedValue(0.4)).current;
  const campaignOpacity = useSharedValue(0);

  useEffect(() => {
    fetchData();
    // Blinking animation for campaign
    blinkAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const campaignAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(blinkAnim.value, [0.4, 1], [0.4, 1]),
  }));

  const fetchData = async () => {
    try {
      const [gsRes, teamRes, rewardsRes] = await Promise.all([
        supabase.from("global_settings").select("*").single(),
        supabase
          .from("users")
          .select("full_name, mobile_number, subscription_status")
          .eq("referred_by_code", user?.mobile_number),
        supabase
          .from("rewards")
          .select("amount")
          .eq("referrer_id", user?.id),
      ]);

      if (gsRes.data) setSettings(gsRes.data);
      if (teamRes.data) {
        setTeam(teamRes.data);
        setDirectCount(teamRes.data.length);
      }
      if (rewardsRes.data) {
        const earnings = rewardsRes.data.reduce((sum, r) => sum + (r.amount || 0), 0);
        setTotalEarnings(earnings);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareCode = async () => {
    const message = `Join Global Wallet Ultimate!\n\nUse my referral code: ${user?.mobile_number}\n\nDownload now and start earning passive income!`;
    try {
      await Share.share({ message });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const renderTeamMember = ({ item, index }: { item: TeamMember; index: number }) => {
    const isPremium = item.subscription_status === "premium";
    const scale = useSharedValue(0);

    useEffect(() => {
      scale.value = withSpring(1, SpringConfigs.gentle);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: scale.value,
    }));

    return (
      <AnimatedView style={[styles.userCard, animatedStyle]}>
        <View style={styles.srNo}>
          <ThemedText type="caption" style={styles.srNoText}>
            #{index + 1}
          </ThemedText>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userDetails}>
            <ThemedText type="bodyMedium" style={styles.userName}>
              {item.full_name}
            </ThemedText>
            <ThemedText type="caption" style={styles.userPhone}>
              {item.mobile_number}
            </ThemedText>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isPremium ? `${Colors.dark.successGreen}20` : `${Colors.dark.textTertiary}20` },
          ]}
        >
          <ThemedText
            type="caption"
            style={[styles.statusText, { color: isPremium ? Colors.dark.successGreen : Colors.dark.textTertiary }]}
          >
            {item.subscription_status.toUpperCase()}
          </ThemedText>
        </View>
      </AnimatedView>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.dark} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100, paddingTop: insets.top + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="h3" style={styles.title}>
              Executive Growth
            </ThemedText>
            <ThemedText type="small" style={styles.subtitle}>
              Your referral network
            </ThemedText>
          </View>

          {/* Referral Code Card */}
          <GlassCard style={styles.referralCard} variant="medium" onPress={handleShareCode}>
            <View style={styles.referralHeader}>
              <View style={styles.referralIconContainer}>
                <LinearGradient colors={Gradients.gold} style={styles.referralIconGradient}>
                  <Feather name="users" size={24} color={Colors.dark.textInverse} />
                </LinearGradient>
              </View>
              <View style={styles.referralInfo}>
                <ThemedText type="caption" style={styles.referralLabel}>
                  YOUR REFERRAL CODE
                </ThemedText>
                <ThemedText type="h2" style={styles.referralCode}>
                  {user?.mobile_number || "---"}
                </ThemedText>
              </View>
            </View>
            <GoldButton onPress={handleShareCode} icon="share-2" style={styles.shareButton}>
              Share Code
            </GoldButton>
          </GlassCard>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {isLoading ? (
              <>
                <SkeletonLoader variant="card" style={styles.statSkeleton} />
                <SkeletonLoader variant="card" style={styles.statSkeleton} />
              </>
            ) : (
              <>
                <StatCard
                  title="Direct Team"
                  value={directCount}
                  subtitle="Tier-1 Referrals"
                  icon="user-plus"
                  variant="glass"
                  style={styles.statCard}
                />
                <StatCard
                  title="Total Earnings"
                  value={`â‚¹${totalEarnings.toLocaleString("en-IN")}`}
                  subtitle="From referrals"
                  icon="trending-up"
                  trend="up"
                  trendValue="+15%"
                  variant="gradient"
                  gradientColors={Gradients.success}
                  style={styles.statCard}
                />
              </>
            )}
          </View>

          {/* Campaign Banner */}
          {settings?.campaign_is_active && (
            <AnimatedView style={[styles.campaignContainer, campaignAnimatedStyle]}>
              <LinearGradient colors={Gradients.gold} style={styles.campaignBanner}>
                <Feather name="award" size={32} color={Colors.dark.textInverse} />
                <View style={styles.campaignContent}>
                  <ThemedText type="h5" style={styles.campaignTitle}>
                    {settings?.campaign_title || "Special Campaign"}
                  </ThemedText>
                  <ThemedText type="small" style={styles.campaignDesc}>
                    Achieve the target to win the Admin Bonus!
                  </ThemedText>
                </View>
              </LinearGradient>
            </AnimatedView>
          )}

          {/* Notice Board */}
          {settings?.notice_board_text && (
            <GlassCard style={styles.noticeCard} variant="light">
              <View style={styles.noticeHeader}>
                <Feather name="bell" size={16} color={Colors.dark.electricGold} />
                <ThemedText type="caption" style={styles.noticeTitle}>
                  LATEST UPDATES
                </ThemedText>
              </View>
              <ThemedText type="small" style={styles.noticeText}>
                {settings.notice_board_text}
              </ThemedText>
            </GlassCard>
          )}

          {/* Team List */}
          <View style={styles.sectionHeader}>
            <ThemedText type="h5" style={styles.sectionTitle}>
              Direct Team (Tier-1)
            </ThemedText>
            <ThemedText type="caption" style={styles.sectionSubtitle}>
              {team.length} members
            </ThemedText>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <SkeletonLoader variant="card" />
              <SkeletonLoader variant="card" />
              <SkeletonLoader variant="card" />
            </View>
          ) : team.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <Feather name="users" size={48} color={Colors.dark.textSecondary} style={styles.emptyIcon} />
              <ThemedText type="h4" style={styles.emptyTitle}>
                No Team Yet
              </ThemedText>
              <ThemedText type="small" style={styles.emptyText}>
                Share your referral code to start building your network
              </ThemedText>
            </GlassCard>
          ) : (
            <FlatList
              data={team}
              keyExtractor={(item, index) => `${item.mobile_number}-${index}`}
              renderItem={renderTeamMember}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          )}
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
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  title: {
    color: Colors.dark.electricGold,
    textAlign: "center",
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
  },
  referralCard: {
    marginBottom: Spacing.xl,
  },
  referralHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  referralIconContainer: {
    marginRight: Spacing.lg,
  },
  referralIconGradient: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.dark.electricGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  referralInfo: {
    flex: 1,
  },
  referralLabel: {
    color: Colors.dark.textSecondary,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  referralCode: {
    color: Colors.dark.electricGold,
    fontWeight: "900",
    letterSpacing: 2,
  },
  shareButton: {
    width: "100%",
  },
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
  },
  statSkeleton: {
    flex: 1,
    height: 120,
  },
  campaignContainer: {
    marginBottom: Spacing.xl,
  },
  campaignBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.xl,
    shadowColor: Colors.dark.electricGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  campaignContent: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  campaignTitle: {
    color: Colors.dark.textInverse,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  campaignDesc: {
    color: `${Colors.dark.textInverse}CC`,
    fontWeight: "600",
  },
  noticeCard: {
    marginBottom: Spacing.xl,
  },
  noticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  noticeTitle: {
    color: Colors.dark.electricGold,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  noticeText: {
    color: Colors.dark.text,
    lineHeight: 20,
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
  sectionSubtitle: {
    color: Colors.dark.textTertiary,
  },
  listContent: {
    gap: Spacing.md,
  },
  loadingContainer: {
    gap: Spacing.md,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
  },
  emptyIcon: {
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundPrimary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
  },
  srNo: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: `${Colors.dark.electricGold}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  srNoText: {
    color: Colors.dark.electricGold,
    fontWeight: "700",
    fontSize: 12,
  },
  userInfo: {
    flex: 1,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
    fontSize: 14,
  },
  userPhone: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 0.5,
  },
});



