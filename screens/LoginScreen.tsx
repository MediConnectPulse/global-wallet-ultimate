import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../lib/auth";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (mobile.length !== 10 || pin.length !== 4) {
      Alert.alert("Error", "Enter 10-digit mobile and 4-digit PIN");
      return;
    }
    setLoading(true);
    const result = await login(mobile, pin);
    if (!result.success) Alert.alert("Access Denied", "Invalid Mobile or PIN");
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0A192F", "#02060C"]}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.title}>GLOBAL WALLET</Text>
      <View style={styles.card}>
        <Text style={styles.label}>MOBILE NUMBER</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
          placeholder="10 Digit Number"
          placeholderTextColor="#444"
        />
        <Text style={styles.label}>4-DIGIT PIN</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
          value={pin}
          onChangeText={setPin}
          placeholder="****"
          placeholderTextColor="#444"
        />
        <Pressable style={styles.btn} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text style={styles.btnText}>OPEN VAULT</Text>
          )}
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.link}>Create New Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 25 },
  title: {
    color: "#FFD700",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: 3,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.1)",
  },
  label: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    color: "black",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 18,
    height: 55,
  },
  btn: {
    backgroundColor: "#FFD700",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { fontWeight: "900", color: "black" },
  link: { color: "white", opacity: 0.4, textAlign: "center", marginTop: 25 },
});
