import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function GrowthScreen() {
  const { user } = useAuth(); // Returns Auth User
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const [cycleId, setCycleId] = useState("WEEK_??");
  const [valveUnlocked, setValveUnlocked] = useState(false);

  useEffect(() => {
    if (user) fetchGrowthData();
  }, [user]);

  const fetchGrowthData = async () => {
    setLoading(true);
    try {
      // 1. Get Current Global Cycle
      const { data: settings } = await supabase
        .from("admin_settings")
        .select("current_cycle_id")
        .single();
      const currentCycle = settings?.current_cycle_id || "WEEK_01";
      setCycleId(currentCycle);

      // 2. Fetch Direct Referrals (Using 'profiles' table, NOT 'users')
      // We look for profiles where referrer_id matches the logged-in user's ID
      const { data: myRecruits, error } = await supabase
        .from("profiles")
        .select("id, full_name, mobile, status, created_at, activation_cycle")
        .eq("referrer_id", user?.id);

      if (error) throw error;
      setReferrals(myRecruits || []);

      // 3. SMART VALVE LOGIC
      // Unlock ONLY if user has >= 1 Premium Recruit in the CURRENT cycle
      const activeRecruitsInCycle = (myRecruits || []).filter(
        (r) => r.status === "premium" && r.activation_cycle === currentCycle,
      );

      setValveUnlocked(activeRecruitsInCycle.length >= 1);
    } catch (e) {
      console.log("Growth Sync Error:", e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View
        style={[
          styles.avatar,
          { borderColor: item.status === "premium" ? "#FFD700" : "#8892B0" },
        ]}
      >
        <Text style={styles.avatarText}>
          {item.full_name?.charAt(0) || "U"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.full_name || "Unknown User"}</Text>
        <Text style={styles.userPhone}>{item.mobile || "Pending ID"}</Text>
      </View>
      {item.status === "premium" ? (
        <Ionicons name="shield-checkmark" size={18} color="#FFD700" />
      ) : (
        <Feather name="clock" size={16} color="#8892B0" />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0A192F", "#000000"]}
        style={StyleSheet.absoluteFill}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>DYNASTY</Text>
          <Text style={styles.subTitle}>CYCLE: {cycleId}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{referrals.length}</Text>
        </View>
      </View>

      {/* SMART VALVE STATUS */}
      <View
        style={[
          styles.valveBox,
          { borderColor: valveUnlocked ? "#00FF00" : "#FF4500" },
        ]}
      >
        <View style={styles.valveHeader}>
          <Ionicons
            name={valveUnlocked ? "lock-open" : "lock-closed"}
            size={24}
            color={valveUnlocked ? "#00FF00" : "#FF4500"}
          />
          <Text
            style={[
              styles.valveTitle,
              { color: valveUnlocked ? "#00FF00" : "#FF4500" },
            ]}
          >
            {valveUnlocked ? "TIER-2 UNLOCKED" : "TIER-2 LOCKED"}
          </Text>
        </View>
        <Text style={styles.valveDesc}>
          {valveUnlocked
            ? "Passive income flows freely this cycle."
            : `Recruit 1 Premium member in ${cycleId} to unlock passive rewards.`}
        </Text>
      </View>

      {/* RECRUIT LIST */}
      <Text style={styles.listHeader}>DIRECT RECRUITS (TIER 1)</Text>
      <FlatList
        data={referrals}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchGrowthData}
            tintColor="#FFD700"
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No recruits found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
  },
  subTitle: { color: "#8892B0", fontSize: 12, fontWeight: "700", marginTop: 2 },
  countBadge: {
    backgroundColor: "rgba(255,215,0,0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  countText: { color: "#FFD700", fontWeight: "900", fontSize: 18 },

  valveBox: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 30,
  },
  valveHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  valveTitle: {
    fontWeight: "900",
    fontSize: 14,
    marginLeft: 10,
    letterSpacing: 1,
  },
  valveDesc: { color: "#E6F1FF", fontSize: 12, lineHeight: 18, opacity: 0.8 },

  listHeader: {
    color: "#8892B0",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 15,
    letterSpacing: 1,
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#112240",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#0A192F",
  },
  avatarText: { color: "white", fontWeight: "bold" },
  userName: { color: "#E6F1FF", fontWeight: "700", fontSize: 14 },
  userPhone: { color: "#8892B0", fontSize: 11, marginTop: 2 },
  empty: {
    color: "#8892B0",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
});
