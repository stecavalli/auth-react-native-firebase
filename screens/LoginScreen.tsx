// screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext"; 
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
  const { setUser } = useUser(); // Usa il contesto per settare l'utente loggato
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // Autenticazione con Firebase
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Recupero dei dati utente da Firestore
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Dati utente:', userData);

        // Salva i dati dell'utente nel contesto (o in uno stato globale)
        setUser(userData);

        // Naviga alla schermata principale dopo il login
        navigation.navigate("Profile"); 
      } else {
        setError("Nessun dato trovato per l'utente.");
      }
    } catch (error: any) {
      console.error('Errore durante il login:', error);
      setError("Credenziali errate o altro errore. Per favore, riprova.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Accedi" onPress={handleLogin} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Non hai un account? Registrati</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 },
  error: { color: "red", marginTop: 8, textAlign: "center" },
  link: {
    color: "blue",
    marginTop: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
