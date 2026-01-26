import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Pressable, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { GoldCard } from "@/components/GoldCard";
import { GoldButton } from "@/components/GoldButton";
import { GoldInput } from "@/components/GoldInput";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

type AdminStats = {
  totalUsers: number;
  premiumUsers: number;
  freeUsers: number;
  activeReferrers: number;
  grossRevenue: number;
  totalT1Rewards: number;
  totalT2Rewards: number;
  t2Saved: number;
  netProfit: number;
  topPerformers: Array<{
    id: string;
    mobile: string;
    referralCount: number;
  }>;
};

type GlobalSettings = {
  activation_fee: number;
  t1_reward: number;
  t2_reward: number;
  current_cycle_id: string;
  brand_name: string;
  primary_color: string;
  secondary_color: string;
};

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"stats" | "config" | "export">("stats");
  const [settings, setSettings] = useState<GlobalSettings>({
    activation_fee: 299,
    t1_reward: 50,
    t2_reward: 25,
    current_cycle_id: "cycle_1",
    brand_name: "Global Wallet",
    primary_color: "#0A192F",
    secondary_color: "#FFD700",
  });

  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data: users } = await supabase.from("users").select("*");
      const { data: rewards } = await supabase.from("rewards").select("*");

      const totalUsers = users?.length || 0;
      const premiumUsers = users?.filter(u => u.is_premium).length || 0;
      const freeUsers = totalUsers - premiumUsers;

      const activeReferrers = users?.filter(u => {
        const referredCount = users.filter(r => r.referred_by === u.id).length;
        return referredCount > 0;
      }).length || 0;

      const grossRevenue = premiumUsers * settings.activation_fee;
      const totalT1Rewards = rewards?.filter(r => r.tier === "T1" && r.is_paid).reduce((sum, r) => sum + r.amount, 0) || 0;
      const totalT2Rewards = rewards?.filter(r => r.tier === "T2" && r.is_paid).reduce((sum, r) => sum + r.amount, 0) || 0;
      const t2Saved = rewards?.filter(r => r.tier === "T2" && !r.is_paid).reduce((sum, r) => sum + r.amount, 0) || 0;
      const netProfit = grossRevenue - totalT1Rewards - totalT2Rewards;

      const userReferralCounts = users?.map(u => ({
        id: u.id,
        mobile: u.mobile,
        referralCount: users.filter(r => r.referred_by === u.id && r.is_premium).length,
      })).sort((a, b) => b.referralCount - a.referralCount).slice(0, 5) || [];

      return {
        totalUsers,
        premiumUsers,
        freeUsers,
        activeReferrers,
        grossRevenue,
        totalT1Rewards,
        totalT2Rewards,
        t2Saved,
        netProfit,
        topPerformers: userReferralCounts,
      };
    },
    enabled: !!user?.is_admin,
  });

  const handleExport = async () => {
    if (!stats) return;

    const report = `
📊 GLOBAL WALLET ADMIN REPORT
================================
Generated: ${new Date().toLocaleString()}

👥 USER STATISTICS
• Total Downloads: ${stats.totalUsers}
• Premium Users: ${stats.premiumUsers}
• Free Users: ${stats.freeUsers}
• Active Referrers: ${stats.activeReferrers}

💰 P&L STATEMENT
• Gross Revenue: ₹${stats.grossRevenue.toLocaleString()}
• T1 Rewards Paid: -₹${stats.totalT1Rewards.toLocaleString()}
• T2 Rewards Paid: -₹${stats.totalT2Rewards.toLocaleString()}
• T2 Saved (Lazy Users): +₹${stats.t2Saved.toLocaleString()}
• NET PROFIT: ₹${stats.netProfit.toLocaleString()}

🏆 TOP PERFORMERS
${stats.topPerformers.map((p, i) => `${i + 1}. ${p.mobile} - ${p.referralCount} referrals`).join("\n")}

================================
Global Wallet V10.2 - Admin Panel
    `.trim();

    try {
      await Share.share({
        message: report,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user?.is_admin) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.dark.backgroundRoot }]}>
        <View style={styles.noAccess}>
          <Feather name="lock" size={48} color={Colors.dark.error} />
          <ThemedText type="h3" style={styles.noAccessText}>
            Admin Access Required
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.dark.backgroundRoot }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight + 30,
          paddingBottom: tabBarHeight + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tab, activeTab === "stats" && styles.tabActive]}
            onPress={() => setActiveTab("stats")}
          >
            <Feather name="bar-chart-2" size={18} color={activeTab === "stats" ? Colors.dark.textInverse : Colors.dark.gold} />
            <ThemedText style={activeTab === "stats" ? styles.tabTextActive : styles.tabText}>Stats</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === "config" && styles.tabActive]}
            onPress={() => setActiveTab("config")}
          >
            <Feather name="settings" size={18} color={activeTab === "config" ? Colors.dark.textInverse : Colors.dark.gold} />
            <ThemedText style={activeTab === "config" ? styles.tabTextActive : styles.tabText}>Config</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === "export" && styles.tabActive]}
            onPress={() => setActiveTab("export")}
          >
            <Feather name="share-2" size={18} color={activeTab === "export" ? Colors.dark.textInverse : Colors.dark.gold} />
            <ThemedText style={activeTab === "export" ? styles.tabTextActive : styles.tabText}>Export</ThemedText>
          </Pressable>
        </View>

        {activeTab === "stats" ? (
          <>
            <ThemedText type="h4" style={styles.sectionTitle}>Intelligence Hub</ThemedText>
            
            <View style={styles.statsGrid}>
              <GoldCard style={styles.statCard}>
                <Feather name="download" size={24} color="#3B82F6" />
                <ThemedText style={styles.statValue}>{stats?.totalUsers || 0}</ThemedText>
                <ThemedText style={styles.statLabel}>Downloads</ThemedText>
              </GoldCard>
              <GoldCard style={styles.statCard}>
                <Feather name="star" size={24} color={Colors.dark.gold} />
                <ThemedText style={styles.statValue}>{stats?.premiumUsers || 0}</ThemedText>
                <ThemedText style={styles.statLabel}>Premium</ThemedText>
              </GoldCard>
              <GoldCard style={styles.statCard}>
                <Feather name="users" size={24} color="#10B981" />
                <ThemedText style={styles.statValue}>{stats?.activeReferrers || 0}</ThemedText>
                <ThemedText style={styles.statLabel}>Active Referrers</ThemedText>
              </GoldCard>
              <GoldCard style={styles.statCard}>
                <Feather name="user-x" size={24} color="#94A3B8" />
                <ThemedText style={styles.statValue}>{stats?.freeUsers || 0}</ThemedText>
                <ThemedText style={styles.statLabel}>Free Users</ThemedText>
              </GoldCard>
            </View>

            <ThemedText type="h4" style={styles.sectionTitle}>P&L Engine</ThemedText>

            <GoldCard style={styles.plCard}>
              <View style={styles.plRow}>
                <ThemedText style={styles.plLabel}>Gross Revenue</ThemedText>
                <ThemedText style={[styles.plValue, { color: Colors.dark.success }]}>
                  +₹{stats?.grossRevenue?.toLocaleString() || 0}
                </ThemedText>
              </View>
              <View style={styles.plRow}>
                <ThemedText style={styles.plLabel}>T1 Rewards Paid</ThemedText>
                <ThemedText style={[styles.plValue, { color: Colors.dark.error }]}>
                  -₹{stats?.totalT1Rewards?.toLocaleString() || 0}
                </ThemedText>
              </View>
              <View style={styles.plRow}>
                <ThemedText style={styles.plLabel}>T2 Rewards Paid</ThemedText>
                <ThemedText style={[styles.plValue, { color: Colors.dark.error }]}>
                  -₹{stats?.totalT2Rewards?.toLocaleString() || 0}
                </ThemedText>
              </View>
              <View style={styles.plRow}>
                <ThemedText style={styles.plLabel}>T2 Saved (Lazy Users)</ThemedText>
                <ThemedText style={[styles.plValue, { color: Colors.dark.gold }]}>
                  +₹{stats?.t2Saved?.toLocaleString() || 0}
                </ThemedText>
              </View>
              <View style={[styles.plRow, styles.plNetRow]}>
                <ThemedText style={styles.plNetLabel}>NET PROFIT</ThemedText>
                <ThemedText style={styles.plNetValue}>
                  ₹{stats?.netProfit?.toLocaleString() || 0}
                </ThemedText>
              </View>
            </GoldCard>

            <ThemedText type="h4" style={styles.sectionTitle}>Leaderboard</ThemedText>

            {stats?.topPerformers?.map((performer, index) => (
              <GoldCard key={performer.id} style={styles.leaderCard}>
                <View style={styles.leaderRow}>
                  <View style={[
                    styles.rankBadge,
                    index === 0 && styles.goldRank,
                    index === 1 && styles.silverRank,
                    index === 2 && styles.bronzeRank,
                  ]}>
                    <ThemedText style={styles.rankText}>#{index + 1}</ThemedText>
                  </View>
                  <View style={styles.leaderInfo}>
                    <ThemedText style={styles.leaderMobile}>{performer.mobile}</ThemedText>
                    <ThemedText type="small" style={styles.leaderReferrals}>
                      {performer.referralCount} premium referrals
                    </ThemedText>
                  </View>
                  {index < 3 ? (
                    <Feather
                      name="award"
                      size={24}
                      color={index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32"}
                    />
                  ) : null}
                </View>
              </GoldCard>
            ))}
          </>
        ) : null}

        {activeTab === "config" ? (
          <>
            <ThemedText type="h4" style={styles.sectionTitle}>Remote Configuration</ThemedText>

            <GoldCard style={styles.configCard}>
              <GoldInput
                label="Activation Fee (₹)"
                value={settings.activation_fee.toString()}
                keyboardType="number-pad"
                onChangeText={(v) => setSettings({ ...settings, activation_fee: parseInt(v) || 0 })}
              />
              <GoldInput
                label="T1 Reward (₹)"
                value={settings.t1_reward.toString()}
                keyboardType="number-pad"
                onChangeText={(v) => setSettings({ ...settings, t1_reward: parseInt(v) || 0 })}
              />
              <GoldInput
                label="T2 Reward (₹)"
                value={settings.t2_reward.toString()}
                keyboardType="number-pad"
                onChangeText={(v) => setSettings({ ...settings, t2_reward: parseInt(v) || 0 })}
              />
              <GoldInput
                label="Current Cycle ID"
                value={settings.current_cycle_id}
                onChangeText={(v) => setSettings({ ...settings, current_cycle_id: v })}
              />
              <GoldInput
                label="Brand Name"
                value={settings.brand_name}
                onChangeText={(v) => setSettings({ ...settings, brand_name: v })}
              />
              <GoldInput
                label="Primary Color (Hex)"
                value={settings.primary_color}
                onChangeText={(v) => setSettings({ ...settings, primary_color: v })}
              />
              <GoldInput
                label="Secondary Color (Hex)"
                value={settings.secondary_color}
                onChangeText={(v) => setSettings({ ...settings, secondary_color: v })}
              />
              <GoldButton style={styles.saveBtn}>
                Save Configuration
              </GoldButton>
            </GoldCard>
          </>
        ) : null}

        {activeTab === "export" ? (
          <>
            <ThemedText type="h4" style={styles.sectionTitle}>Master Export</ThemedText>

            <GoldCard style={styles.exportCard}>
              <View style={styles.exportIcon}>
                <Feather name="share-2" size={48} color={Colors.dark.gold} />
              </View>
              <ThemedText type="h4" style={styles.exportTitle}>
                Share Admin Report
              </ThemedText>
              <ThemedText style={styles.exportDesc}>
                Generate a formatted text summary of all statistics, P&L, and leaderboard data
              </ThemedText>
              <GoldButton onPress={handleExport} style={styles.exportBtn}>
                Export via WhatsApp
              </GoldButton>
            </GoldCard>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noAccess: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.lg,
  },
  noAccessText: {
    color: Colors.dark.error,
  },
  tabBar: {
    flexDirection: "row",
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.gold,
    gap: Spacing.xs,
  },
  tabActive: {
    backgroundColor: Colors.dark.gold,
  },
  tabText: {
    color: Colors.dark.gold,
    fontWeight: "600",
    fontSize: 13,
  },
  tabTextActive: {
    color: Colors.dark.textInverse,
    fontWeight: "600",
    fontSize: 13,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
    color: Colors.dark.text,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: "47%",
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.dark.text,
    marginTop: Spacing.sm,
  },
  statLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  plCard: {
    marginBottom: Spacing.xl,
  },
  plRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.borderMuted,
  },
  plLabel: {
    color: Colors.dark.textSecondary,
  },
  plValue: {
    fontWeight: "600",
  },
  plNetRow: {
    borderBottomWidth: 0,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.dark.gold,
  },
  plNetLabel: {
    color: Colors.dark.text,
    fontWeight: "700",
    fontSize: 16,
  },
  plNetValue: {
    color: Colors.dark.gold,
    fontWeight: "700",
    fontSize: 20,
  },
  leaderCard: {
    marginBottom: Spacing.md,
  },
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  goldRank: {
    backgroundColor: "#FFD700",
  },
  silverRank: {
    backgroundColor: "#C0C0C0",
  },
  bronzeRank: {
    backgroundColor: "#CD7F32",
  },
  rankText: {
    fontWeight: "700",
    color: Colors.dark.textInverse,
    fontSize: 12,
  },
  leaderInfo: {
    flex: 1,
  },
  leaderMobile: {
    fontWeight: "600",
    color: Colors.dark.text,
  },
  leaderReferrals: {
    color: Colors.dark.textSecondary,
  },
  configCard: {
    marginBottom: Spacing.xl,
  },
  saveBtn: {
    marginTop: Spacing.lg,
  },
  exportCard: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
  exportIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  exportTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  exportDesc: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  exportBtn: {
    paddingHorizontal: Spacing["3xl"],
  },
});
