import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, View, FlatList, Pressable, Text, Modal, TextInput, Alert, Share, KeyboardAvoidingView, Platform, RefreshControl, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from "expo-haptics";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

const { height, width } = Dimensions.get("window");

const CATEGORIES = [
  { id: "food", name: "FOOD", detail: "Milk, Chai, Groceries", icon: "coffee", keywords: ["chai", "food", "milk", "khana"] },
  { id: "transport", name: "TRANSPORT", detail: "Petrol, Auto, Gadi", icon: "truck", keywords: ["petrol", "diesel", "gadi", "auto"] },
  { id: "shopping", name: "SHOPPING", detail: "Cloth, Mobile, Shop", icon: "shopping-bag", keywords: ["cloth", "market", "shop"] },
  { id: "bills", name: "BILLS", detail: "Rent, Recharge, Light", icon: "file-text", keywords: ["rent", "recharge", "bill"] },
  { id: "health", name: "HEALTH", detail: "Doctor, Dawali", icon: "heart", keywords: ["doctor", "medicine"] },
];

export default function DashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  let tabBarHeight = 70; 
  try { tabBarHeight = useBottomTabBarHeight(); } catch (e) { }

  const { user, logout, setUser } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("Month");
  
  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit" | "upgrade">("new");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [customNote, setCustomNote] = useState("");

  useEffect(() => { fetchData(); }, [user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    const { data } = await supabase.from('expenses').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setExpenses(data);
    setIsLoading(false);
  };

  // --- LOGIC: SIMULTANEOUS TIME-FACTOR SUM ---
  const filteredSum = useMemo(() => {
    const now = new Date();
    return expenses.filter(e => {
        const d = new Date(e.created_at);
        if (timeFilter === "Today") return d.toDateString() === now.toDateString();
        if (timeFilter === "Week") return d > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return true;
    }).reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, timeFilter]);

  const handleSave = async () => {
    if (!amount) return;
    const payload = { user_id: user.id, amount: parseFloat(amount), description: customNote, category };
    if (modalMode === "edit" && editingId) {
      await supabase.from('expenses').update(payload).eq('id', editingId);
    } else {
      await supabase.from('expenses').insert([payload]);
    }
    setShowModal(false); setAmount(""); setCustomNote(""); setEditingId(null);
    fetchData();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleUpgradeLogic = async () => {
    // --- REAL FUNCTIONAL UPGRADE ---
    const { error } = await supabase.from('users').update({ subscription_status: 'premium' }).eq('id', user.id);
    if (!error) {
      Alert.alert("Success", "Premium Activated! All features unlocked.");
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (data) setUser(data);
      setShowModal(false);
    }
  };

  const handleShareLedger = async () => {
    if (user?.subscription_status !== 'premium') return Alert.alert("⭐ Executive Feature", "Upgrade to Premium to share reports.");
    const report = expenses.map((e, i) => `#${expenses.length - i} | ${e.category}: ₹${e.amount}\nNote: ${e.description}`).join('\n\n');
    await Share.share({ message: `💎 GLOBAL WALLET REPORT\nUser: ${user.full_name}\n\n${report}\n\nTOTAL: ₹${filteredSum}` });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F0C29', '#302b63', '#24243e']} style={StyleSheet.absoluteFill} />
      
      {/* 1. TOP NAV: 3 ITEMS */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={logout} style={[styles.topSmallBox, {backgroundColor: '#FF4B2B'}]}><Feather name="power" size={18} color="white" /></Pressable>
        <Text style={styles.brandText}>GLOBAL WALLET</Text>
        <Pressable onPress={() => {setModalMode("upgrade"); setShowModal(true);}} style={[styles.topSmallBox, {backgroundColor: '#FFD700'}]}><Feather name="zap" size={20} color="black" /></Pressable>
      </View>

      {/* 2. DUAL WALLETS HUB: 2 ITEMS */}
      <View style={styles.walletRow}>
        <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.walletCard}>
          <Text style={styles.cardLabel}>PASSIVE INCOME</Text>
          <Text style={styles.cardValue}>₹{user?.wallet_balance || 0}</Text>
          <Text style={styles.cardAction}>WITHDRAW ₹</Text>
        </LinearGradient>
        <LinearGradient colors={['#cb2d3e', '#ef473a']} style={styles.walletCard}>
          <Text style={styles.cardLabel}>LEDGER SUM</Text>
          <Text style={styles.cardValue}>₹{filteredSum}</Text>
          <Text style={styles.cardAction}>{timeFilter.toUpperCase()} ENTRIES</Text>
        </LinearGradient>
      </View>

      {/* 3. TIME FILTERS: 4 ITEMS */}
      <View style={styles.filterRow}>
        {["Today", "Week", "Month", "Custom"].map(f => (
          <Pressable key={f} onPress={() => setTimeFilter(f)} style={[styles.chip, timeFilter === f && styles.chipActive]}>
            <Text style={[styles.chipText, timeFilter === f && {color: 'black'}]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      {/* 4. PREMIUM ACTIONS: 2 ITEMS */}
      <View style={styles.actionRow}>
        <Pressable style={styles.premiumBtn} onPress={() => Alert.alert("Referral Code", user?.mobile_number)}><Feather name="user-plus" size={14} color="#FFD700" /><Text style={styles.btnText}>SHARE CODE</Text></Pressable>
        <Pressable style={styles.premiumBtn} onPress={handleShareLedger}><Feather name="file-text" size={14} color="#FFD700" /><Text style={styles.btnText}>SHARE REPORT</Text></Pressable>
      </View>

      {/* 5. DIGNITY LEDGER LIST */}
      <View style={styles.listContainer}>
        <Text style={styles.historyLabel}>EXECUTIVE HISTORY</Text>
        <FlatList
          data={expenses}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.expenseItem}>
              <View style={styles.col1}>
                <Text style={styles.srNo}>#{expenses.length - index}</Text>
                <View>
                    <Text style={styles.catName}>{item.category.toUpperCase()}</Text>
                    <Text style={styles.itemNote} numberOfLines={1}>{item.description || "Cash Entry"}</Text>
                </View>
              </View>
              <Pressable style={styles.colIcon} onPress={() => {setModalMode("edit"); setEditingId(item.id); setAmount(item.amount.toString()); setShowModal(true);}}>
                <Feather name="edit-2" size={15} color="#FFD700" />
              </Pressable>
              <Pressable style={styles.colIcon} onPress={() => Alert.alert("Delete", "Permanently remove?", [{text: "Cancel"}, {text: "Delete", onPress: () => {supabase.from('expenses').delete().eq('id', item.id).then(fetchData)}}])}>
                <Feather name="trash-2" size={15} color="#FF4B2B" />
              </Pressable>
              <View style={styles.colAmount}><Text style={styles.amountText}>₹{item.amount}</Text></View>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} tintColor="#FFD700" />}
        />
      </View>

      {/* 6. DUAL INPUT DOCK (25% BELOW CENTER) */}
      <View style={[styles.fabDock, { top: height * 0.72 }]}>
         <Pressable style={styles.textEntryBtn} onPress={() => { setModalMode("new"); setAmount(""); setShowModal(true); }}>
            <Feather name="edit-3" size={24} color="#FFD700" />
         </Pressable>
         <Pressable style={styles.micFab} onPress={() => { setModalMode("new"); setAmount(""); setShowModal(true); }}>
           <LinearGradient colors={['#F7971E', '#FFD200']} style={styles.micGradient}>
              <Feather name="mic" size={35} color="black" />
           </LinearGradient>
         </Pressable>
      </View>

      {/* 7. BOTTOM NAV SPACE (DIGNITY GUARD) */}
      <View style={{ height: tabBarHeight + 20 }} />

      {/* MODALS */}
      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalMode === 'upgrade' ? (
                <View style={{alignItems: 'center'}}>
                    <Feather name="shield" size={60} color="#FFD700" />
                    <Text style={styles.modalTitle}>Activate Premium</Text>
                    <Text style={{color: '#888', textAlign: 'center', marginBottom: 20}}>Confirm payment of ₹500 to unlock passive income and reports.</Text>
                    <Pressable style={styles.confirmBtn} onPress={handleUpgradeLogic}><Text style={styles.confirmBtnText}>SIMULATE UPI SUCCESS</Text></Pressable>
                </View>
            ) : (
                <>
                <View style={styles.modalHeader}><Text style={styles.modalTitle}>{modalMode === 'edit' ? "Update Entry" : "New Wealth Entry"}</Text><Pressable onPress={() => setShowModal(false)}><Feather name="x" size={24} color="white" /></Pressable></View>
                <TextInput style={styles.amountInput} placeholder="₹ 0.00" placeholderTextColor="#444" keyboardType="numeric" value={amount} onChangeText={setAmount} autoFocus />
                <TextInput style={styles.detailInput} placeholder="Add specific detail..." placeholderTextColor="#666" value={customNote} onChangeText={setCustomNote} />
                <View style={styles.catGrid}>
                   {CATEGORIES.map(c => (
                     <Pressable key={c.id} onPress={() => setCategory(c.id)} style={[styles.catChip, category === c.id && styles.activeChip]}>
                        <Text style={[styles.catText, category === c.id && {color: 'black'}]}>{c.name}</Text>
                        <Text style={[styles.catDetailText, category === c.id && {color: 'rgba(0,0,0,0.5)'}]}>{c.detail}</Text>
                     </Pressable>
                   ))}
                </View>
                <Pressable style={styles.confirmBtn} onPress={handleSave}><Text style={styles.confirmBtnText}>SAVE TO LEDGER</Text></Pressable>
                </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', height: 90 },
  topSmallBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  brandText: { color: '#FFD700', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  statusText: { color: 'white', fontSize: 8, opacity: 0.5, fontWeight: 'bold' },
  walletRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 15 },
  walletCard: { flex: 1, height: 110, borderRadius: 25, padding: 18, justifyContent: 'center', elevation: 10 },
  cardLabel: { color: 'white', fontSize: 9, fontWeight: 'bold', opacity: 0.7 },
  cardValue: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  cardAction: { color: '#FFD700', fontSize: 8, fontWeight: 'bold', marginTop: 5 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, paddingHorizontal: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#FFD700' },
  chipActive: { backgroundColor: '#FFD700' },
  chipText: { color: '#FFD700', fontSize: 10, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 20 },
  actionBtn: { flex: 1, height: 50, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, borderWidth: 1, borderColor: '#FFD700', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  listContainer: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', marginHorizontal: 15, borderRadius: 30, padding: 20, marginBottom: 140 },
  historyLabel: { color: '#FFD700', fontSize: 10, fontWeight: 'bold', marginBottom: 15, opacity: 0.4 },
  expenseItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  col1: { flex: 2.5, flexDirection: 'row', alignItems: 'center' },
  colIcon: { flex: 0.6, alignItems: 'center' },
  colAmount: { flex: 1.2, alignItems: 'flex-end' },
  srNo: { color: '#FFD700', fontSize: 10, fontWeight: 'bold', marginRight: 10 },
  catName: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  itemNote: { color: '#888', fontSize: 9 },
  amountText: { color: '#ef473a', fontWeight: 'bold', fontSize: 16 },
  fabDock: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 20, zIndex: 1000 },
  textEntryBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFD700' },
  micFab: { width: 85, height: 85, borderRadius: 42.5, elevation: 15 },
  micGradient: { flex: 1, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0A192F', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  amountInput: { color: 'white', fontSize: 44, fontWeight: '900', borderBottomWidth: 1, borderBottomColor: '#FFD700', marginBottom: 20, textAlign: 'center' },
  detailInput: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: 18, borderRadius: 15, fontSize: 14, marginBottom: 25 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  catChip: { width: '31%', paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#FFD700', alignItems: 'center' },
  activeChip: { backgroundColor: '#FFD700' },
  catText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  catDetailText: { color: 'white', fontSize: 7, opacity: 0.5, textAlign: 'center' },
  confirmBtn: { backgroundColor: '#FFD700', padding: 22, borderRadius: 25, alignItems: 'center' },
  confirmBtnText: { color: 'black', fontWeight: '900', fontSize: 18 }
});
