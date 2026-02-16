import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { Logo } from "@/components/Logo";
import { GlassCard } from "@/components/GlassCard";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, Gradients } from "@/constants/theme";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Payment Verified",
    message: "Your payment of ₹500 has been verified and added to your wallet.",
    type: "success",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Withdrawal Processing",
    message: "Your withdrawal request of ₹1,000 is being processed.",
    type: "info",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    title: "New Referral",
    message: "You earned ₹50 bonus from your referral's first deposit.",
    type: "reward",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    title: "Subscription Expiring",
    message: "Your premium subscription will expire in 7 days.",
    type: "warning",
    time: "2 days ago",
    read: true,
  },
  {
    id: "5",
    title: "Welcome to Global Wallet",
    message: "Thank you for joining Global Wallet. Start earning today!",
    type: "info",
    time: "3 days ago",
    read: true,
  },
];

const NOTIFICATION_ICONS: Record<string, any> = {
  success: "check-circle",
  info: "info",
  reward: "gift",
  warning: "alert-triangle",
  error: "x-circle",
};

const NOTIFICATION_COLORS: Record<string, string> = {
  success: Colors.dark.successGreen,
  info: Colors.dark.primaryBlue,
  reward: Colors.gold,
  warning: Colors.dark.warningAmber,
  error: Colors.dark.errorRed,
};

export default function NotificationScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
          <View style={styles.headerTitleContainer}>
            <ThemedText type="h3" style={styles.headerTitle}>
              Notifications
            </ThemedText>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <ThemedText type="caption" style={styles.badgeText}>
                  {unreadCount}
                </ThemedText>
              </View>
            )}
          </View>
          {unreadCount > 0 && (
            <Pressable onPress={markAllAsRead} style={styles.markAllButton}>
              <ThemedText type="small" style={styles.markAllText}>
                Mark all read
              </ThemedText>
            </Pressable>
          )}
        </View>

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <Logo size={80} showText={false} animated={true} />
              <ThemedText type="h3" style={styles.emptyTitle}>
                No Notifications
              </ThemedText>
              <ThemedText type="small" style={styles.emptyText}>
                You're all caught up! Check back later for updates.
              </ThemedText>
            </GlassCard>
          ) : (
            notifications.map((notification) => (
              <Pressable
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.notificationCardUnread,
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                <View
                  style={[
                    styles.notificationIcon,
                    {
                      backgroundColor: `${NOTIFICATION_COLORS[notification.type]}20`,
                    },
                  ]}
                >
                  <Feather
                    name={NOTIFICATION_ICONS[notification.type]}
                    size={24}
                    color={NOTIFICATION_COLORS[notification.type]}
                  />
                </View>

                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <ThemedText type="subtitle" style={styles.notificationTitle}>
                      {notification.title}
                    </ThemedText>
                    {!notification.read && (
                      <View style={styles.unreadDot} />
                    )}
                  </View>

                  <ThemedText type="small" style={styles.notificationMessage}>
                    {notification.message}
                  </ThemedText>

                  <ThemedText type="caption" style={styles.notificationTime}>
                    {notification.time}
                  </ThemedText>
                </View>

                <Feather
                  name="chevron-right"
                  size={20}
                  color={Colors.dark.textSecondary}
                />
              </Pressable>
            ))
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
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    color: Colors.dark.text,
  },
  badge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: Spacing.sm,
  },
  badgeText: {
    color: Colors.dark.background,
    fontWeight: "600",
  },
  markAllButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  markAllText: {
    color: Colors.gold,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing.xl,
  },
  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
  },
  emptyTitle: {
    color: Colors.dark.text,
    marginTop: Spacing.xl,
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.glassBackground,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  notificationCardUnread: {
    backgroundColor: `${Colors.gold}10`,
    borderColor: `${Colors.gold}30`,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  notificationTitle: {
    color: Colors.dark.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
  notificationMessage: {
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  notificationTime: {
    color: Colors.dark.textTertiary,
  },
});
