import React from "react";
import { StyleSheet, View, ScrollView, Pressable, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Share from "expo-share";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useAuth } from "@/lib/auth";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { GoldButton } from "@/components/GoldButton";
import { ThemedText } from "@/components/ThemedText";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { Colors, Spacing, BorderRadius, Gradients, SpringConfigs, AnimationDuration } from "@/constants/theme";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isPremium = user?.subscription_status === "premium";

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(1, SpringConfigs.gentle);
    opacity.value = withTiming(1, {
      duration: AnimationDuration.slow,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleUpgrade = () => {
    Alert.alert(
      "⭐ Premium Feature",
      "Upgrade to Premium to access detailed analytics, export reports, and more!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Upgrade",
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // Navigate to upgrade flow
          },
        },
      ]
    );
  };

  const handleExportPDF = () => {
    if (!isPremium) {
      handleUpgrade();
      return;
    }
    Alert.alert("Export PDF", "Your report will be generated and saved.");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleShareReport = async () => {
    if (!isPremium) {
      handleUpgrade();
      return;
    }

    const report = `💎 GLOBAL WALLET REPORT\n\nUser: ${user?.full_name}\nStatus: ${isPremium ? "Premium" : "Free"}\n\nReport Generated: ${new Date().toLocaleDateString()}`;

    try {
      await Share.share({ message: report });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const ChartPlaceholder = () => (
    <View style={styles.chartPlaceholder}>
      <Feather name="bar-chart-2" size={48} color={Colors.dark.textSecondary} />
      <ThemedText type="h4" style={styles.placeholderTitle}>
        No Data Available
      </ThemedText>
      <ThemedText type="small" style={styles.placeholderText}>
        Start tracking expenses to see your analytics
      </ThemedText>
    </View>
  );

  const BlurredChart = ({ title }: { title: string }) => (
    <View style={styles.blurredChartContainer}>
      <View style={styles.blurredContent}>
        <Feather name="lock" size={32} color={Colors.dark.electricGold} />
        <ThemedText type="h4" style={styles.blurredTitle}>
          Premium Feature
        </ThemedText>
        <ThemedText type="small" style={styles.blurredText}>
          {title}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.dark} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120, paddingTop: insets.top + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconContainer}>
                <LinearGradient colors={Gradients.gold} style={styles.headerIconGradient}>
                  <Feather name="pie-chart" size={24} color={Colors.dark.textInverse} />
                </LinearGradient>
              </View>
              <View>
                <ThemedText type="h3" style={styles.headerTitle}>
                  Wealth Analytics
                </ThemedText>
                <ThemedText type="small" style={styles.headerSubtitle}>
                  Detailed insights & reports
                </ThemedText>
              </View>
            </View>
            <Pressable
              onPress={handleExportPDF}
              style={[styles.headerButton, !isPremium && styles.headerButtonDisabled]}
              hitSlop={8}
            >
              <Feather
                name="download"
                size={20}
                color={isPremium ? Colors.dark.electricGold : Colors.dark.textTertiary}
              />
            </Pressable>
          </View>

          {/* Overview Stats */}
          <View style={styles.overviewGrid}>
            <AnimatedView style={[animatedStyle, styles.statWrapper]}>
              <StatCard
                title="Monthly Spend"
                value="₹12,450"
                subtitle="This month"
                icon="trending-down"
                trend="down"
                trendValue="-8%"
                variant="gradient"
                gradientColors={[Gradients.error[0], Gradients.error[1]]}
                style={styles.statCard}
              />
            </AnimatedView>
            <AnimatedView style={[animatedStyle, styles.statWrapper]}>
              <StatCard
                title="Savings Rate"
                value="32%"
                subtitle="Of income"
                icon="percent"
                trend="up"
                trendValue="+5%"
                variant="gradient"
                gradientColors={Gradients.success}
                style={styles.statCard}
              />
            </AnimatedView>
          </View>

          {/* Category Breakdown */}
          <ThemedText type="h5" style={styles.sectionTitle}>
            Category Breakdown
          </ThemedText>

          <GlassCard style={styles.chartCard} variant="medium">
            {isPremium ? <ChartPlaceholder /> : <BlurredChart title="Spending by category" />}
          </GlassCard>

          {/* Monthly Trend */}
          <ThemedText type="h5" style={styles.sectionTitle}>
            Monthly Trend
          </ThemedText>

          <GlassCard style={styles.chartCard} variant="medium">
            {isPremium ? <ChartPlaceholder /> : <BlurredChart title="6-month spending trend" />}
          </GlassCard>

          {/* Income vs Expense */}
          <ThemedText type="h5" style={styles.sectionTitle}>
            Income vs Expense
          </ThemedText>

          <GlassCard style={styles.chartCard} variant="medium">
            {isPremium ? <ChartPlaceholder /> : <BlurredChart title="Income and expense comparison" />}
          </GlassCard>

          {/* Export Options */}
          <GlassCard style={styles.exportCard} variant="light">
            <ThemedText type="h5" style={styles.exportTitle}>
              Export Reports
            </ThemedText>
            <ThemedText type="small" style={styles.exportSubtitle}>
              Share your financial insights
            </ThemedText>

            <View style={styles.exportButtons}>
              <GoldButton
                onPress={handleShareReport}
                icon="share-2"
                variant={isPremium ? "primary" : "outline"}
                disabled={!isPremium}
                style={styles.exportButton}
              >
                Share Report
              </GoldButton>
              <GoldButton
                onPress={handleExportPDF}
                icon="file-text"
                variant={isPremium ? "primary" : "outline"}
                disabled={!isPremium}
                style={styles.exportButton}
              >
                Export PDF
              </GoldButton>
            </View>
          </GlassCard>

          {!isPremium && (
            <GlassCard style={styles.upgradeCard} variant="medium">
              <View style={styles.upgradeContent}>
                <View style={styles.upgradeIconContainer}>
                  <LinearGradient colors={Gradients.gold} style={styles.upgradeIconGradient}>
                    <Feather name="star" size={32} color={Colors.dark.textInverse} />
                  </LinearGradient>
                </View>
                <ThemedText type="h4" style={styles.upgradeTitle}>
                  Unlock Premium Analytics
                </ThemedText>
                <ThemedText type="small" style={styles.upgradeText}>
                  Get detailed insights, custom reports, and advanced analytics
                </ThemedText>
                <GoldButton onPress={handleUpgrade} icon="zap" style={styles.upgradeButton}>
                  Upgrade Now
                </GoldButton>
              </View>
            </GlassCard>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  headerIconContainer: {
    shadowColor: Colors.dark.electricGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  headerIconGradient: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    color: Colors.dark.textSecondary,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.glassBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  headerButtonDisabled: {
    opacity: 0.4,
  },
  overviewGrid: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginBottom: Spacing["2xl"],
  },
  statWrapper: {
    flex: 1,
  },
  statCard: {
    flex: 1,
  },
  sectionTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.lg,
  },
  chartCard: {
    marginBottom: Spacing.xl,
    minHeight: 200,
  },
  chartPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["4xl"],
  },
  placeholderTitle: {
    color: Colors.dark.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  placeholderText: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
  },
  blurredChartContainer: {
    position: "relative",
    height: 200,
  },
  blurredContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${Colors.dark.backgroundPrimary}CC`,
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  blurredTitle: {
    color: Colors.dark.electricGold,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  blurredText: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
  exportCard: {
    marginBottom: Spacing.xl,
  },
  exportTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  exportSubtitle: {
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.lg,
  },
  exportButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  exportButton: {
    flex: 1,
  },
  upgradeCard: {
    marginBottom: Spacing.xl,
  },
  upgradeContent: {
    alignItems: "center",
  },
  upgradeIconContainer: {
    marginBottom: Spacing.lg,
  },
  upgradeIconGradient: {
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
  upgradeTitle: {
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  upgradeText: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  upgradeButton: {
    width: "100%",
  },
});
