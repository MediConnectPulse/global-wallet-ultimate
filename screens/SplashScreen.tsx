import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Text, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated";

import { Logo } from "@/components/Logo";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, SpringConfigs, AnimationDuration, Gradients } from "@/constants/theme";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps = {}) {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const progressWidth = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: useSharedValue(Math.random() * 400),
    y: useSharedValue(Math.random() * 800),
    scale: useSharedValue(0),
    opacity: useSharedValue(0),
  }));

  useEffect(() => {
    // Logo animation
    logoScale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 80 }),
      withSpring(1, SpringConfigs.bouncy)
    );
    logoOpacity.value = withTiming(1, {
      duration: AnimationDuration.slow,
      easing: Easing.out(Easing.exp),
    });

    // Tagline animation
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: AnimationDuration.normal }));
    taglineTranslateY.value = withDelay(400, withSpring(0, SpringConfigs.gentle));

    // Progress bar animation
    progressWidth.value = withDelay(600, withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }));

    // Glow effect
    glowOpacity.value = withSequence(
      withDelay(800, withTiming(0.6, { duration: 1000 })),
      withDelay(800, withTiming(0.3, { duration: 1000 }))
    );

    // Particle animations
    particles.forEach((particle, index) => {
      const delay = index * 100;
      particle.scale.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 60 }));
      particle.opacity.value = withSequence(
        withDelay(delay, withTiming(0.8, { duration: 1000 })),
        withDelay(delay + 1000, withTiming(0, { duration: 500 }))
      );
    });

    // Call onComplete after animation
    const timer = setTimeout(() => {
      runOnJS(onComplete || (() => {}))();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const Particle = ({ particle }: { particle: typeof particles[0] }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: particle.x.value },
        { translateY: particle.y.value },
        { scale: particle.scale.value },
      ],
      opacity: particle.opacity.value,
    }));

    return (
      <AnimatedView style={[styles.particle, animatedStyle]} />
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.deepSpaceBlue} />
      <View style={styles.container}>
        <LinearGradient colors={Gradients.dark} style={StyleSheet.absoluteFill} />

        {/* Particles */}
        {particles.map((particle, index) => (
          <Particle key={index} particle={particle} />
        ))}

        {/* Glow effect */}
        <AnimatedView style={[styles.glowContainer, glowAnimatedStyle]}>
          <View style={[styles.glow, styles.glow1]} />
          <View style={[styles.glow, styles.glow2]} />
          <View style={[styles.glow, styles.glow3]} />
        </AnimatedView>

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Logo */}
            <AnimatedView style={[styles.logoContainer, logoAnimatedStyle]}>
              <Logo size={120} showText={false} animated={false} />
            </AnimatedView>

            {/* Tagline */}
            <AnimatedView style={[styles.taglineContainer, taglineAnimatedStyle]}>
              <ThemedText type="h3" style={styles.tagline}>
                Securing Your Vault...
              </ThemedText>
            </AnimatedView>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: Colors.dark.electricGold,
                      shadowColor: Colors.dark.electricGold,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 8,
                      elevation: 8,
                    },
                    progressAnimatedStyle,
                  ]}
                />
              </View>
            </View>

            {/* Loading dots */}
            <View style={styles.dotsContainer}>
              {[0, 1, 2].map((index) => {
                const dotScale = useSharedValue(0.8);
                const dotOpacity = useSharedValue(0.4);

                useEffect(() => {
                  const animateDot = () => {
                    dotScale.value = withSequence(
                      withTiming(1.2, { duration: 400, easing: Easing.inOut(Easing.ease) }),
                      withTiming(0.8, { duration: 400, easing: Easing.inOut(Easing.ease) })
                    );
                    dotOpacity.value = withSequence(
                      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
                      withTiming(0.4, { duration: 400, easing: Easing.inOut(Easing.ease) })
                    );
                  };

                  animateDot();
                  const interval = setInterval(animateDot, 1200 + index * 200);

                  return () => clearInterval(interval);
                }, []);

                const dotAnimatedStyle = useAnimatedStyle(() => ({
                  transform: [{ scale: dotScale.value }],
                  opacity: dotOpacity.value,
                }));

                return (
                  <AnimatedView key={index} style={[styles.dot, dotAnimatedStyle]} />
                );
              })}
            </View>

            {/* Version info */}
            <AnimatedText style={styles.version}>
              v10.0.0 • Ultimate Edition
            </AnimatedText>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing["4xl"],
  },
  taglineContainer: {
    marginBottom: Spacing["4xl"],
  },
  tagline: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  progressContainer: {
    width: "80%",
    marginBottom: Spacing["3xl"],
  },
  progressBackground: {
    width: "100%",
    height: 4,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.electricGold,
  },
  version: {
    color: Colors.dark.textTertiary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: "auto",
    marginBottom: Spacing["2xl"],
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    position: "absolute",
    borderRadius: 9999,
  },
  glow1: {
    width: 300,
    height: 300,
    backgroundColor: `${Colors.dark.electricGold}10`,
  },
  glow2: {
    width: 500,
    height: 500,
    backgroundColor: `${Colors.dark.amberGold}08`,
  },
  glow3: {
    width: 700,
    height: 700,
    backgroundColor: `${Colors.dark.sunsetOrange}05`,
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.dark.electricGold,
  },
});
