import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { TransactionItem } from "@/components/TransactionItem";
import { GoldButton } from "@/components/GoldButton";
import { ThemedText } from "@/components/ThemedText";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { Colors, Spacing, BorderRadius, Gradients } from "@/constants/theme";

const CATEGORIES = [
  { id: "food", name: "FOOD", detail: "Dining & Groceries", icon: "coffee" },
  { id: "transport", name: "TRANSPORT", detail: "Fuel & Travel", icon: "truck" },
  { id: "shopping", name: "SHOPPING", detail: "Retail & Online", icon: "shopping-bag" },
  { id: "bills", name: "BILLS", detail: "Utilities & Services", icon: "file-text" },
  { id: "health", name: "HEALTH", detail: "Medical & Wellness", icon: "heart" },
  { id: "other", name: "OTHER", detail: "Miscellaneous", icon: "more-horizontal" },
];

export default function DashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  let tabBarHeight = 70;
  try {
    tabBarHeight = useBottomTabBarHeight();
  } catch (e) {}

  const { user, logout, setUser } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("Month");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit" | "upgrade">("new");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [customNote, setCustomNote] = useState("");

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setExpenses(data);
    setIsLoading(false);
  };

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter((e) => {
      const d = new Date(e.created_at);
      if (timeFilter === "Today") return d.toDateString() === now.toDateString();
      if (timeFilter === "Week")
        return d > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return true;
    });
  }, [expenses, timeFilter]);

  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }

    const payload = {
      user_id: user.id,
      amount: parseFloat(amount),
      description: customNote || "Cash Entry",
      category,
    };

    if (modalMode === "edit" && editingId) {
      await supabase.from("expenses").update(payload).eq("id", editingId);
    } else {
      await supabase.from("expenses").insert([payload]);
    }

    setShowModal(false);
    setAmount("");
    setCustomNote("");
    setCategory("other");
    setEditingId(null);
    fetchData();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this expense?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await supabase.from("expenses").delete().eq("id", id);
          fetchData();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const handleEdit = (expense: any) => {
    setModalMode("edit");
    setEditingId(expense.id);
    setAmount(expense.amount.toString());
    setCustomNote(expense.description);
    setCategory(expense.category);
    setShowModal(true);
  };

  const handleUpgradeLogic = async () => {
    const { error } = await supabase
      .from("users")
      .update({ subscription_status: "premium" })
      .eq("id", user.id);
    if (!error) {
      Alert.alert("Success", "Premium Activated! All features unlocked.");
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) setUser(data);
      setShowModal(false);
    }
  };

  const handleShareLedger = async () => {
    if (user?.subscription_status !== "premium") {
      Alert.alert(
        "⭐ Premium Feature",
        "Upgrade to Premium to share detailed reports."
      );
      return;
    }
    const report = filteredExpenses
      .map(
        (e, i) =>
          `#${filteredExpenses.length - i} | ${e.category.toUpperCase()}: ₹${
            e.amount
          }\nNote: ${e.description}`
      )
      .join("\n\n");
    await Share.share({
      message: `💎 GLOBAL WALLET REPORT\nUser: ${user.full_name}\n\n${report}\n\nTOTAL: ₹${totalExpense}`,
    });
  };

  const handleShareReferral = () => {
    Share.share({
      message: `Join Global Wallet Ultimate! Use my referral code: ${user?.mobile_number}\n\nDownload now and start earning passive income!`,
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.dark} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable onPress={logout} style={styles.headerButton}>
            <Feather name="log-out" size={20} color={Colors.dark.errorRed} />
          </Pressable>
          <ThemedText type="h4" style={styles.headerTitle}>
            GLOBAL WALLET
          </ThemedText>
          <Pressable
            onPress={() => {
              setModalMode("upgrade");
              setShowModal(true);
            }}
            style={[styles.headerButton, styles.premiumButton]}
          >
            <Feather name="zap" size={20} color={Colors.dark.textInverse} />
          </Pressable>
        </View>

        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <View style={styles.statsContainer}>
                <StatCard
                  title="Wallet Balance"
                  value={`₹${user?.wallet_balance || 0}`}
                  subtitle="Passive Income"
                  icon="dollar-sign"
                  trend="up"
                  trendValue="+12%"
                  variant="gradient"
                  gradientColors={Gradients.ocean}
                  style={styles.walletCard}
                />

                <View style={styles.statsRow}>
                  <StatCard
                    title="Total Expense"
                    value={`₹${totalExpense.toLocaleString("en-IN")}`}
                    subtitle={`${timeFilter} Period`}
                    icon="trending-down"
                    variant="glass"
                    style={styles.smallStatCard}
                  />
                  <StatCard
                    title="Entries"
                    value={filteredExpenses.length}
                    subtitle="Transactions"
                    icon="list"
                    variant="glass"
                    style={styles.smallStatCard}
                  />
                </View>
              </View>

              <GlassCard style={styles.filtersCard} variant="medium">
                <View style={styles.filtersRow}>
                  {["Today", "Week", "Month", "All"].map((filter) => (
                    <Pressable
                      key={filter}
                      onPress={() => {
                        setTimeFilter(filter);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={[
                        styles.filterChip,
                        timeFilter === filter && styles.filterChipActive,
                      ]}
                    >
                      <ThemedText
                        type="caption"
                        style={[
                          styles.filterChipText,
                          timeFilter === filter && styles.filterChipTextActive,
                        ]}
                      >
                        {filter}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.actionsRow}>
                  <Pressable
                    onPress={handleShareReferral}
                    style={styles.actionButton}
                  >
                    <Feather
                      name="user-plus"
                      size={16}
                      color={Colors.dark.electricGold}
                    />
                    <ThemedText type="caption" style={styles.actionButtonText}>
                      Share Code
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={handleShareLedger}
                    style={styles.actionButton}
                  >
                    <Feather
                      name="share-2"
                      size={16}
                      color={Colors.dark.electricGold}
                    />
                    <ThemedText type="caption" style={styles.actionButtonText}>
                      Share Report
                    </ThemedText>
                  </Pressable>
                </View>
              </GlassCard>

              <View style={styles.sectionHeader}>
                <ThemedText type="h5" style={styles.sectionTitle}>
                  Recent Transactions
                </ThemedText>
                <ThemedText type="caption" style={styles.sectionSubtitle}>
                  {filteredExpenses.length} entries
                </ThemedText>
              </View>
            </>
          }
          renderItem={({ item, index }) => (
            <TransactionItem
              id={item.id}
              category={item.category}
              description={item.description}
              amount={item.amount}
              date={item.created_at}
              index={index}
              totalCount={filteredExpenses.length}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loadingContainer}>
                <SkeletonLoader variant="card" />
                <SkeletonLoader variant="card" />
                <SkeletonLoader variant="card" />
              </View>
            ) : (
              <GlassCard style={styles.emptyCard}>
                <Feather
                  name="inbox"
                  size={48}
                  color={Colors.dark.textSecondary}
                  style={styles.emptyIcon}
                />
                <ThemedText type="h4" style={styles.emptyTitle}>
                  No Transactions Yet
                </ThemedText>
                <ThemedText type="small" style={styles.emptyText}>
                  Start tracking your expenses by adding your first entry
                </ThemedText>
              </GlassCard>
            )
          }
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: tabBarHeight + 100 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchData}
              tintColor={Colors.dark.electricGold}
            />
          }
          showsVerticalScrollIndicator={false}
        />

        <Pressable
          style={styles.fab}
          onPress={() => {
            setModalMode("new");
            setAmount("");
            setCustomNote("");
            setCategory("other");
            setShowModal(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <LinearGradient
            colors={Gradients.gold}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Feather name="plus" size={32} color={Colors.dark.textInverse} />
          </LinearGradient>
        </Pressable>
      </SafeAreaView>

      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowModal(false)}
          />
          <View style={styles.modalContent}>
            {modalMode === "upgrade" ? (
              <View style={styles.upgradeContainer}>
                <Feather
                  name="zap"
                  size={60}
                  color={Colors.dark.electricGold}
                  style={styles.upgradeIcon}
                />
                <ThemedText type="h2" style={styles.modalTitle}>
                  Upgrade to Premium
                </ThemedText>
                <ThemedText type="small" style={styles.modalSubtitle}>
                  Unlock passive income rewards and detailed reports
                </ThemedText>
                <View style={styles.upgradePrice}>
                  <ThemedText type="display" style={styles.priceText}>
                    ₹500
                  </ThemedText>
                  <ThemedText type="small" style={styles.priceSubtext}>
                    One-time payment
                  </ThemedText>
                </View>
                <GoldButton
                  onPress={handleUpgradeLogic}
                  icon="check-circle"
                  style={styles.upgradeButton}
                >
                  Activate Premium
                </GoldButton>
                <GoldButton
                  onPress={() => setShowModal(false)}
                  variant="outline"
                >
                  Maybe Later
                </GoldButton>
              </View>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <ThemedText type="h3" style={styles.modalTitle}>
                    {modalMode === "edit" ? "Update Entry" : "New Expense"}
                  </ThemedText>
                  <Pressable onPress={() => setShowModal(false)}>
                    <Feather name="x" size={24} color={Colors.dark.text} />
                  </Pressable>
                </View>

                <TextInput
                  style={styles.amountInput}
                  placeholder="₹ 0.00"
                  placeholderTextColor={Colors.dark.textTertiary}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  autoFocus
                />

                <TextInput
                  style={styles.noteInput}
                  placeholder="Add a note (optional)..."
                  placeholderTextColor={Colors.dark.textSecondary}
                  value={customNote}
                  onChangeText={setCustomNote}
                  multiline
                />

                <ThemedText type="small" style={styles.categoryLabel}>
                  SELECT CATEGORY
                </ThemedText>
                <View style={styles.categoriesGrid}>
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat.id}
                      onPress={() => {
                        setCategory(cat.id);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      style={[
                        styles.categoryChip,
                        category === cat.id && styles.categoryChipActive,
                      ]}
                    >
                      <Feather
                        name={cat.icon as any}
                        size={16}
                        color={
                          category === cat.id
                            ? Colors.dark.textInverse
                            : Colors.dark.electricGold
                        }
                      />
                      <ThemedText
                        type="caption"
                        style={[
                          styles.categoryText,
                          category === cat.id && styles.categoryTextActive,
                        ]}
                      >
                        {cat.name}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>

                <GoldButton onPress={handleSave} icon="check" style={styles.saveButton}>
                  {modalMode === "edit" ? "Update" : "Save"}
                </GoldButton>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.glassBackground,
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  premiumButton: {
    backgroundColor: Colors.dark.electricGold,
    borderColor: Colors.dark.electricGold,
  },
  headerTitle: {
    color: Colors.dark.electricGold,
    fontWeight: "900",
    letterSpacing: 2,
  },
  statsContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  walletCard: {
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  smallStatCard: {
    flex: 1,
  },
  filtersCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  filtersRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: Colors.dark.electricGold,
    borderColor: Colors.dark.electricGold,
  },
  filterChipText: {
    color: Colors.dark.textSecondary,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: Colors.dark.textInverse,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.backgroundPrimary,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
  },
  actionButtonText: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  sectionHeader: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    color: Colors.dark.textTertiary,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
  },
  loadingContainer: {
    gap: Spacing.md,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
  },
  emptyIcon: {
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: Spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: Colors.dark.electricGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: Colors.dark.deepSpaceBlue,
    borderTopLeftRadius: BorderRadius["3xl"],
    borderTopRightRadius: BorderRadius["3xl"],
    padding: Spacing["3xl"],
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  modalTitle: {
    color: Colors.dark.text,
  },
  upgradeContainer: {
    alignItems: "center",
  },
  upgradeIcon: {
    marginBottom: Spacing.xl,
  },
  modalSubtitle: {
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  upgradePrice: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  priceText: {
    color: Colors.dark.electricGold,
    fontWeight: "900",
  },
  priceSubtext: {
    color: Colors.dark.textSecondary,
    marginTop: Spacing.xs,
  },
  upgradeButton: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  amountInput: {
    color: Colors.dark.text,
    fontSize: 48,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: Spacing["2xl"],
    borderBottomWidth: 2,
    borderBottomColor: Colors.dark.electricGold,
    paddingBottom: Spacing.lg,
  },
  noteInput: {
    backgroundColor: Colors.dark.backgroundPrimary,
    color: Colors.dark.text,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    fontSize: 14,
    minHeight: 80,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
    textAlignVertical: "top",
  },
  categoryLabel: {
    color: Colors.dark.textSecondary,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  categoryChip: {
    width: "30%",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.borderMuted,
    alignItems: "center",
    gap: Spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: Colors.dark.electricGold,
    borderColor: Colors.dark.electricGold,
  },
  categoryText: {
    color: Colors.dark.text,
    fontWeight: "600",
    fontSize: 10,
  },
  categoryTextActive: {
    color: Colors.dark.textInverse,
  },
  saveButton: {
    width: "100%",
  },
});
