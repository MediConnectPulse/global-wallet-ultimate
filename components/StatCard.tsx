import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import {
  Colors,
  BorderRadius,
  Spacing,
  Shadows,
  SpringConfigs,
  AnimationDuration,
} from "@/constants/theme";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: keyof typeof Feather.glyphMap;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "gradient" | "glass" | "solid";
  gradientColors?: string[];
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = "glass",
  gradientColors,
  style,
  onPress,
}: StatCardProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
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

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "trending-up";
      case "down":
        return "trending-down";
      default:
        return "minus";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return Colors.dark.successGreen;
      case "down":
        return Colors.dark.errorRed;
      default:
        return Colors.dark.textSecondary;
    }
  };

  const renderContent = () => (
    <>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {icon && (
            <View
              style={[
                styles.iconContainer,
                variant === "gradient" && styles.iconContainerGradient,
              ]}
            >
              <Feather
                name={icon}
                size={20}
                color={
                  variant === "gradient"
                    ? Colors.dark.textInverse
                    : Colors.dark.electricGold
                }
              />
            </View>
          )}
          <ThemedText
            type="small"
            style={[
              styles.title,
              {
                color:
                  variant === "gradient"
                    ? Colors.dark.textInverse
                    : Colors.dark.textSecondary,
              },
            ]}
          >
            {title}
          </ThemedText>
        </View>
        {trend && trendValue && (
          <View
            style={[
              styles.trendBadge,
              { backgroundColor: `${getTrendColor()}20` },
            ]}
          >
            <Feather name={getTrendIcon()} size={12} color={getTrendColor()} />
            <ThemedText
              type="caption"
              style={[styles.trendText, { color: getTrendColor() }]}
            >
              {trendValue}
            </ThemedText>
          </View>
        )}
      </View>
      <View style={styles.valueContainer}>
        <ThemedText
          type="h2"
          style={[
            styles.value,
            {
              color:
                variant === "gradient"
                  ? Colors.dark.textInverse
                  : Colors.dark.text,
            },
          ]}
        >
          {value}
        </ThemedText>
      </View>
      {subtitle && (
        <ThemedText
          type="caption"
          style={[
            styles.subtitle,
            {
              color:
                variant === "gradient"
                  ? Colors.dark.textInverse
                  : Colors.dark.textSecondary,
            },
          ]}
        >
          {subtitle}
        </ThemedText>
      )}
    </>
  );

  if (variant === "gradient") {
    const colors: [string, string, ...string[]] = (gradientColors as [
      string,
      string,
      ...string[],
    ]) || [
      Colors.dark.electricGold,
      Colors.dark.amberGold,
      Colors.dark.sunsetOrange,
    ];
    return (
      <Animated.View style={[animatedStyle, Shadows.goldMedium]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, styles.gradientCard, style]}
        >
          {renderContent()}
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.card,
        variant === "glass" ? styles.glassCard : styles.solidCard,
        Shadows.darkSmall,
        style,
        animatedStyle,
      ]}
    >
      {renderContent()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    minHeight: 120,
  },
  glassCard: {
    backgroundColor: Colors.dark.glassBackground,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  solidCard: {
    backgroundColor: Colors.dark.backgroundPrimary,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
  },
  gradientCard: {
    borderWidth: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: `${Colors.dark.electricGold}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerGradient: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  trendText: {
    fontWeight: "600",
  },
  valueContainer: {
    marginBottom: Spacing.xs,
  },
  value: {
    fontWeight: "700",
  },
  subtitle: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "500",
  },
});
