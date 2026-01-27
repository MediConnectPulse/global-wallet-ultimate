import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Alert, ScrollView, TextInput, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [upiId, setUpiId] = useState(user?.upi_id || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- LOGIC: UPDATE USER IDENTITY (UPI FOR PAYOUTS) ---
  const handleUpdateProfile = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('users')
      .update({ upi_id: upiId })
      .eq('id', user.id);
    
    if (!error) {
      Alert.alert("Dignity Confirmed", "Your payout identity has been updated.");
      setIsEditing(false);
    }
    setLoading(false);
  };

  const requestWithdrawal = () => {
    if (!user?.upi_id && !upiId) {
        Alert.alert("Identity Missing", "Please save your UPI ID first to receive funds.");
        return;
    }
    if (user.wallet_balance < 500) {
        Alert.alert("Limit Not Met", "Minimum withdrawal threshold is ₹500.");
        return;
    }
    Alert.alert("Request Sent", "Admin will verify and process ₹" + user.wallet_balance + " to your UPI.");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A192F', '#02060C']} style={StyleSheet.absoluteFill} />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: insets.top + 20 }}>
        
        {/* 1. IDENTITY HEADER */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.full_name?.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{user?.full_name?.toUpperCase()}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{user?.subscription_status === 'premium' ? "⭐ PREMIUM MEMBER" : "FREE ACCOUNT"}</Text>
          </View>
        </View>

        {/* 2. WEALTH LEDGER CARD */}
        <View style={styles.wealthCard}>
          <Text style={styles.cardLabel}>AVAILABLE FOR WITHDRAWAL</Text>
          <Text style={styles.cardVal}>₹{user?.wallet_balance || 0}</Text>
          <View style={styles.divider} />
          <View style={styles.statsRow}>
             <View>
                <Text style={styles.miniLabel}>TOTAL EARNED</Text>
                <Text style={styles.miniVal}>₹{user?.wallet_balance + (user?.total_withdrawn || 0)}</Text>
             </View>
             <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.miniLabel}>TOTAL WITHDRAWN</Text>
                <Text style={styles.miniVal}>₹{user?.total_withdrawn || 0}</Text>
             </View>
          </View>
          <Pressable style={[styles.withdrawBtn, {opacity: user?.wallet_balance < 500 ? 0.5 : 1}]} onPress={requestWithdrawal}>
            <Text style={styles.withdrawBtnText}>REQUEST PAYOUT</Text>
          </Pressable>
        </View>

        {/* 3. PAYOUT IDENTITY (UPI SETUP) */}
        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>💳 PAYOUT IDENTITY</Text>
            <TextInput 
                style={[styles.input, !isEditing && styles.inputDisabled]} 
                value={upiId} 
                onChangeText={setUpiId}
                placeholder="Enter UPI ID (e.g. name@apl)"
                placeholderTextColor="#444"
                editable={isEditing}
            />
            {isEditing ? (
                <Pressable style={styles.saveBtn} onPress={handleUpdateProfile}>
                    <Text style={styles.saveBtnText}>{loading ? "SAVING..." : "CONFIRM IDENTITY"}</Text>
                </Pressable>
            ) : (
                <Pressable style={styles.editBtn} onPress={() => setIsEditing(true)}>
                    <Text style={styles.editBtnText}>EDIT UPI DETAILS</Text>
                </Pressable>
            )}
        </View>

        {/* 4. COMPLIANCE & LEGAL (PLAY STORE MANDATORY) */}
        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🛡️ COMPLIANCE & LEGAL</Text>
            <Pressable style={styles.linkRow} onPress={() => Alert.alert("Disclaimer", "Wealth management involves risk. Rewards are promotional incentives.")}>
                <Feather name="info" size={16} color="#FFD700" />
                <Text style={styles.linkText}>View Disclaimer</Text>
            </Pressable>
            <Pressable style={styles.linkRow} onPress={() => Alert.alert("Privacy", "We encrypt your mobile number and never share your ledger data.")}>
                <Feather name="lock" size={16} color="#FFD700" />
                <Text style={styles.linkText}>Data Privacy Policy</Text>
            </Pressable>
            <Pressable style={styles.linkRow} onPress={() => Alert.alert("Terms", "One account per device. Self-referrals result in permanent ban.")}>
                <Feather name="file-text" size={16} color="#FFD700" />
                <Text style={styles.linkText}>Terms & Conditions</Text>
            </Pressable>
        </View>

        <Pressable style={styles.logoutBtn} onPress={logout}>
            <Feather name="log-out" size={18} color="white" />
            <Text style={styles.logoutText}>LOGOUT FROM VAULT</Text>
        </Pressable>

        <Text style={styles.versionText}>Global Wallet Sovereign • v1.0.24</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 10 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#0A192F' },
  userName: { color: 'white', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  badge: { backgroundColor: 'rgba(255,215,0,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginTop: 8, borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)' },
  badgeText: { color: '#FFD700', fontSize: 9, fontWeight: 'bold' },
  wealthCard: { backgroundColor: 'rgba(255,255,255,0.03)', marginHorizontal: 20, borderRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255,215,0,0.1)' },
  cardLabel: { color: '#FFD700', fontSize: 9, fontWeight: 'bold', opacity: 0.6, textAlign: 'center' },
  cardVal: { color: 'white', fontSize: 36, fontWeight: '900', textAlign: 'center', marginVertical: 10 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  miniLabel: { color: 'white', opacity: 0.4, fontSize: 8, fontWeight: 'bold' },
  miniVal: { color: 'white', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  withdrawBtn: { backgroundColor: '#FFD700', padding: 18, borderRadius: 15, alignItems: 'center' },
  withdrawBtnText: { color: 'black', fontWeight: '900', fontSize: 13 },
  sectionCard: { backgroundColor: 'rgba(255,255,255,0.02)', marginHorizontal: 20, marginTop: 20, borderRadius: 20, padding: 20 },
  sectionTitle: { color: '#FFD700', fontSize: 10, fontWeight: 'bold', marginBottom: 15, opacity: 0.7 },
  input: { backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', padding: 15, borderRadius: 12, fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  inputDisabled: { opacity: 0.5 },
  editBtn: { alignSelf: 'flex-end', marginTop: 10 },
  editBtnText: { color: '#FFD700', fontSize: 11, fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#1B4D3E', padding: 12, borderRadius: 10, marginTop: 15, alignItems: 'center' },
  saveBtnText: { color: '#00FF00', fontSize: 11, fontWeight: 'bold' },
  linkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 12 },
  linkText: { color: 'white', fontSize: 13, opacity: 0.8 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 30, marginBottom: 10 },
  logoutText: { color: 'white', fontWeight: 'bold', fontSize: 12, opacity: 0.6 },
  versionText: { textAlign: 'center', color: '#444', fontSize: 9, marginBottom: 50 }
});
