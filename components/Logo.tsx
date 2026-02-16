import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Colors, SpringConfigs, AnimationDuration } from "@/constants/theme";

interface LogoProps {
  size?: number;
  showText?: boolean;
  animated?: boolean;
}

export function Logo({
  size = 80,
  showText = true,
  animated = true,
}: LogoProps) {
  const scale = useSharedValue(animated ? 0 : 1);
  const opacity = useSharedValue(animated ? 0 : 1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      scale.value = withSpring(1, SpringConfigs.bouncy);
      opacity.value = withTiming(1, {
        duration: AnimationDuration.slow,
        easing: Easing.out(Easing.exp),
      });
      rotation.value = withSequence(
        withTiming(360, { duration: 800, easing: Easing.out(Easing.exp) }),
        withTiming(0, { duration: 0 }),
      );
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { width: size, height: size },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={[
            Colors.dark.electricGold,
            Colors.dark.amberGold,
            Colors.dark.sunsetOrange,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.outerCircle}
        >
          <View style={styles.innerCircle}>
            <View style={styles.walletShape}>
              <LinearGradient
                colors={[Colors.dark.electricGold, Colors.dark.amberGold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.walletTop}
              />
              <View style={styles.walletBottom} />
              <View style={styles.walletLine} />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
      {showText && (
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <ThemedText type="h1" style={styles.brandText}>
            GLOBAL WALLET
          </ThemedText>
          <ThemedText type="small" style={styles.tagline}>
            Ultimate Financial Control
          </ThemedText>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  outerCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.dark.electricGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 16,
  },
  innerCircle: {
    width: "85%",
    height: "85%",
    borderRadius: 9999,
    backgroundColor: Colors.dark.deepSpaceBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  walletShape: {
    width: "50%",
    height: "50%",
    position: "relative",
  },
  walletTop: {
    width: "100%",
    height: "40%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  walletBottom: {
    width: "100%",
    height: "60%",
    backgroundColor: Colors.dark.electricGold,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    opacity: 0.8,
  },
  walletLine: {
    position: "absolute",
    top: "35%",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.dark.deepSpaceBlue,
  },
  textContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  brandText: {
    color: Colors.dark.electricGold,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 8,
  },
  tagline: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "600",
  },
});
