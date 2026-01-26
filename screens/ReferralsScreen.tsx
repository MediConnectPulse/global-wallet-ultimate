import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

export default function ReferralsScreen() {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase
        .from("users")
        .select("mobile_number, full_name")
        .eq("referred_by_code", user.mobile_number);
      setTeam(data || []);
      const { data: cycle } = await supabase
        .from("cycle_activity")
        .select("direct_referrals_count")
        .eq("user_id", user.id)
        .single();
      setCycleCount(cycle?.direct_referrals_count || 0);
    };
    fetchTeam();
  }, []);

  const isUnlocked = user.subscription_status === "premium" && cycleCount >= 1;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>GROWTH NETWORK</Text>
      <View style={styles.codeCard}>
        <Text style={styles.label}>YOUR REFERRAL CODE</Text>
        <Text style={styles.code}>{user.mobile_number}</Text>
      </View>

      <View
        style={[
          styles.lockBox,
          { borderColor: isUnlocked ? "#00FF00" : "#FFD700" },
        ]}
      >
        <Feather
          name={isUnlocked ? "unlock" : "lock"}
          size={20}
          color={isUnlocked ? "#00FF00" : "#FFD700"}
        />
        <Text style={styles.lockText}>
          Tier-2 Status: {isUnlocked ? "UNLOCKED" : "LOCKED"}
        </Text>
      </View>

      <Text style={styles.listTitle}>DIRECT RECRUITS (TIER-1)</Text>
      <FlatList
        data={team}
        keyExtractor={(item) => item.mobile_number}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <Feather name="user" size={16} color="#FFD700" />
            <Text style={styles.userName}>{item.full_name}</Text>
            <Text style={styles.userPhone}>{item.mobile_number}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A192F",
    padding: 25,
    paddingTop: 60,
  },
  header: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 30,
  },
  codeCard: {
    backgroundColor: "rgba(255,215,0,0.1)",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  label: { color: "white", opacity: 0.5, fontSize: 10, fontWeight: "bold" },
  code: { color: "#FFD700", fontSize: 26, fontWeight: "bold", marginTop: 10 },
  lockBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 30,
  },
  lockText: { color: "white", fontWeight: "bold" },
  listTitle: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 15,
    opacity: 0.6,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    marginBottom: 10,
  },
  userName: { color: "white", flex: 1, marginLeft: 15 },
  userPhone: { color: "#FFD700", fontSize: 12 },
});
