import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  RefreshControl,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { supabase } from "../lib/supabase";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { GoldButton } from "@/components/GoldButton";
import { ThemedText } from "@/components/ThemedText";
import { AnimatedInput } from "@/components/AnimatedInput";
import { Colors, Spacing, BorderRadius, Gradients, SpringConfigs, AnimationDuration } from "@/constants/theme";

const AnimatedView = Animated.createAnimatedComponent(View);

interface Stats {
  downloads: number;
  subs: number;
  referrers: number;
  gross: number;
  net: number;
}

interface Settings {
  subscription_fee: number;
  current_cycle_id: string;
  t1_reward: number;
  t2_reward: number;
  notice_board_text: string;
  campaign_is_active: boolean;
  campaign_title: string;
}

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<Stats>({
    downloads: 0,
    subs: 0,
    referrers: 0,
    gross: 0,
    net: 0,
  });
  const [settings, setSettings] = useState<Settings>({
    subscription_fee: 500,
    current_cycle_id: "1",
    t1_reward: 100,
    t2_reward: 50,
    notice_board_text: "",
    campaign_is_active: false,
    campaign_title: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [pnlRes, gsRes] = await Promise.all([
        supabase.from("admin_pnl_intelligence").select("*").single(),
        supabase.from("global_settings").select("*").single(),
      ]);

      if (pnlRes.data) {
        setStats({
          downloads: pnlRes.data.total_downloads || 0,
          subs: pnlRes.data.active_subscriptions || 0,
          referrers: pnlRes.data.active_referrers || 0,
          gross: pnlRes.data.gross_revenue || 0,
          net: pnlRes.data.net_profit || 0,
        });
      }

      if (gsRes.data) {
        setSettings({
          subscription_fee: gsRes.data.subscription_fee || 500,
          current_cycle_id: gsRes.data.current_cycle_id || "1",
          t1_reward: gsRes.data.t1_reward || 100,
          t2_reward: gsRes.data.t2_reward || 50,
          notice_board_text: gsRes.data.notice_board_text || "",
          campaign_is_active: gsRes.data.campaign_is_active || false,
          campaign_title: gsRes.data.campaign_title || "",
        });
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      const { error } = await supabase
        .from("global_settings")
        .update(settings)
        .eq("id", 1);

      if (!error) {
        Alert.alert("Success", "Global UI and Rewards updated instantly.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        fetchAdminData();
      } else {
        Alert.alert("Error", "Failed to update settings. Please try again.");
      }
    } catch (error) {
      console.error("Error publishing:", error);
      Alert.alert("Error", "An error occurred while publishing changes.");
    }
  };

  const AnimatedStatCard = ({ title, value, icon, gradient, delay = 0 }: any) => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
      setTimeout(() => {
        scale.value = withSpring(1, SpringConfigs.gentle);
        opacity.value = withTiming(1, {
          duration: AnimationDuration.slow,
          easing: Easing.out(Easing.exp),
        });
      }, delay);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    return (
      <AnimatedView style={[animatedStyle, styles.statCardWrapper]}>
        <StatCard
          title={title}
          value={value}
          icon={icon}
          variant={gradient ? "gradient" : "glass"}
          gradientColors={gradient}
          style={styles.statCard}
        />
      </AnimatedView>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.dark} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: 100, paddingTop: insets.top + 20 },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchAdminData} tintColor={Colors.dark.electricGold} />
            }
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerIconContainer}>
                <LinearGradient colors={Gradients.gold} style={styles.headerIconGradient}>
                  <Feather name="shield" size={28} color={Colors.dark.textInverse} />
                </LinearGradient>
              </View>
              <ThemedText type="h2" style={styles.headerTitle}>
                Master Command Hub
              </ThemedText>
              <ThemedText type="small" style={styles.headerSubtitle}>
                Admin control center
              </ThemedText>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <AnimatedStatCard
                title="Total Downloads"
                value={stats.downloads}
                icon="download"
                delay={0}
                style={styles.fullWidthStat}
              />
              <AnimatedStatCard
                title="Active Subscriptions"
                value={stats.subs}
                icon="credit-card"
                delay={100}
              />
              <AnimatedStatCard
                title="Active Referrers"
                value={stats.referrers}
                icon="users"
                delay={200}
              />
              <AnimatedStatCard
                title="Gross Revenue"
                value={`₹${stats.gross.toLocaleString("en-IN")}`}
                icon="trending-up"
                delay={300}
              />
              <AnimatedStatCard
                title="Net Profit"
                value={`₹${stats.net.toLocaleString("en-IN")}`}
                icon="dollar-sign"
                gradient={Gradients.success}
                delay={400}
                style={styles.fullWidthStat}
              />
            </View>

            {/* Settings Card */}
            <GlassCard style={styles.settingsCard} variant="medium">
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Feather name="sliders" size={20} color={Colors.dark.electricGold} />
                  <ThemedText type="h5" style={styles.cardTitle}>
                    Global Settings
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => {
                    setIsEditing(!isEditing);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Feather
                    name={isEditing ? "check-circle" : "edit-3"}
                    size={20}
                    color={Colors.dark.electricGold}
                  />
                </Pressable>
              </View>

              <View style={styles.inputGrid}>
                <View style={styles.inputBox}>
                  <ThemedText type="caption" style={styles.inputLabel}>
                    SUBSCRIPTION FEE (₹)
                  </ThemedText>
                  <TextInput
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                    value={String(settings.subscription_fee)}
                    onChangeText={(v) => setSettings({ ...settings, subscription_fee: Number(v) })}
                    keyboardType="numeric"
                    editable={isEditing}
                    placeholder="500"
                    placeholderTextColor={Colors.dark.textTertiary}
                  />
                </View>
                <View style={styles.inputBox}>
                  <ThemedText type="caption" style={styles.inputLabel}>
                    CYCLE ID
                  </ThemedText>
                  <TextInput
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                    value={settings.current_cycle_id}
                    onChangeText={(v) => setSettings({ ...settings, current_cycle_id: v })}
                    placeholder="1"
                    placeholderTextColor={Colors.dark.textTertiary}
                    editable={isEditing}
                  />
                </View>
                <View style={styles.inputBox}>
                  <ThemedText type="caption" style={styles.inputLabel}>
                    TIER-1 REWARD (₹)
                  </ThemedText>
                  <TextInput
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                    value={String(settings.t1_reward)}
                    onChangeText={(v) => setSettings({ ...settings, t1_reward: Number(v) })}
                    keyboardType="numeric"
                    placeholder="100"
                    placeholderTextColor={Colors.dark.textTertiary}
                    editable={isEditing}
                  />
                </View>
                <View style={styles.inputBox}>
                  <ThemedText type="caption" style={styles.inputLabel}>
                    TIER-2 REWARD (₹)
                  </ThemedText>
                  <TextInput
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                    value={String(settings.t2_reward)}
                    onChangeText={(v) => setSettings({ ...settings, t2_reward: Number(v) })}
                    keyboardType="numeric"
                    placeholder="50"
                    placeholderTextColor={Colors.dark.textTertiary}
                    editable={isEditing}
                  />
                </View>
              </View>

              <ThemedText type="caption" style={styles.textAreaLabel}>
                CAMPAIGN / NOTICE NEWS
              </ThemedText>
              <TextInput
                style={[styles.textArea, !isEditing && styles.inputDisabled]}
                value={settings.notice_board_text}
                onChangeText={(v) => setSettings({ ...settings, notice_board_text: v })}
                multiline
                numberOfLines={4}
                placeholder="Enter announcement text..."
                placeholderTextColor={Colors.dark.textTertiary}
                editable={isEditing}
                textAlignVertical="top"
              />

              <GoldButton
                onPress={handlePublish}
                icon="send"
                disabled={!isEditing}
                style={styles.publishButton}
              >
                Publish Changes Globally
              </GoldButton>
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  headerIconContainer: {
    marginBottom: Spacing.lg,
  },
  headerIconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.dark.electricGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
  },
  headerTitle: {
    color: Colors.dark.electricGold,
    textAlign: "center",
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing["2xl"],
    gap: Spacing.lg,
  },
  statCardWrapper: {
    width: "48%",
  },
  fullWidthStat: {
    width: "100%",
  },
  statCard: {
    flex: 1,
  },
  settingsCard: {
    marginBottom: Spacing.xl,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cardTitle: {
    color: Colors.dark.text,
  },
  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  inputBox: {
    width: "48%",
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    color: Colors.dark.textSecondary,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.dark.backgroundPrimary,
    color: Colors.dark.text,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
    fontSize: 16,
    fontWeight: "600",
  },
  inputDisabled: {
    opacity: 0.6,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  textAreaLabel: {
    color: Colors.dark.textSecondary,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  textArea: {
    backgroundColor: Colors.dark.backgroundPrimary,
    color: Colors.dark.text,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: Spacing["2xl"],
  },
  publishButton: {
    width: "100%",
  },
});
