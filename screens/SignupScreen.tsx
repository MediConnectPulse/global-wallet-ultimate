import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../lib/auth";
import { Feather } from "@expo/vector-icons";

export default function SignupScreen({ navigation }: any) {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [ref, setRef] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");

  const handleSignup = async () => {
    if (!accepted)
      return Alert.alert("Required", "Please accept the Data Policy");
    if (mobile.length !== 10 || pin.length !== 4)
      return Alert.alert("Error", "Check Mobile/PIN length");

    const result = await signup(mobile, pin, ref, name);
    if (result.success) setRecoveryKey(result.recoveryKey);
    else Alert.alert("Error", result.error);
  };

  if (recoveryKey) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#0A192F", "#02060C"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.card}>
          <Feather
            name="shield"
            size={50}
            color="#FFD700"
            style={{ alignSelf: "center" }}
          />
          <Text style={styles.modalTitle}>Vault Active</Text>
          <Text style={styles.keyText}>{recoveryKey}</Text>
          <Text style={styles.warning}>
            CRITICAL: This key is non-recoverable by our admins. Save it now.
          </Text>
          <Pressable
            style={styles.btn}
            onPress={() => navigation.replace("Login")}
          >
            <Text style={styles.btnText}>I HAVE SAVED IT</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <LinearGradient
        colors={["#0A192F", "#02060C"]}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.title}>JOIN GLOBAL WALLET</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="numeric"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
        />
        <TextInput
          style={styles.input}
          placeholder="Create 4-Digit PIN"
          keyboardType="numeric"
          maxLength={4}
          value={pin}
          onChangeText={setPin}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Referral Code (Optional)"
          value={ref}
          onChangeText={setRef}
        />
        <Pressable style={styles.row} onPress={() => setAccepted(!accepted)}>
          <Feather
            name={accepted ? "check-square" : "square"}
            size={20}
            color="#FFD700"
          />
          <Text style={styles.terms}>
            I agree to the Disclaimer & Data Policy
          </Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={handleSignup}>
          <Text style={styles.btnText}>CREATE ACCOUNT</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 25 },
  title: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 25,
    borderRadius: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: "black",
    height: 55,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  terms: { color: "white", marginLeft: 10, fontSize: 11 },
  btn: {
    backgroundColor: "#FFD700",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { fontWeight: "bold", color: "black" },
  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  keyText: {
    color: "#FFD700",
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 5,
  },
  warning: {
    color: "#FF4444",
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
    fontWeight: "bold",
  },
});
