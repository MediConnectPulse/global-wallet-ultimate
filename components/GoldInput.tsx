import React, { useState } from "react";
import { StyleSheet, View, TextInput, TextInputProps, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Colors, BorderRadius, Spacing } from "@/constants/theme";

interface GoldInputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;
  isPassword?: boolean;
}

export function GoldInput({
  label,
  error,
  prefix,
  isPassword,
  style,
  ...props
}: GoldInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label ? (
        <ThemedText type="small" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        {prefix ? (
          <ThemedText style={styles.prefix}>{prefix}</ThemedText>
        ) : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.dark.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={Colors.dark.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <ThemedText type="small" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.lg,
  },
  inputFocused: {
    borderColor: Colors.dark.gold,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.dark.error,
  },
  prefix: {
    color: Colors.dark.text,
    marginRight: Spacing.sm,
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 16,
    height: "100%",
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  error: {
    color: Colors.dark.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
