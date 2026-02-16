import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import {
  Colors,
  BorderRadius,
  Spacing,
  SpringConfigs,
  AnimationDuration,
} from "@/constants/theme";

interface AnimatedInputProps extends TextInputProps {
  label: string;
  error?: string;
  prefix?: string;
  icon?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  success?: boolean;
}

export function AnimatedInput({
  label,
  error,
  prefix,
  icon,
  isPassword,
  success,
  value,
  onFocus,
  onBlur,
  style,
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const focusAnimation = useSharedValue(0);
  const borderAnimation = useSharedValue(0);

  useEffect(() => {
    setHasValue(!!value && value.toString().length > 0);
  }, [value]);

  useEffect(() => {
    if (isFocused || hasValue) {
      focusAnimation.value = withSpring(1, SpringConfigs.snappy);
    } else {
      focusAnimation.value = withSpring(0, SpringConfigs.snappy);
    }
  }, [isFocused, hasValue]);

  useEffect(() => {
    if (error) {
      borderAnimation.value = withTiming(2, {
        duration: AnimationDuration.fast,
      });
    } else if (success) {
      borderAnimation.value = withTiming(1, {
        duration: AnimationDuration.fast,
      });
    } else if (isFocused) {
      borderAnimation.value = withTiming(0.5, {
        duration: AnimationDuration.fast,
      });
    } else {
      borderAnimation.value = withTiming(0, {
        duration: AnimationDuration.fast,
      });
    }
  }, [isFocused, error, success]);

  const labelAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      focusAnimation.value,
      [0, 1],
      [0, -28],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      focusAnimation.value,
      [0, 1],
      [1, 0.85],
      Extrapolation.CLAMP,
    );
    const color = interpolate(
      focusAnimation.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
      opacity: interpolate(color, [0, 1], [0.6, 1], Extrapolation.CLAMP),
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolate(
      borderAnimation.value,
      [0, 0.5, 1, 2],
      [0, 0.5, 1, 2],
      Extrapolation.CLAMP,
    );

    let color = Colors.dark.borderMuted;
    if (borderAnimation.value === 2) {
      color = Colors.dark.errorRed;
    } else if (borderAnimation.value === 1) {
      color = Colors.dark.successGreen;
    } else if (borderAnimation.value === 0.5) {
      color = Colors.dark.electricGold;
    }

    return {
      borderColor: color,
      borderWidth: borderAnimation.value === 0 ? 1 : 2,
    };
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputContainer, containerAnimatedStyle]}>
        {icon && (
          <View style={styles.iconContainer}>
            <Feather
              name={icon}
              size={20}
              color={
                error
                  ? Colors.dark.errorRed
                  : isFocused
                    ? Colors.dark.electricGold
                    : Colors.dark.textSecondary
              }
            />
          </View>
        )}
        {prefix && <ThemedText style={styles.prefix}>{prefix}</ThemedText>}
        <View style={styles.inputWrapper}>
          <Animated.View style={[styles.labelContainer, labelAnimatedStyle]}>
            <ThemedText
              type="small"
              style={[
                styles.label,
                {
                  color: error
                    ? Colors.dark.errorRed
                    : isFocused || hasValue
                      ? Colors.dark.electricGold
                      : Colors.dark.textSecondary,
                },
              ]}
            >
              {label}
            </ThemedText>
          </Animated.View>
          <TextInput
            style={[styles.input, style]}
            placeholderTextColor="transparent"
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isPassword && !showPassword}
            value={value}
            {...props}
          />
        </View>
        {isPassword && (
          <Pressable
            onPress={togglePasswordVisibility}
            style={styles.eyeButton}
            hitSlop={8}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={
                isFocused ? Colors.dark.electricGold : Colors.dark.textSecondary
              }
            />
          </Pressable>
        )}
        {success && !error && (
          <View style={styles.iconContainer}>
            <Feather
              name="check-circle"
              size={20}
              color={Colors.dark.successGreen}
            />
          </View>
        )}
      </Animated.View>
      {error && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={14} color={Colors.dark.errorRed} />
          <ThemedText type="small" style={styles.errorText}>
            {error}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundPrimary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.lg,
    position: "relative",
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  prefix: {
    color: Colors.dark.text,
    marginRight: Spacing.sm,
    fontSize: 16,
    fontWeight: "600",
  },
  inputWrapper: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  labelContainer: {
    position: "absolute",
    left: 0,
    transformOrigin: "left center",
  },
  label: {
    fontSize: 14,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
    height: "100%",
    paddingTop: 8,
  },
  eyeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
    gap: Spacing.xs,
  },
  errorText: {
    color: Colors.dark.errorRed,
    flex: 1,
  },
});
