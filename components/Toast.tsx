import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import {
  Colors,
  Spacing,
  BorderRadius,
  SpringConfigs,
  AnimationDuration,
} from "@/constants/theme";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  visible: boolean;
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 3000,
  visible,
  onDismiss,
  actionLabel,
  onAction,
}: ToastProps) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const progress = useSharedValue(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (visible) {
      // Show toast
      translateY.value = withSpring(0, SpringConfigs.snappy);
      opacity.value = withTiming(1, {
        duration: AnimationDuration.fast,
        easing: Easing.out(Easing.exp),
      });

      // Animate progress bar
      progress.value = withTiming(1, { duration, easing: Easing.linear });

      // Auto dismiss
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, duration);

      // Haptic feedback
      switch (type) {
        case "success":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case "error":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case "warning":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      handleDismiss();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible]);

  const handleDismiss = () => {
    translateY.value = withSpring(-100, SpringConfigs.snappy);
    opacity.value = withTiming(0, {
      duration: AnimationDuration.fast,
      easing: Easing.in(Easing.exp),
    });

    const timer = setTimeout(() => {
      runOnJS(onDismiss)();
    }, AnimationDuration.fast);

    return () => clearTimeout(timer);
  };

  const handleAction = () => {
    onAction?.();
    handleDismiss();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const getIcon = (): keyof typeof Feather.glyphMap => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "x-circle";
      case "warning":
        return "alert-triangle";
      default:
        return "info";
    }
  };

  const getGradientColors = () => {
    switch (type) {
      case "success":
        return [Colors.dark.successGreen, Colors.dark.successGreenDark];
      case "error":
        return [Colors.dark.errorRed, Colors.dark.errorRedDark];
      case "warning":
        return [Colors.dark.warningAmber, "#FF9800"];
      default:
        return [Colors.dark.infoBlue, "#1976D2"];
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return Colors.dark.successGreen;
      case "error":
        return Colors.dark.errorRed;
      case "warning":
        return Colors.dark.warningAmber;
      default:
        return Colors.dark.infoBlue;
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <AnimatedView style={[styles.container, animatedStyle]}>
        <View
          style={[
            styles.toast,
            {
              borderColor: getBorderColor(),
              borderWidth: 1,
            },
          ]}
        >
          <View style={styles.content}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${getBorderColor()}20` },
              ]}
            >
              <Feather name={getIcon()} size={20} color={getBorderColor()} />
            </View>

            <View style={styles.messageContainer}>
              <ThemedText type="bodyMedium" style={styles.message}>
                {message}
              </ThemedText>
            </View>

            {actionLabel && onAction && (
              <AnimatedPressable
                onPress={handleAction}
                style={styles.actionButton}
              >
                <ThemedText
                  type="smallMedium"
                  style={[styles.actionText, { color: getBorderColor() }]}
                >
                  {actionLabel}
                </ThemedText>
              </AnimatedPressable>
            )}

            <AnimatedPressable
              onPress={handleDismiss}
              style={styles.dismissButton}
              hitSlop={8}
            >
              <Feather name="x" size={18} color={Colors.dark.textSecondary} />
            </AnimatedPressable>
          </View>

          <View style={styles.progressContainer}>
            <AnimatedView
              style={[
                styles.progressBar,
                progressAnimatedStyle,
                { backgroundColor: getBorderColor() },
              ]}
            />
          </View>
        </View>
      </AnimatedView>
    </SafeAreaView>
  );
}

// Toast manager for global access
let toastVisible = false;
let toastProps: Partial<ToastProps> = {};
let setToastVisibleFn: ((visible: boolean) => void) | null = null;
let setToastPropsFn: ((props: Partial<ToastProps>) => void) | null = null;

export const showToast = (props: Omit<ToastProps, "visible" | "onDismiss">) => {
  if (setToastVisibleFn && setToastPropsFn) {
    toastProps = props;
    setToastPropsFn(toastProps);
    setToastVisibleFn(true);
  }
};

export const hideToast = () => {
  if (setToastVisibleFn) {
    setToastVisibleFn(false);
  }
};

export function useToast() {
  const [visible, setVisible] = React.useState(false);
  const [props, setProps] = React.useState<Partial<ToastProps>>({});

  setToastVisibleFn = setVisible;
  setToastPropsFn = setProps;

  const handleDismiss = () => {
    setVisible(false);
  };

  return {
    visible,
    props,
    handleDismiss,
    show: showToast,
    hide: hideToast,
  };
}

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  container: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  toast: {
    backgroundColor: Colors.dark.backgroundPrimary,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    color: Colors.dark.text,
    flex: 1,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  actionText: {
    fontWeight: "700",
  },
  dismissButton: {
    padding: Spacing.xs,
  },
  progressContainer: {
    height: 3,
    backgroundColor: Colors.dark.backgroundTertiary,
  },
  progressBar: {
    height: "100%",
  },
});
