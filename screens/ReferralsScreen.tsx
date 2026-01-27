import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, FlatList, Image, Animated, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

export default function ReferralsScreen() {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [settings, setSettings] = useState<any>(null);
  const blinkAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    fetchData();
    // LOGIC: BLINKING ANIMATION FOR CAMPAIGN
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const fetchData = async () => {
    const { data: gs } = await supabase.from('global_settings').select('*').single();
    setSettings(gs);
    const { data: teamData } = await supabase.from('users').select('full_name, mobile_number, subscription_status').eq('referred_by_code', user?.mobile_number);
    setTeam(teamData || []);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A192F', '#050C16']} style={StyleSheet.absoluteFill} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 60 }}>
        
        {/* 1. BRANDED HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>EXECUTIVE GROWTH</Text>
          <Text style={styles.subTitle}>My Network: {user?.mobile_number}</Text>
        </View>

        {/* 2. DYNAMIC NOTICE BOARD (ADMIN CONTROLLED) */}
        <View style={styles.noticeBoard}>
          <Text style={styles.label}>📢 LATEST UPDATES</Text>
          <Image source={{ uri: settings?.notice_board_image }} style={styles.noticeImg} />
          <Text style={styles.noticeText}>{settings?.notice_board_text}</Text>
        </View>

        {/* 3. BLINKING CAMPAIGN BANNER */}
        {settings?.campaign_is_active && (
          <Animated.View style={{ opacity: blinkAnim }}>
            <LinearGradient colors={['#FFD700', '#B8860B']} style={styles.campaignBox}>
              <Feather name="award" size={24} color="black" />
              <View style={{marginLeft: 15, flex: 1}}>
                <Text style={styles.campaignTitle}>{settings?.campaign_title}</Text>
                <Text style={styles.campaignDesc}>Achieve the target to win the Admin Bonus!</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* 4. TEAM LIST */}
        <Text style={styles.listHeader}>DIRECT TEAM (TIER-1)</Text>
        {team.map((item: any, index) => (
          <View key={index} style={styles.userCard}>
            <Text style={styles.srNo}>#{index + 1}</Text>
            <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.userName}>{item.full_name}</Text>
                <Text style={styles.userPhone}>{item.mobile_number}</Text>
            </View>
            <Text style={[styles.statusText, {color: item.subscription_status === 'premium' ? '#00FF00' : '#888'}]}>
              {item.subscription_status.toUpperCase()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { color: '#FFD700', fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  subTitle: { color: 'white', opacity: 0.5, fontSize: 10, marginTop: 5 },
  noticeBoard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 25, padding: 15, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(255,215,0,0.1)' },
  label: { color: '#FFD700', fontSize: 10, fontWeight: 'bold', marginBottom: 12 },
  noticeImg: { width: '100%', height: 120, borderRadius: 15, marginBottom: 15 },
  noticeText: { color: 'white', textAlign: 'center', fontSize: 12, lineHeight: 18, opacity: 0.8 },
  campaignBox: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginBottom: 30 },
  campaignTitle: { color: 'black', fontWeight: '900', fontSize: 16 },
  campaignDesc: { color: 'black', fontSize: 10, fontWeight: 'bold', opacity: 0.7 },
  listHeader: { color: '#FFD700', fontSize: 11, fontWeight: '900', marginBottom: 15, opacity: 0.5 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', padding: 18, borderRadius: 20, marginBottom: 10 },
  srNo: { color: '#FFD700', fontWeight: 'bold', fontSize: 12 },
  userName: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  userPhone: { color: 'white', opacity: 0.3, fontSize: 10 },
  statusText: { fontSize: 10, fontWeight: 'bold' }
});
