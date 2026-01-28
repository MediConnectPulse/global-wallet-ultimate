import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, Alert, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, setUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // FORM STATE
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    age: String(user?.age || ""),
    gender: user?.gender || "",
    bank_name: user?.bank_name || "",
    account_holder_name: user?.account_holder_name || "",
    ifsc_code: user?.ifsc_code || ""
  });

  const handleUpdateProtocol = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // SAVE TO SUPABASE
    const { error } = await supabase.from('users').update({
      full_name: formData.full_name,
      age: parseInt(formData.age) || 0,
      gender: formData.gender,
      bank_name: formData.bank_name,
      account_holder_name: formData.account_holder_name,
      ifsc_code: formData.ifsc_code
    }).eq('id', user.id);

    if (!error) {
      Alert.alert("Dignity Restored", "Your Profile Data has been updated in the vault.");
      setIsEditing(false);
      // Refresh local session
      const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (data) setUser(data);
    } else {
      Alert.alert("System Error", "Update failed. Check connection.");
    }
  };

  // MOTIVATIONAL CALCULATION
  const totalLifetimeEarnings = (user?.wallet_balance || 0) + (user?.total_withdrawn || 0);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F0C29', '#302b63', '#24243e']} style={StyleSheet.absoluteFill} />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 20 }}>
        
        {/* 1. IDENTITY HEADER */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.full_name?.charAt(0) || "U"}</Text>
          </View>
          <Text style={styles.userName}>{user?.full_name?.toUpperCase()}</Text>
          <Text style={styles.userMobile}>{user?.mobile_number}</Text>
        </View>

        {/* 2. MOTIVATIONAL WEALTH CARD */}
        <LinearGradient colors={['#B8860B', '#806000']} style={styles.motivationCard}>
          <Feather name="trending-up" size={20} color="white" style={styles.trendIcon} />
          <Text style={styles.mLabel}>TOTAL WEALTH GENERATED</Text>
          <Text style={styles.mVal}>₹{totalLifetimeEarnings.toLocaleString('en-IN')}</Text>
          <Text style={styles.mSub}>Success tracking since {new Date(user?.created_at).toLocaleDateString()}</Text>
        </LinearGradient>

        {/* 3. WITHDRAWAL HUB */}
        <View style={styles.withdrawSection}>
          <Text style={styles.sectionTitle}>💰 WITHDRAWAL HUB</Text>
          <View style={styles.walletRow}>
             <View>
                <Text style={styles.wLabel}>AVAILABLE</Text>
                <Text style={styles.wVal}>₹{user?.wallet_balance || 0}</Text>
             </View>
             <Pressable style={[styles.withdrawBtn, {opacity: user?.wallet_balance < 500 ? 0.4 : 1}]} 
                        onPress={() => Alert.alert("Request Sent", "Admin will verify bank details below.")}>
                <Text style={styles.withdrawText}>PAYOUT</Text>
             </Pressable>
          </View>
        </View>

        {/* 4. DATA VAULT (EDITABLE) */}
        <View style={styles.vaultContainer}>
          <Text style={styles.sectionTitle}>📋 PERSONAL & BANKING DATA</Text>
          
          <InputGroup label="FULL NAME" value={formData.full_name} isEditing={isEditing} onChange={(t) => setForm({...formData, full_name: t})} />
          
          <View style={{flexDirection: 'row', gap: 15}}>
             <InputGroup label="AGE" value={formData.age} isEditing={isEditing} onChange={(t) => setFormData({...formData, age: t})} half />
             <InputGroup label="GENDER" value={formData.gender} isEditing={isEditing} onChange={(t) => setFormData({...formData, gender: t})} half />
          </View>

          <InputGroup label="BANK NAME" value={formData.bank_name} isEditing={isEditing} onChange={(t) => setFormData({...formData, bank_name: t})} />
          <InputGroup label="ACCOUNT HOLDER" value={formData.account_holder_name} isEditing={isEditing} onChange={(t) => setFormData({...formData, account_holder_name: t})} />
          <InputGroup label="IFSC CODE" value={formData.ifsc_code} isEditing={isEditing} onChange={(t) => setFormData({...formData, ifsc_code: t})} />

          <View style={styles.recoveryBox}>
            <Text style={styles.rLabel}>RECOVERY KEY (PRIVATE)</Text>
            <Text style={styles.rVal}>{user?.recovery_key}</Text>
          </View>
        </View>

        {/* 5. THE MASTER BUTTON */}
        <Pressable style={[styles.masterBtn, isEditing && {backgroundColor: '#00FF00'}]} onPress={handleUpdateProtocol}>
          <Feather name={isEditing ? "save" : "edit-3"} size={20} color="black" />
          <Text style={styles.masterBtnText}>{isEditing ? "SAVE TO VAULT" : "UPDATE PROFILE DATA"}</Text>
        </Pressable>

        <Pressable onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout from Session</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

