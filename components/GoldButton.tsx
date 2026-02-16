import React from "react";
import {
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  WithSpringConfig,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import {
  Colors,
  BorderRadius,
  Spacing,
  Shadows,
  SpringConfigs,
  Gradients,
} from "@/constants/theme";

interface GoldButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: "left" | "right";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GoldButton({
  onPress,
  children,
  style,
  disabled = false,
  loading = false,
  variant = "primary",
  icon,
  iconPosition = "left",
}: GoldButtonProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.95, SpringConfigs.snappy);
      glowOpacity.value = withSequence(
        withSpring(0.8, SpringConfigs.snappy),
        withSpring(0, SpringConfigs.gentle),
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.gentle);
  };

  const isDisabled = disabled || loading;

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={
            variant === "primary"
              ? Colors.dark.textInverse
              : Colors.dark.electricGold
          }
        />
      );
    }

    return (
      <View style={styles.contentRow}>
        {icon && iconPosition === "left" && (
          <Feather
            name={icon}
            size={20}
            color={
              variant === "primary"
                ? Colors.dark.textInverse
                : Colors.dark.electricGold
            }
            style={styles.iconLeft}
          />
        )}
        <ThemedText
          type="bodyMedium"
          style={[
            variant === "primary"
              ? styles.buttonText
              : variant === "outline"
                ? styles.outlineButtonText
                : styles.secondaryButtonText,
          ]}
        >
          {children}
        </ThemedText>
        {icon && iconPosition === "right" && (
          <Feather
            name={icon}
            size={20}
            color={
              variant === "primary"
                ? Colors.dark.textInverse
                : Colors.dark.electricGold
            }
            style={styles.iconRight}
          />
        )}
      </View>
    );
  };

  if (variant === "outline") {
    return (
      <AnimatedPressable
        onPress={isDisabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={[
          styles.button,
          styles.outlineButton,
          { opacity: isDisabled ? 0.5 : 1 },
          style,
          animatedStyle,
        ]}
      >
        {renderContent()}
      </AnimatedPressable>
    );
  }

  if (variant === "secondary") {
    return (
      <AnimatedPressable
        onPress={isDisabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={[
          styles.button,
          styles.secondaryButton,
          { opacity: isDisabled ? 0.5 : 1 },
          style,
          animatedStyle,
        ]}
      >
        {renderContent()}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        styles.button,
        { opacity: isDisabled ? 0.5 : 1 },
        style,
        animatedStyle,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.glow,
          Shadows.goldGlow,
          glowAnimatedStyle,
        ]}
      />
      <LinearGradient
        colors={Gradients.gold}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {renderContent()}
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  glow: {
    borderRadius: BorderRadius.lg,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  buttonText: {
    color: Colors.dark.textInverse,
    fontWeight: "700",
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: Colors.dark.electricGold,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  outlineButtonText: {
    color: Colors.dark.electricGold,
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: Colors.dark.backgroundPrimary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
  },
  secondaryButtonText: {
    color: Colors.dark.text,
    fontWeight: "600",
    fontSize: 16,
  },
});
