import { withTiming, withSpring, Easing, WithSpringConfig, WithTimingConfig } from "react-native-reanimated";
import { SpringConfigs, AnimationDuration } from "@/constants/theme";

// Fade animations
export const FadeIn = (duration: number = AnimationDuration.normal) => {
  return withTiming(1, {
    duration,
    easing: Easing.out(Easing.exp),
  });
};

export const FadeOut = (duration: number = AnimationDuration.normal) => {
  return withTiming(0, {
    duration,
    easing: Easing.in(Easing.exp),
  });
};

// Slide animations
export const SlideInUp = (distance: number = 100, duration: number = AnimationDuration.normal) => {
  return withSpring(0, SpringConfigs.gentle);
};

export const SlideInDown = (distance: number = 100, duration: number = AnimationDuration.normal) => {
  return withSpring(0, SpringConfigs.gentle);
};

export const SlideInLeft = (distance: number = 100, duration: number = AnimationDuration.normal) => {
  return withSpring(0, SpringConfigs.gentle);
};

export const SlideInRight = (distance: number = 100, duration: number = AnimationDuration.normal) => {
  return withSpring(0, SpringConfigs.gentle);
};

// Scale animations
export const ScaleIn = (config?: WithSpringConfig) => {
  return withSpring(1, config || SpringConfigs.gentle);
};

export const ScaleOut = (config?: WithSpringConfig) => {
  return withSpring(0, config || SpringConfigs.snappy);
};

export const Bounce = () => {
  return withSpring(1, SpringConfigs.bouncy);
};

// Rotation animations
export const RotateIn = (duration: number = AnimationDuration.normal) => {
  return withTiming(360, {
    duration,
    easing: Easing.out(Easing.exp),
  });
};

export const RotateOut = (duration: number = AnimationDuration.normal) => {
  return withTiming(0, {
    duration,
    easing: Easing.in(Easing.exp),
  });
};

// Staggered animation helper
export const getStaggerDelay = (index: number, staggerInterval: number = 100) => {
  return index * staggerInterval;
};

// Press animation
export const PressAnimation = {
  in: () => withSpring(0.95, SpringConfigs.snappy),
  out: () => withSpring(1, SpringConfigs.gentle),
};

// Pulse animation
export const Pulse = () => {
  return withSpring(1.05, {
    ...SpringConfigs.bouncy,
    mass: 0.5,
  });
};
