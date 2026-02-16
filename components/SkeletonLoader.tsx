import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { Colors, BorderRadius, Spacing } from "@/constants/theme";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  variant?: "card" | "text" | "avatar" | "rectangle";
}

export function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = BorderRadius.sm,
  style,
  variant = "rectangle",
}: SkeletonLoaderProps) {
  const shimmerAnimation = useSharedValue(0);

  useEffect(() => {
    shimmerAnimation.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerAnimation.value, [0, 1], [-300, 300]);

    return {
      transform: [{ translateX }],
    };
  });

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "card":
        return {
          width: "100%",
          height: 120,
          borderRadius: BorderRadius.xl,
        };
      case "avatar":
        return {
          width: 60,
          height: 60,
          borderRadius: 9999,
        };
      case "text":
        return {
          width: typeof width === "number" ? width : undefined,
          height: 16,
          borderRadius: BorderRadius.xs,
        };
      default:
        return {
          width: typeof width === "number" ? width : undefined,
          height,
          borderRadius,
        };
    }
  };

  return (
    <View style={[styles.container, getVariantStyle(), style]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.shimmer]}>
        <LinearGradient
          colors={[
            Colors.dark.backgroundPrimary,
            Colors.dark.backgroundSecondary,
            Colors.dark.backgroundPrimary,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[styles.shimmerOverlay, animatedStyle]}>
          <LinearGradient
            colors={["transparent", "rgba(255, 255, 255, 0.05)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export function SkeletonGroup({ count = 3 }: { count: number }) {
  return (
    <View style={styles.group}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonLoader key={index} variant="card" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.backgroundPrimary,
    overflow: "hidden",
  },
  shimmer: {
    overflow: "hidden",
  },
  shimmerOverlay: {
    width: "100%",
    height: "100%",
  },
  group: {
    gap: Spacing.md,
  },
});
