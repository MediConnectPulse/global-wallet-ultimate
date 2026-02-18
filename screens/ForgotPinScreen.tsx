import React, { useState } from "react";
import { View, StyleSheet, Alert, Text, TextInput, TouchableOpacity } from "react-native";

export default function ForgotPinScreen() {
  const [key, setKey] = useState("");

  const handleReset = () => {
    if (key.length < 6) { return; }
    Alert.alert("Success", "PIN reset instructions sent.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recover PIN</Text>
      <TextInput
        style={styles.input}
        value={key}
        onChangeText={(text) => setKey(text.replace(/[^0-9]/g, ""))}
        maxLength={6}
        placeholder="Enter Recovery Key"
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset PIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 15, borderRadius: 8, marginBottom: 20, color: "#000" },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" }
});