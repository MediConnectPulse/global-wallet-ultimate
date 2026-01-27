import React, { useState, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View, FlatList, Pressable, Text, Modal, TextInput, Alert, Share, KeyboardAvoidingView, Platform, RefreshControl, Animated, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from "expo-haptics";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  { id: "food", name: "FOOD", detail: "Milk, Chai, Groceries", icon: "coffee", keywords: ["chai", "food", "milk", "khana", "nasta", "hotel", "dinner"] },
  { id: "transport", name: "TRANSPORT", detail: "Petrol, Auto, Gadi", icon: "truck", keywords: ["petrol", "diesel", "auto", "gadi", "travel"] },
  { id: "shopping", name: "SHOPPING", detail: "Cloth, Mobile, Shop", icon: "shopping-bag", keywords: ["cloth", "market", "shop", "gift"] },
  { id: "bills", name: "BILLS", detail: "Rent, Recharge, Light", icon: "file-text", keywords: ["rent", "recharge", "bill", "wifi"] },
  { id: "health", name: "HEALTH", detail: "Doctor, Dawali", icon: "heart", keywords: ["doctor", "medicine", "dawali"] },
  { id: "other", name: "OTHER", detail: "Misc Details", icon: "more-horizontal", keywords: [] },
];

// --- LOGIC: UPDATED TIME FILTER ---
type TimeFilter = "Today" | "Week" | "Month" | "Custom";

