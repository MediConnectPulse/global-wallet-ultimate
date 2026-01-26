import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/lib/auth";

export default function ReportsScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0A192F", "#02060C"]}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.header}>WEALTH ANALYTICS</Text>

      <View style={styles.lockBox}>
        <Text style={styles.lockText}>
          {user?.subscription_status === "premium"
            ? "Your high-tech spending charts are being generated..."
            : "PREMIUM REQUIRED: Upgrade to view deep-analysis charts."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, alignItems: "center" },
  header: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
  },
  lockBox: {
    marginTop: 100,
    padding: 30,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.2)",
  },
  lockText: { color: "white", textAlign: "center", opacity: 0.6, fontSize: 14 },
});
