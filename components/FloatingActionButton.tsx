import React, { useEffect } from "react";
import { StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { Colors, Shadows } from "@/constants/theme";

interface FloatingActionButtonProps {
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: pulseScale.value * 1.3 }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Animated.View style={[styles.glow, glowStyle]} />
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, Shadows.gold]}
      >
        <LinearGradient
          colors={["#FFD700", "#D4AF37"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Feather name="mic" size={28} color={Colors.dark.textInverse} />
        </LinearGradient>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    zIndex: 100,
  },
  glow: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.electricGold,
    left: -4,
    top: -4,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