export default function DashboardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  let tabBarHeight = 70; 
  try { tabBarHeight = useBottomTabBarHeight(); } catch (e) { }

  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Month");
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit" | "upgrade" | "withdraw">("new");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [customNote, setCustomNote] = useState("");
  const [upiId, setUpiId] = useState("");

  useEffect(() => { fetchData(); }, [user?.id]);

  const fetchData = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    const { data } = await supabase.from('expenses').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setExpenses(data);
    setIsLoading(false);
  };

  const filteredLedgerSum = useMemo(() => {
    const now = new Date();
    return expenses.filter(e => {
        const d = new Date(e.created_at);
        if (timeFilter === "Today") return d.toDateString() === now.toDateString();
        if (timeFilter === "Week") return d > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return true; // CUSTOM filter logic
    }).reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, timeFilter]);

  const handleSave = async () => {
    if (!amount || isSubmitting) return;
    setIsSubmitting(true);
    const payload = { user_id: user.id, amount: parseFloat(amount), description: customNote, category };
    if (modalMode === "edit" && editingId) {
      await supabase.from('expenses').update(payload).eq('id', editingId);
    } else {
      await supabase.from('expenses').insert([payload]);
    }
    setShowModal(false); setAmount(""); setCustomNote(""); setEditingId(null);
    fetchData();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSubmitting(false);
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Dignity Check", "Delete this record?", [
      { text: "Cancel" },
      { text: "DELETE", style: "destructive", onPress: async () => {
          await supabase.from('expenses').delete().eq('id', id);
          fetchData();
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F0C29', '#0A192F', '#02060C']} style={StyleSheet.absoluteFill} />
      
      {/* 1. TOP NAV: ADMIN BRANDING */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={logout} style={[styles.topBtn, {backgroundColor: '#FF4B2B'}]}><Feather name="power" size={18} color="white" /></Pressable>
        <Text style={styles.brandText}>GLOBAL WALLET</Text>
        <Pressable onPress={() => {}} style={[styles.topBtn, {backgroundColor: '#FFD700'}]}><Feather name="zap" size={20} color="black" /></Pressable>
      </View>

      {/* 2. DUAL WALLETS: PRISM COLORS */}
      <View style={styles.walletRow}>
        <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.walletCard}>
          <Text style={styles.cardLabel}>PASSIVE INCOME</Text>
          <Text style={styles.cardValue}>₹{user?.wallet_balance || 0}</Text>
          <Text style={styles.withdrawLink}>WITHDRAW ₹</Text>
        </LinearGradient>
        <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.walletCard}>
          <Text style={styles.cardLabel}>LEDGER SUM</Text>
          <Text style={styles.cardValue}>₹{filteredLedgerSum.toLocaleString('en-IN')}</Text>
          <Text style={styles.cardSub}>{timeFilter.toUpperCase()}</Text>
        </LinearGradient>
      </View>

      {/* 3. TIME FILTERS: CUSTOM ADDED */}
      <View style={styles.filterRow}>
        {["Today", "Week", "Month", "Custom"].map(f => (
          <Pressable key={f} onPress={() => setTimeFilter(f as TimeFilter)} style={[styles.chip, timeFilter === f && styles.chipActive]}>
            <Text style={[styles.chipText, timeFilter === f && {color: 'black'}]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      {/* 4. LEDGER LIST: EQUAL GAPS */}
      <View style={styles.listContainer}>
        <Text style={styles.historyLabel}>EXECUTIVE HISTORY</Text>
        <FlatList
          data={expenses}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.expenseItem}>
              <View style={styles.col1}>
                <Text style={styles.srNo}>#{expenses.length - index}</Text>
                <Text style={styles.catName} numberOfLines={1}>{item.category.toUpperCase()}</Text>
              </View>
              <Pressable style={styles.colIcon} onPress={() => {setModalMode("edit"); setEditingId(item.id); setAmount(item.amount.toString()); setCustomNote(item.description || ""); setShowModal(true);}}>
                <Feather name="edit-2" size={16} color="#FFD700" />
              </Pressable>
              <Pressable style={styles.colIcon} onPress={() => confirmDelete(item.id)}>
                <Feather name="trash-2" size={16} color="#FF4B2B" />
              </Pressable>
              <View style={styles.colAmount}><Text style={styles.amountText}>₹{item.amount}</Text></View>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} tintColor="#FFD700" />}
        />
      </View>

      {/* 5. DUAL INPUT DOCK */}
      <View style={[styles.fabDock, { bottom: tabBarHeight + 15 }]}>
         <Pressable style={styles.textEntryBtn} onPress={() => { setModalMode("new"); setAmount(""); setShowModal(true); }}>
            <Feather name="edit-3" size={24} color="#FFD700" />
         </Pressable>
         <Pressable style={styles.micFab} onPress={() => { setModalMode("new"); setAmount(""); setShowModal(true); }}>
           <LinearGradient colors={['#F7971E', '#FFD200']} style={styles.micGradient}>
              <Feather name="mic" size={35} color="black" />
           </LinearGradient>
         </Pressable>
      </View>

      {/* 6. MODAL: CATEGORY DETAIL TEXT INCLUDED */}
      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>{modalMode === 'edit' ? "Edit Entry" : "New Entry"}</Text><Pressable onPress={() => setShowModal(false)}><Feather name="x" size={24} color="white" /></Pressable></View>
            <TextInput style={styles.amountInput} placeholder="₹ 0.00" placeholderTextColor="#444" keyboardType="numeric" value={amount} onChangeText={setAmount} autoFocus />
            <Text style={styles.inputHint}>WHAT WAS THIS FOR?</Text>
            <TextInput style={styles.detailInput} placeholder="Add detail..." placeholderTextColor="#666" value={customNote} onChangeText={setCustomNote} />
            <View style={styles.catGrid}>
               {CATEGORIES.map(c => (
                 <Pressable key={c.id} onPress={() => setCategory(c.id)} style={[styles.catChip, category === c.id && styles.activeChip]}>
                    <Text style={[styles.catText, category === c.id && {color: 'black'}]}>{c.name}</Text>
                    <Text style={[styles.catSubText, category === c.id && {color: 'rgba(0,0,0,0.5)'}]}>{c.detail}</Text>
                 </Pressable>
               ))}
            </View>
            <Pressable style={styles.confirmBtn} onPress={handleSave}><Text style={styles.confirmBtnText}>CONFIRM</Text></Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', height: 90 },
  topBtn: { width: 44, height: 44, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  brandText: { color: '#FFD700', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  walletRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 15 },
  walletCard: { flex: 1, height: 110, borderRadius: 25, padding: 18, justifyContent: 'center', elevation: 12, shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 10 },
  cardLabel: { color: 'white', fontSize: 9, fontWeight: 'bold', opacity: 0.7, textShadowColor: 'black', textShadowRadius: 2 },
  cardValue: { color: 'white', fontSize: 24, fontWeight: 'bold', marginVertical: 4, textShadowColor: 'black', textShadowRadius: 2 },
  withdrawLink: { color: '#FFD700', fontSize: 8, fontWeight: 'bold', textDecorationLine: 'underline', marginTop: 5 },
  cardSub: { color: 'white', fontSize: 8, opacity: 0.7 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, paddingHorizontal: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#FFD700' },
  chipActive: { backgroundColor: '#FFD700' },
  chipText: { color: '#FFD700', fontSize: 10, fontWeight: 'bold' },
  listContainer: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', marginHorizontal: 15, borderRadius: 30, padding: 20, marginBottom: 150 },
  historyLabel: { color: '#FFD700', fontSize: 10, fontWeight: 'bold', marginBottom: 15, opacity: 0.4 },
  expenseItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  // EQUAL GAP LOGIC
  col1: { flex: 2.5, flexDirection: 'row', alignItems: 'center' },
  colIcon: { flex: 0.6, alignItems: 'center' },
  colAmount: { flex: 1.2, alignItems: 'flex-end' },
  srNo: { color: '#FFD700', fontSize: 10, fontWeight: 'bold', marginRight: 10 },
  catName: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  amountText: { color: '#ef473a', fontWeight: 'bold', fontSize: 16 },
  fabDock: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 20, zIndex: 1000 },
  textEntryBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFD700' },
  micFab: { width: 85, height: 85, borderRadius: 42.5, elevation: 15 },
  micGradient: { flex: 1, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0A192F', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  amountInput: { color: 'white', fontSize: 44, fontWeight: '900', borderBottomWidth: 1, borderBottomColor: '#FFD700', marginBottom: 15, textAlign: 'center' },
  inputHint: { color: '#FFD700', fontSize: 9, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  detailInput: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', padding: 18, borderRadius: 15, fontSize: 14, marginBottom: 20 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 25 },
  catChip: { width: '31%', paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#FFD700', alignItems: 'center' },
  activeChip: { backgroundColor: '#FFD700' },
  catText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  catSubText: { color: 'white', fontSize: 7, opacity: 0.5, textAlign: 'center' },
  confirmBtn: { backgroundColor: '#FFD700', padding: 22, borderRadius: 25, alignItems: 'center' },
  confirmBtnText: { color: 'black', fontWeight: '900', fontSize: 18 }
});
