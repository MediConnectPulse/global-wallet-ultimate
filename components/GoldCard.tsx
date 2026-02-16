import React from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors, BorderRadius, Spacing, Shadows } from "@/constants/theme";

interface GoldCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "gold" | "navy" | "red";
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GoldCard({
  children,
  style,
  variant = "navy",
  onPress,
}: GoldCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const content = (
    <>
      {variant === "gold" ? (
        <LinearGradient
          colors={["#FFD700", "#D4AF37", "#FFD700"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, styles.goldCard, style]}
        >
          {children}
        </LinearGradient>
      ) : variant === "red" ? (
        <LinearGradient
          colors={["#EF4444", "#DC2626", "#B91C1C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, style]}
        >
          {children}
        </LinearGradient>
      ) : (
        <View style={[styles.card, styles.navyCard, style]}>{children}</View>
      )}
    </>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[Shadows.goldSmall, animatedStyle]}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return <View style={Shadows.goldSmall}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  navyCard: {
    backgroundColor: Colors.dark.backgroundPrimary,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
  },
  goldCard: {},
});
