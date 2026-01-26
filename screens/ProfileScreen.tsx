import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Pressable, Modal, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { GoldCard } from "@/components/GoldCard";
import { GoldButton } from "@/components/GoldButton";
import { useAuth } from "@/lib/auth";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

type AdminStats = {
  totalUsers: number;
  premiumUsers: number;
  freeUsers: number;
  activeReferrers: number;
  grossRevenue: number;
  totalRewardsDistributed: number;
  netRevenue: number;
  topPerformers: Array<{
    id: string;
    mobile: string;
    referralCount: number;
  }>;
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { user, logout } = useAuth();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const { data: adminStats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.is_admin,
  });

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logout();
  };

  const adminModules = [
    { id: "download", name: "Download Stats", icon: "download", color: "#3B82F6" },
    { id: "premium", name: "Premium Tracker", icon: "star", color: "#FFD700" },
    { id: "referrers", name: "Active Referrers", icon: "users", color: "#10B981" },
    { id: "pnl", name: "P&L Report", icon: "trending-up", color: "#8B5CF6" },
    { id: "leaderboard", name: "Leaderboard", icon: "award", color: "#F59E0B" },
    { id: "control", name: "Remote Control", icon: "settings", color: "#EF4444" },
  ];

  const openAdminModule = (moduleId: string) => {
    setSelectedModule(moduleId);
    setShowAdminModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderAdminContent = () => {
    switch (selectedModule) {
      case "download":
        return (
          <View>
            <ThemedText type="h3" style={styles.modalTitle}>Download Statistics</ThemedText>
            <GoldCard style={styles.statCard}>
              <View style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Total Users</ThemedText>
                <ThemedText style={styles.statValue}>{adminStats?.totalUsers || 0}</ThemedText>
              </View>
              <View style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Premium Users</ThemedText>
                <ThemedText style={[styles.statValue, { color: Colors.dark.gold }]}>
                  {adminStats?.premiumUsers || 0}
                </ThemedText>
              </View>
              <View style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Free Users</ThemedText>
                <ThemedText style={styles.statValue}>{adminStats?.freeUsers || 0}</ThemedText>
              </View>
            </GoldCard>
          </View>
        );
      case "premium":
        return (
          <View>
            <ThemedText type="h3" style={styles.modalTitle}>Premium Tracker</ThemedText>
            <GoldCard variant="gold" style={styles.premiumCard}>
              <ThemedText style={styles.premiumLabel}>Premium Users</ThemedText>
              <ThemedText style={styles.premiumCount}>{adminStats?.premiumUsers || 0}</ThemedText>
              <ThemedText style={styles.premiumSubtext}>
                {((adminStats?.premiumUsers || 0) / (adminStats?.totalUsers || 1) * 100).toFixed(1)}% conversion rate
              </ThemedText>
            </GoldCard>
          </View>
        );
      case "referrers":
        return (
          <View>
            <ThemedText type="h3" style={styles.modalTitle}>Active Referrers</ThemedText>
            <GoldCard style={styles.statCard}>
              <View style={styles.bigStat}>
                <ThemedText style={styles.bigStatValue}>{adminStats?.activeReferrers || 0}</ThemedText>
                <ThemedText style={styles.bigStatLabel}>Users with referrals</ThemedText>
              </View>
            </GoldCard>
          </View>
        );
      case "pnl":
        return (
          <View>
            <ThemedText type="h3" style={styles.modalTitle}>Profit & Loss</ThemedText>
            <GoldCard style={styles.statCard}>
              <View style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Gross Revenue</ThemedText>
                <ThemedText style={[styles.statValue, { color: Colors.dark.success }]}>
                  ₹{adminStats?.grossRevenue?.toLocaleString() || 0}
                </ThemedText>
              </View>
              <View style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Rewards Distributed</ThemedText>
                <ThemedText style={[styles.statValue, { color: Colors.dark.error }]}>
                  -₹{adminStats?.totalRewardsDistributed?.toLocaleString() || 0}
                </ThemedText>
              </View>
              <View style={[styles.statRow, styles.netRow]}>
                <ThemedText style={styles.netLabel}>Net Revenue</ThemedText>
                <ThemedText style={styles.netValue}>
                  ₹{adminStats?.netRevenue?.toLocaleString() || 0}
                </ThemedText>
              </View>
            </GoldCard>
          </View>
        );
      case "leaderboard":
        return (
          <View>
            <ThemedText type="h3" style={styles.modalTitle}>Top 3 Performers</ThemedText>
            {adminStats?.topPerformers?.map((performer, index) => (
              <GoldCard key={performer.id} style={styles.leaderCard}>
                <View style={styles.leaderRow}>
                  <View style={[styles.rankBadge, index === 0 && styles.goldRank, index === 1 && styles.silverRank, index === 2 && styles.bronzeRank]}>
                    <ThemedText style={styles.rankText}>#{index + 1}</ThemedText>
                  </View>
                  <View style={styles.leaderInfo}>
                    <ThemedText style={styles.leaderMobile}>{performer.mobile}</ThemedText>
                    <ThemedText type="small" style={styles.leaderReferrals}>
                      {performer.referralCount} premium referrals
                    </ThemedText>
                  </View>
                  <Feather
                    name={index === 0 ? "award" : "star"}
                    size={24}
                    color={index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32"}
                  />
                </View>
              </GoldCard>
            )) || (
              <ThemedText style={styles.noDataText}>No performers yet</ThemedText>
            )}
          </View>
        );
      case "control":
        return (
          <View>
            <ThemedText type="h3" style={styles.modalTitle}>Remote Control</ThemedText>
            <ThemedText style={styles.controlDesc}>
              Admin controls for managing the platform remotely
            </ThemedText>
            <GoldButton variant="secondary" style={styles.controlBtn}>
              Force Refresh All Users
            </GoldButton>
            <GoldButton variant="secondary" style={styles.controlBtn}>
              Send Push Notification
            </GoldButton>
            <GoldButton variant="secondary" style={styles.controlBtn}>
              Toggle Maintenance Mode
            </GoldButton>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.dark.backgroundRoot }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        <GoldCard style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {user?.mobile?.slice(-2) || "GW"}
              </ThemedText>
            </View>
            {user?.is_premium ? (
              <View style={styles.premiumBadge}>
                <Feather name="star" size={12} color={Colors.dark.textInverse} />
              </View>
            ) : null}
          </View>
          <ThemedText style={styles.mobile}>{user?.mobile || "User"}</ThemedText>
          <View style={[styles.statusTag, user?.is_premium ? styles.premiumTag : styles.freeTag]}>
            <ThemedText type="small" style={user?.is_premium ? styles.premiumTagText : styles.freeTagText}>
              {user?.is_premium ? "Premium" : "Free"}
            </ThemedText>
          </View>
        </GoldCard>

        <ThemedText type="h4" style={styles.sectionTitle}>Account</ThemedText>

        <GoldCard style={styles.menuCard}>
          <Pressable style={styles.menuItem}>
            <Feather name="user" size={20} color={Colors.dark.gold} />
            <ThemedText style={styles.menuText}>Edit Profile</ThemedText>
            <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </Pressable>
          <Pressable style={styles.menuItem}>
            <Feather name="shield" size={20} color={Colors.dark.gold} />
            <ThemedText style={styles.menuText}>Change PIN</ThemedText>
            <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </Pressable>
          <Pressable style={styles.menuItem}>
            <Feather name="key" size={20} color={Colors.dark.gold} />
            <ThemedText style={styles.menuText}>Recovery Key</ThemedText>
            <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </Pressable>
        </GoldCard>

        <ThemedText type="h4" style={styles.sectionTitle}>Preferences</ThemedText>

        <GoldCard style={styles.menuCard}>
          <Pressable style={styles.menuItem}>
            <Feather name="bell" size={20} color={Colors.dark.gold} />
            <ThemedText style={styles.menuText}>Notifications</ThemedText>
            <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </Pressable>
          <Pressable style={styles.menuItem}>
            <Feather name="globe" size={20} color={Colors.dark.gold} />
            <ThemedText style={styles.menuText}>Language</ThemedText>
            <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </Pressable>
        </GoldCard>

        {user?.is_admin ? (
          <>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Admin Control Panel
            </ThemedText>
            <View style={styles.adminGrid}>
              {adminModules.map((module) => (
                <Pressable
                  key={module.id}
                  style={styles.adminModule}
                  onPress={() => openAdminModule(module.id)}
                >
                  <View style={[styles.adminIcon, { backgroundColor: `${module.color}20` }]}>
                    <Feather name={module.icon as any} size={24} color={module.color} />
                  </View>
                  <ThemedText type="small" style={styles.adminModuleName}>
                    {module.name}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        <ThemedText type="h4" style={styles.sectionTitle}>Help</ThemedText>

        <GoldCard style={styles.menuCard}>
          <Pressable style={styles.menuItem}>
            <Feather name="help-circle" size={20} color={Colors.dark.gold} />
            <ThemedText style={styles.menuText}>FAQ</ThemedText>
            <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </Pressable>
          <Pressable style={styles.menuItem}>
            <Feather name="message-circle" size={20} color={Colors.dark.gold} />
            <ThemedText style={styles.menuText}>Contact Support</ThemedText>
            <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
          </Pressable>
        </GoldCard>

        <GoldButton variant="outline" onPress={handleLogout} style={styles.logoutBtn}>
          Logout
        </GoldButton>

        <ThemedText type="small" style={styles.version}>
          Global Wallet v10.0.0
        </ThemedText>
      </ScrollView>

      <Modal visible={showAdminModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + Spacing.xl }]}>
            <Pressable onPress={() => setShowAdminModal(false)} style={styles.closeBtn}>
              <Feather name="x" size={24} color={Colors.dark.text} />
            </Pressable>
            {renderAdminContent()}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.dark.textInverse,
  },
  premiumBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.gold,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.dark.backgroundDefault,
  },
  mobile: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  statusTag: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  premiumTag: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
  },
  freeTag: {
    backgroundColor: "rgba(148, 163, 184, 0.2)",
  },
  premiumTagText: {
    color: Colors.dark.gold,
    fontWeight: "600",
  },
  freeTagText: {
    color: Colors.dark.textSecondary,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    color: Colors.dark.text,
  },
  menuCard: {
    marginBottom: Spacing.xl,
    padding: 0,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.borderMuted,
  },
  menuText: {
    flex: 1,
    marginLeft: Spacing.md,
    color: Colors.dark.text,
  },
  adminGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  adminModule: {
    width: "31%",
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
  },
  adminIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  adminModuleName: {
    color: Colors.dark.text,
    textAlign: "center",
    fontSize: 11,
  },
  logoutBtn: {
    marginBottom: Spacing.lg,
  },
  version: {
    textAlign: "center",
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.dark.backgroundRoot,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    minHeight: 300,
  },
  closeBtn: {
    alignSelf: "flex-end",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.xl,
  },
  statCard: {
    marginBottom: Spacing.lg,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.borderMuted,
  },
  statLabel: {
    color: Colors.dark.textSecondary,
  },
  statValue: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  netRow: {
    borderBottomWidth: 0,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.dark.gold,
  },
  netLabel: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  netValue: {
    color: Colors.dark.gold,
    fontWeight: "700",
    fontSize: 18,
  },
  premiumCard: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
  premiumLabel: {
    color: Colors.dark.textInverse,
    opacity: 0.7,
  },
  premiumCount: {
    fontSize: 48,
    fontWeight: "700",
    color: Colors.dark.textInverse,
  },
  premiumSubtext: {
    color: Colors.dark.textInverse,
    opacity: 0.7,
  },
  bigStat: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  bigStatValue: {
    fontSize: 48,
    fontWeight: "700",
    color: Colors.dark.success,
  },
  bigStatLabel: {
    color: Colors.dark.textSecondary,
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
  noDataText: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
  },
  controlDesc: {
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xl,
  },
  controlBtn: {
    marginBottom: Spacing.md,
  },
});
