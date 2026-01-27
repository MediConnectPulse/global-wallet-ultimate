import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput, Pressable, Alert, RefreshControl, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

const { width } = Dimensions.get('window');

export default function AdminScreen() {
  const [stats, setStats] = useState({ downloads: 0, subs: 0, gross: 0, net: 0 });
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    // 1. Fetch "Check-View" Intelligence View
    const { data: pnl } = await supabase.from('admin_pnl_intelligence').select('*').single();
    if (pnl) setStats({ downloads: pnl.total_downloads, subs: pnl.active_subscriptions, gross: pnl.gross_revenue, net: pnl.net_profit });

    // 2. Fetch "Editable" Global Settings
    const { data: gs } = await supabase.from('global_settings').select('*').single();
    setSettings(gs);
    setLoading(false);
  };

  const publishChanges = async () => {
    const { error } = await supabase.from('global_settings').update(settings).eq('id', 1);
    if (!error) {
        Alert.alert("Dignity Confirmed", "Global App UI & Money Flow Updated Instantly.");
        fetchAllData();
    }
  };

  const printReport = () => {
    Alert.alert("Generating Report", "Dignity Ledger Exporting to PDF/Excel...");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A192F', '#02060C']} style={StyleSheet.absoluteFill} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 60 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAllData} tintColor="#FFD700" />}
      >
        <Text style={styles.mainTitle}>MASTER ADMIN CONTROL</Text>

        {/* --- CONTAINER 1: THE WORKSHOP (CHANGE/EDITABLE) --- */}
        <View style={styles.bigContainer}>
          <Text style={styles.containerLabel}>🛠️ THE WORKSHOP (EDITABLE CONTROL)</Text>
          
          <View style={styles.inputGrid}>
            <View style={styles.inputItem}>
                <Text style={styles.label}>SUBSCRIPTION FEE (₹)</Text>
                <TextInput style={styles.input} value={String(settings.subscription_fee)} onChangeText={(v) => setSettings({...settings, subscription_fee: Number(v)})} keyboardType="numeric" />
            </View>
            <View style={styles.inputItem}>
                <Text style={styles.label}>CYCLE ID (e.g. WEEK_01)</Text>
                <TextInput style={styles.input} value={settings.current_cycle_id} onChangeText={(v) => setSettings({...settings, current_cycle_id: v})} />
            </View>
            <View style={styles.inputItem}>
                <Text style={styles.label}>TIER-1 REWARD (₹)</Text>
                <TextInput style={styles.input} value={String(settings.t1_reward)} onChangeText={(v) => setSettings({...settings, t1_reward: Number(v)})} keyboardType="numeric" />
            </View>
            <View style={styles.inputItem}>
                <Text style={styles.label}>TIER-2 REWARD (₹)</Text>
                <TextInput style={styles.input} value={String(settings.t2_reward)} onChangeText={(v) => setSettings({...settings, t2_reward: Number(v)})} keyboardType="numeric" />
            </View>
          </View>

          <Text style={styles.label}>NOTICE BOARD NEWS</Text>
          <TextInput style={styles.inputArea} value={settings.notice_board_text} onChangeText={(v) => setSettings({...settings, notice_board_text: v})} multiline />

          <Pressable style={styles.publishBtn} onPress={publishChanges}>
            <LinearGradient colors={['#FFD700', '#B8860B']} style={styles.gradBtn}>
               <Text style={styles.publishText}>PUBLISH CHANGES GLOBALLY</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* --- CONTAINER 2: THE LEDGER (TO CHECK-VIEW / PRINTABLE) --- */}
        <View style={styles.bigContainer}>
          <View style={styles.rowBetween}>
            <Text style={styles.containerLabel}>📊 THE LEDGER (BUSINESS INTEL)</Text>
            <Pressable onPress={printReport}><Feather name="printer" size={18} color="#FFD700" /></Pressable>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
                <Text style={styles.statLabel}>TOTAL DOWNLOADS</Text>
                <Text style={styles.statVal}>{stats.downloads}</Text>
            </View>
            <View style={styles.statBox}>
                <Text style={styles.statLabel}>ACTIVE PREMIUMS</Text>
                <Text style={[styles.statVal, {color: '#FFD700'}]}>{stats.subs}</Text>
            </View>
            <View style={styles.statBox}>
                <Text style={styles.statLabel}>GROSS REVENUE</Text>
                <Text style={styles.statVal}>₹{stats.gross}</Text>
            </View>
            <View style={[styles.statBox, {backgroundColor: 'rgba(0, 255, 0, 0.05)', borderWidth: 1, borderColor: '#00FF00'}]}>
                <Text style={[styles.statLabel, {color: '#00FF00'}]}>NET PROFIT (OWNER)</Text>
                <Text style={[styles.statVal, {color: '#00FF00'}]}>₹{stats.net}</Text>
            </View>
          </View>

          <Text style={styles.footerHint}>* Net Profit automatically excludes all referral payouts.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainTitle: { color: '#FFD700', fontSize: 20, fontWeight: '900', textAlign: 'center', marginBottom: 30, letterSpacing: 2 },
  bigContainer: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 30, padding: 20, marginHorizontal: 20, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(255,215,0,0.1)' },
  containerLabel: { color: '#FFD700', fontSize: 10, fontWeight: '900', marginBottom: 20, letterSpacing: 1 },
  inputGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  inputItem: { width: '48%', marginBottom: 15 },
  label: { color: 'white', opacity: 0.4, fontSize: 8, fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', fontSize: 14, fontWeight: 'bold' },
  inputArea: { backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', padding: 15, borderRadius: 12, minHeight: 80, textAlignVertical: 'top', fontSize: 13 },
  publishBtn: { marginTop: 25, borderRadius: 15, overflow: 'hidden' },
  gradBtn: { padding: 18, alignItems: 'center' },
  publishText: { color: 'black', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { width: '48%', backgroundColor: 'rgba(255,255,255,0.02)', padding: 15, borderRadius: 15, marginBottom: 15 },
  statLabel: { color: 'white', opacity: 0.5, fontSize: 8, fontWeight: 'bold' },
  statVal: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  footerHint: { color: '#888', fontSize: 9, fontStyle: 'italic', textAlign: 'center', marginTop: 10 }
});
