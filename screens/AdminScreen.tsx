import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, Alert, RefreshControl, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

export default function AdminScreen() {
  const [stats, setStats] = useState({ downloads: 0, subs: 0, referrers: 0, gross: 0, net: 0 });
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAdminData(); }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    const { data: pnl } = await supabase.from('admin_pnl_intelligence').select('*').single();
    if (pnl) setStats({ 
        downloads: pnl.total_downloads, 
        subs: pnl.active_subscriptions, 
        referrers: pnl.active_referrers,
        gross: pnl.gross_revenue, 
        net: pnl.net_profit 
    });
    const { data: gs } = await supabase.from('global_settings').select('*').single();
    if (gs) setSettings(gs);
    setLoading(false);
  };

  const handlePublish = async () => {
    const { error } = await supabase.from('global_settings').update(settings).eq('id', 1);
    if (!error) {
      Alert.alert("Success", "Global UI and Rewards updated instantly.");
      fetchAdminData();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A192F', '#02060C']} style={StyleSheet.absoluteFill} />
      
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 60 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAdminData} tintColor="#FFD700" />}
      >
        <Text style={styles.mainTitle}>MASTER COMMAND HUB</Text>

        {/* --- CONTAINER 1: THE WORKSHOP (EDITABLE) --- */}
        <View style={styles.bigCard}>
          <Text style={styles.cardHeader}>🛠️ THE WORKSHOP (CHANGE UI & MONEY)</Text>
          
          <View style={styles.inputGrid}>
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>SUBSCRIPTION FEE (₹)</Text>
              <TextInput style={styles.input} value={String(settings.subscription_fee || 0)} onChangeText={(v) => setSettings({...settings, subscription_fee: Number(v)})} keyboardType="numeric" />
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>CYCLE ID (RESET)</Text>
              <TextInput style={styles.input} value={settings.current_cycle_id} onChangeText={(v) => setSettings({...settings, current_cycle_id: v})} />
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>TIER-1 REWARD (₹)</Text>
              <TextInput style={styles.input} value={String(settings.t1_reward || 0)} onChangeText={(v) => setSettings({...settings, t1_reward: Number(v)})} keyboardType="numeric" />
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>TIER-2 REWARD (₹)</Text>
              <TextInput style={styles.input} value={String(settings.t2_reward || 0)} onChangeText={(v) => setSettings({...settings, t2_reward: Number(v)})} keyboardType="numeric" />
            </View>
          </View>

          <Text style={styles.inputLabel}>CAMPAIGN BONUS / NOTICE NEWS</Text>
          <TextInput style={styles.textArea} value={settings.notice_board_text} onChangeText={(v) => setSettings({...settings, notice_board_text: v})} multiline />

          <Pressable style={styles.publishBtn} onPress={handlePublish}>
             <Text style={styles.publishText}>PUBLISH CHANGES GLOBALLY</Text>
          </Pressable>
        </View>

        {/* --- CONTAINER 2: THE LEDGER (CHECK-VIEW / PRINTABLE) --- */}
        <View style={styles.bigCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardHeader}>📊 THE LEDGER (PRINTABLE INTEL)</Text>
            <Pressable onPress={() => Alert.alert("Printing", "Ledger export started...")}><Feather name="printer" size={18} color="#FFD700" /></Pressable>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>DOWNLOADS</Text>
              <Text style={styles.statVal}>{stats.downloads}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>ACTIVE SUBS</Text>
              <Text style={styles.statVal}>{stats.subs}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>ACTIVE REFERRERS</Text>
              <Text style={styles.statVal}>{stats.referrers}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>GROSS REVENUE</Text>
              <Text style={styles.statVal}>₹{stats.gross}</Text>
            </View>
            <View style={[styles.statItem, {width: '100%', backgroundColor: '#1B4D3E', marginTop: 10}]}>
              <Text style={[styles.statLabel, {color: '#FFF'}]}>NET PROFIT (YOUR TAKE-HOME)</Text>
              <Text style={[styles.statVal, {color: '#00FF00', fontSize: 24}]}>₹{stats.net}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainTitle: { color: '#FFD700', fontSize: 18, fontWeight: '900', textAlign: 'center', marginBottom: 30, letterSpacing: 2 },
  bigCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 30, padding: 20, marginHorizontal: 20, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(255,215,0,0.1)' },
  cardHeader: { color: '#FFD700', fontSize: 10, fontWeight: '900', marginBottom: 20, letterSpacing: 1 },
  inputGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  inputBox: { width: '48%', marginBottom: 15 },
  inputLabel: { color: 'white', opacity: 0.4, fontSize: 8, fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', fontSize: 14, fontWeight: 'bold' },
  textArea: { backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', padding: 15, borderRadius: 12, minHeight: 80, textAlignVertical: 'top', fontSize: 13 },
  publishBtn: { backgroundColor: '#FFD700', padding: 18, borderRadius: 15, marginTop: 25, alignItems: 'center' },
  publishText: { color: 'black', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statItem: { width: '48%', backgroundColor: 'rgba(255,255,255,0.02)', padding: 15, borderRadius: 15, marginBottom: 10 },
  statLabel: { color: 'white', opacity: 0.5, fontSize: 8, fontWeight: 'bold' },
  statVal: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 5 }
});
