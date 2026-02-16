import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import {
  Colors,
  BorderRadius,
  Spacing,
  SpringConfigs,
} from "@/constants/theme";

interface TransactionItemProps {
  id: string;
  category: string;
  description: string;
  amount: number;
  date?: string;
  index: number;
  totalCount: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CATEGORY_CONFIG: Record<
  string,
  { icon: keyof typeof Feather.glyphMap; color: string }
> = {
  food: { icon: "coffee", color: "#FF6B35" },
  transport: { icon: "truck", color: "#4ECDC4" },
  shopping: { icon: "shopping-bag", color: "#A78BFA" },
  bills: { icon: "file-text", color: "#FFA500" },
  health: { icon: "heart", color: "#FF4757" },
  other: { icon: "more-horizontal", color: "#778DA9" },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TransactionItem({
  id,
  category,
  description,
  amount,
  date,
  index,
  totalCount,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const config =
    CATEGORY_CONFIG[category.toLowerCase()] || CATEGORY_CONFIG.other;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, SpringConfigs.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.gentle);
  };

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit?.();
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete?.();
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <View style={styles.indexBadge}>
            <ThemedText type="caption" style={styles.indexText}>
              #{totalCount - index}
            </ThemedText>
          </View>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${config.color}20` },
            ]}
          >
            <Feather name={config.icon} size={18} color={config.color} />
          </View>
          <View style={styles.details}>
            <ThemedText type="bodyMedium" style={styles.category}>
              {category.toUpperCase()}
            </ThemedText>
            <ThemedText
              type="small"
              style={styles.description}
              numberOfLines={1}
            >
              {description || "No description"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.actions}>
            {onEdit && (
              <Pressable
                onPress={handleEdit}
                style={styles.actionButton}
                hitSlop={8}
              >
                <Feather
                  name="edit-2"
                  size={16}
                  color={Colors.dark.electricGold}
                />
              </Pressable>
            )}
            {onDelete && (
              <Pressable
                onPress={handleDelete}
                style={styles.actionButton}
                hitSlop={8}
              >
                <Feather
                  name="trash-2"
                  size={16}
                  color={Colors.dark.errorRed}
                />
              </Pressable>
            )}
          </View>
          <View style={styles.amountContainer}>
            <ThemedText type="h5" style={styles.amount}>
              ₹{amount.toLocaleString("en-IN")}
            </ThemedText>
            {date && (
              <ThemedText type="caption" style={styles.date}>
                {new Date(date).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })}
              </ThemedText>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.backgroundPrimary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.md,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.xs,
    backgroundColor: `${Colors.dark.electricGold}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  indexText: {
    color: Colors.dark.electricGold,
    fontWeight: "700",
    fontSize: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
  },
  category: {
    color: Colors.dark.text,
    fontSize: 14,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  description: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
  rightSection: {
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    color: Colors.dark.errorRed,
    fontWeight: "700",
    fontSize: 16,
  },
  date: {
    color: Colors.dark.textTertiary,
    fontSize: 10,
    marginTop: 2,
  },
});