// --- UI HELPER: EDITABLE ROW ---
function InputGroup({ label, value, isEditing, onChange, half }: any) {
    return (
        <View style={[styles.inputGroup, half && {flex: 1}]}>
            <Text style={styles.inputLabel}>{label}</Text>
            {isEditing ? (
                <TextInput style={styles.inputField} value={value} onChangeText={onChange} placeholder="Enter..." placeholderTextColor="#555" />
            ) : (
                <Text style={styles.inputText}>{value || "---"}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', marginBottom: 25 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center', elevation: 10 },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#0A192F' },
  userName: { color: 'white', fontSize: 18, fontWeight: '900', marginTop: 10, letterSpacing: 1 },
  userMobile: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  motivationCard: { marginHorizontal: 20, borderRadius: 25, padding: 20, alignItems: 'center', marginBottom: 25, elevation: 5 },
  trendIcon: { position: 'absolute', right: 20, top: 20, opacity: 0.5 },
  mLabel: { color: 'white', fontSize: 9, fontWeight: 'bold', opacity: 0.8 },
  mVal: { color: 'white', fontSize: 32, fontWeight: '900', marginVertical: 5 },
  mSub: { color: 'white', fontSize: 8, opacity: 0.6 },
  withdrawSection: { backgroundColor: 'rgba(255,255,255,0.03)', marginHorizontal: 20, padding: 20, borderRadius: 20, marginBottom: 20 },
  sectionTitle: { color: '#FFD700', fontSize: 10, fontWeight: 'bold', marginBottom: 15, opacity: 0.7 },
  walletRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wLabel: { color: 'white', fontSize: 8, opacity: 0.5 },
  wVal: { color: '#00FF00', fontSize: 24, fontWeight: 'bold' },
  withdrawBtn: { backgroundColor: '#FFD700', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  withdrawText: { color: 'black', fontSize: 10, fontWeight: '900' },
  vaultContainer: { backgroundColor: 'rgba(255,255,255,0.03)', marginHorizontal: 20, padding: 20, borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,215,0,0.1)' },
  inputGroup: { marginBottom: 18 },
  inputLabel: { color: 'white', opacity: 0.4, fontSize: 8, fontWeight: 'bold', marginBottom: 5 },
  inputText: { color: 'white', fontSize: 15, fontWeight: '600' },
  inputField: { color: '#FFD700', fontSize: 15, borderBottomWidth: 1, borderBottomColor: '#FFD700', paddingVertical: 2 },
  recoveryBox: { marginTop: 10, padding: 15, backgroundColor: 'rgba(255,215,0,0.05)', borderRadius: 12, alignItems: 'center' },
  rLabel: { color: '#FFD700', fontSize: 8, fontWeight: 'bold' },
  rVal: { color: '#FFD700', fontSize: 20, fontWeight: 'bold', letterSpacing: 3, marginTop: 5 },
  masterBtn: { backgroundColor: '#FFD700', marginHorizontal: 20, padding: 18, borderRadius: 20, marginTop: 25, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 8 },
  masterBtnText: { color: 'black', fontWeight: '900', fontSize: 14 },
  logoutBtn: { marginTop: 30, alignItems: 'center' },
  logoutText: { color: '#FF4444', fontSize: 11, fontWeight: 'bold', opacity: 0.7 }
});
