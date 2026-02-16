import Animated, {
  SharedValue,
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
} from "react-native-reanimated";
import { useEffect } from "react";

import { SpringConfigs, AnimationDuration } from "@/constants/theme";

// ============ ANIMATION PRESETS ============

export const Presets = {
  fadeIn: (duration: number = AnimationDuration.normal) =>
    withTiming(1, {
      duration,
      easing: Easing.out(Easing.exp),
    }),

  fadeOut: (duration: number = AnimationDuration.normal) =>
    withTiming(0, {
      duration,
      easing: Easing.in(Easing.exp),
    }),

  slideInRight: (delay: number = 0) =>
    withSequence(
      withDelay(
        delay,
        withTiming(0, {
          duration: AnimationDuration.normal,
          easing: Easing.out(Easing.exp),
        })
      )
    ),

  slideOutRight: () =>
    withTiming(300, {
      duration: AnimationDuration.normal,
      easing: Easing.in(Easing.exp),
    }),

  slideInUp: (delay: number = 0) =>
    withSequence(
      withDelay(
        delay,
        withSpring(0, {
          damping: 20,
          stiffness: 100,
        })
      )
    ),

  scaleIn: (springConfig = SpringConfigs.bouncy) =>
    withSpring(1, springConfig),

  scaleOut: () =>
    withTiming(0, {
      duration: AnimationDuration.fast,
      easing: Easing.in(Easing.back),
    }),

  rotateIn: () =>
    withSequence(
      withTiming(360, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      }),
      withTiming(0, { duration: 0 })
    ),

  pulse: () =>
    withRepeat(
      withSequence(
        withTiming(1.1, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    ),

  shimmer: () =>
    withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    ),

  bounce: () =>
    withSequence(
      withTiming(-10, { duration: 150, easing: Easing.out(Easing.exp) }),
      withTiming(0, { duration: 300, easing: Easing.bounce })
    ),
};

// ============ STAGGERED ANIMATIONS ============

export const staggeredAnimation = (
  index: number,
  delay: number = 100
) => {
  return withDelay(
    index * delay,
    withSpring(1, {
      damping: 20,
      stiffness: 100,
    })
  );
};

// ============ SPRING ANIMATIONS ============

export const springConfig = {
  gentle: {
    damping: 20,
    mass: 0.5,
    stiffness: 120,
    overshootClamping: false,
  },
  snappy: {
    damping: 15,
    mass: 0.3,
    stiffness: 150,
    overshootClamping: true,
  },
  bouncy: {
    damping: 12,
    mass: 0.8,
    stiffness: 100,
    overshootClamping: false,
  },
  stiff: {
    damping: 25,
    mass: 0.2,
    stiffness: 200,
    overshootClamping: true,
  },
} as const;

export const createSpring = (
  toValue: number,
  config: Partial<typeof springConfig.gentle> = {}
) => withSpring(toValue, { ...springConfig.gentle, ...config });

// ============ TIMING ANIMATIONS ============

export const timingConfig = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
} as const;

export const createTiming = (
  toValue: number,
  duration: number = timingConfig.normal,
  easing = Easing.out(Easing.exp)
) => withTiming(toValue, { duration, easing });

// ============ HELPER FUNCTIONS ============

export const useFadeIn = (delay: number = 0) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: AnimationDuration.slow,
        easing: Easing.out(Easing.exp),
      })
    );
  }, []);

  return opacity;
};

export const useScaleIn = (delay: number = 0) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, springConfig.gentle));
  }, []);

  return scale;
};

export const useSlideIn = (delay: number = 0, direction: "up" | "down" | "left" | "right" = "up") => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    const fromValue = direction === "up" ? 50 : direction === "down" ? -50 : direction === "left" ? 50 : -50;

    if (direction === "up" || direction === "down") {
      translateY.value = withDelay(
        delay,
        withSpring(0, springConfig.gentle)
      );
    } else {
      translateX.value = withDelay(
        delay,
        withSpring(0, springConfig.gentle)
      );
    }
  }, []);

  return { translateY, translateX };
};

// ============ COMMON ANIMATION HOOKS ============

export const usePressAnimation = () => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, springConfig.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig.gentle);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, handlePressIn, handlePressOut };
};

export const useHoverAnimation = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  const handleHoverIn = () => {
    scale.value = withSpring(1.02, springConfig.gentle);
    opacity.value = withTiming(1, { duration: 150 });
  };

  const handleHoverOut = () => {
    scale.value = withSpring(1, springConfig.gentle);
    opacity.value = withTiming(0.6, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle, handleHoverIn, handleHoverOut };
};

export const useShimmerAnimation = (duration: number = 1500) => {
  const translateX = useSharedValue(-300);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(300, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(-300, {
          duration: 0,
        })
      ),
      -1,
      false
    );
  }, []);

  return translateX;
};

// ============ LIST ANIMATIONS ============

export const useListItemAnimation = (index: number, total: number) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = index * 50;
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: AnimationDuration.normal,
        easing: Easing.out(Easing.exp),
      })
    );
    translateY.value = withDelay(delay, withSpring(0, springConfig.gentle));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
};

// ============ MODAL ANIMATIONS ============

export const useModalAnimation = (visible: boolean) => {
  const backdropOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);
  const modalTranslateY = useSharedValue(50);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 200 });
      modalScale.value = withSpring(1, springConfig.gentle);
      modalTranslateY.value = withSpring(0, springConfig.gentle);
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      modalScale.value = withSpring(0.8, springConfig.snappy);
      modalTranslateY.value = withSpring(50, springConfig.snappy);
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: modalScale.value },
      { translateY: modalTranslateY.value },
    ],
  }));

  return { backdropStyle, modalStyle };
};

// ============ TRANSITION ANIMATIONS ============

export const usePageTransition = (isEntering: boolean) => {
  const opacity = useSharedValue(isEntering ? 0 : 1);
  const scale = useSharedValue(isEntering ? 0.95 : 1);

  useEffect(() => {
    if (isEntering) {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.exp) });
      scale.value = withSpring(1, springConfig.gentle);
    } else {
      opacity.value = withTiming(0, { duration: 250, easing: Easing.in(Easing.exp) });
      scale.value = withSpring(0.95, springConfig.snappy);
    }
  }, [isEntering]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
};

// ============ COLOR ANIMATIONS ============

export const useColorAnimation = (
  fromColor: string,
  toColor: string,
  active: boolean
) => {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(
      active ? 1 : 0,
      { duration: 200, easing: Easing.out(Easing.exp) }
    );
  }, [active]);

  const color = useDerivedValue(() =>
    interpolateColor(
      progress.value,
      [0, 1],
      [fromColor, toColor]
    )
  );

  return color;
};

// ============ LOADING ANIMATIONS ============

export const useLoadingDots = (count: number = 3) => {
  const dots = Array.from({ length: count }, () => useSharedValue(0.4));

  useEffect(() => {
    dots.forEach((dot, index) => {
      dot.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false,
        index * 200
      );
    });
  }, []);

  return dots;
};

// ============ EXPORT ALL ============

export {
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
};

export { Animated };
