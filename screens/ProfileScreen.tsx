import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Alert, ScrollView, TextInput, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
export default function ProfileScreen() {
  const { user, setUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleUpdate = async () => {
    if (!isEditing) return setIsEditing(true);
    const { error } = await supabase.from('users').update(formData).eq('id', user.id);
    if (!error) {
      Alert.alert("Dignity Restored", "Your personal vault has been updated.");
      setIsEditing(false);
    }
  };

  return (
    <ScrollView style={{backgroundColor: '#0A192F'}}>
      <LinearGradient colors={['#1B4D3E', '#0A2E24']} style={styles.withdrawCard}>
         <Text style={styles.label}>PASSIVE BALANCE</Text>
         <Text style={styles.val}>₹{user.wallet_balance}</Text>
         <Pressable style={styles.btn} onPress={() => Alert.alert("Request Sent", "Admin will verify.")}><Text>REQUEST PAYOUT</Text></Pressable>
      </LinearGradient>

      <View style={styles.dataVault}>
        <Text style={styles.sectionTitle}>📋 PERSONAL & BANKING DATA</Text>
        <TextInput style={styles.input} value={formData.full_name} editable={isEditing} onChangeText={(t) => setFormData({...formData, full_name: t})} placeholder="Name" />
        <TextInput style={styles.input} value={String(formData.age)} editable={isEditing} onChangeText={(t) => setFormData({...formData, age: t})} placeholder="Age" keyboardType="numeric" />
        <TextInput style={styles.input} value={formData.bank_name} editable={isEditing} onChangeText={(t) => setFormData({...formData, bank_name: t})} placeholder="Bank Name" />
        <TextInput style={styles.input} value={formData.ifsc_code} editable={isEditing} onChangeText={(t) => setFormData({...formData, ifsc_code: t})} placeholder="IFSC Code" />
        
        <Pressable style={styles.masterUpdateBtn} onPress={handleUpdate}>
          <Text style={{fontWeight: 'bold'}}>{isEditing ? "SAVE TO VAULT" : "UPDATE PROFILE"}</Text>
        </Pressable>

        <Pressable onPress={logout} style={{marginTop: 30}}><Text style={{color: 'red', textAlign: 'center'}}>LOGOUT</Text></Pressable>
      </View>
    </ScrollView>
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
