import React from "react";
import { StyleSheet, Pressable, ViewStyle, StyleProp } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import {
  Colors,
  BorderRadius,
  Spacing,
  Shadows,
  SpringConfigs,
} from "@/constants/theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  onPress?: () => void;
  disabled?: boolean;
  variant?: "light" | "medium" | "strong";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function GlassCard({
  children,
  style,
  intensity = 20,
  onPress,
  disabled = false,
  variant = "medium",
}: GlassCardProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    if (!disabled && onPress) {
      scale.value = withSpring(0.98, SpringConfigs.snappy);
      translateY.value = withSpring(-2, SpringConfigs.snappy);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.gentle);
    translateY.value = withSpring(0, SpringConfigs.gentle);
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case "light":
        return "rgba(27, 38, 59, 0.5)";
      case "strong":
        return "rgba(27, 38, 59, 0.9)";
      default:
        return "rgba(27, 38, 59, 0.7)";
    }
  };

  const getBorderOpacity = () => {
    switch (variant) {
      case "light":
        return 0.2;
      case "strong":
        return 0.4;
      default:
        return 0.3;
    }
  };

  if (onPress && !disabled) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle]}
      >
        <AnimatedBlurView
          intensity={intensity}
          tint="dark"
          style={[
            styles.card,
            {
              backgroundColor: getBackgroundColor(),
              borderColor: `rgba(255, 215, 0, ${getBorderOpacity()})`,
            },
            Shadows.goldSmall,
            style,
          ]}
        >
          {children}
        </AnimatedBlurView>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedBlurView
      intensity={intensity}
      tint="dark"
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: `rgba(255, 215, 0, ${getBorderOpacity()})`,
        },
        Shadows.goldSmall,
        style,
      ]}
    >
      {children}
    </AnimatedBlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: "hidden",
  },
});
