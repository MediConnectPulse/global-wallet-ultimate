import React from "react";
import { StyleSheet, Pressable, ViewStyle, StyleProp, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Colors, BorderRadius, Spacing, Shadows } from "@/constants/theme";

interface GoldButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GoldButton({
  onPress,
  children,
  style,
  disabled = false,
  loading = false,
  variant = "primary",
}: GoldButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.96, springConfig);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const isDisabled = disabled || loading;

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
        {loading ? (
          <ActivityIndicator color={Colors.dark.gold} />
        ) : (
          <ThemedText type="body" style={styles.outlineButtonText}>
            {children}
          </ThemedText>
        )}
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
        {loading ? (
          <ActivityIndicator color={Colors.dark.text} />
        ) : (
          <ThemedText type="body" style={styles.secondaryButtonText}>
            {children}
          </ThemedText>
        )}
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
        Shadows.gold,
        style,
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={["#FFD700", "#D4AF37"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={Colors.dark.textInverse} />
        ) : (
          <ThemedText type="body" style={styles.buttonText}>
            {children}
          </ThemedText>
        )}
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
  buttonText: {
    color: Colors.dark.textInverse,
    fontWeight: "700",
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: Colors.dark.gold,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  outlineButtonText: {
    color: Colors.dark.gold,
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: Colors.dark.backgroundDefault,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  secondaryButtonText: {
    color: Colors.dark.text,
    fontWeight: "600",
    fontSize: 16,
  },
});
