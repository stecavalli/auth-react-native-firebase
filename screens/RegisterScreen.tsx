// screens/RegisterScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen = ({ navigation }: Props) => {
  const [formData, setFormData] = useState({ email: "", password: "", username: "", nome: "", cognome: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Gestisce il cambiamento dei dati nel form
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Funzione di registrazione
  const handleRegister = async () => {
    const { email, password, username, nome, cognome } = formData;

    try {
      // Verifica che tutti i campi siano compilati
      if (!email || !password || !username || !nome || !cognome) {
        setError("Tutti i campi sono obbligatori");
        return;
      }

      // Creazione dell'utente tramite Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Aggiunta dei dati utente nel Firestore
      await firestore().collection('users').doc(user.uid).set({
        username: username,
        nome: nome,
        cognome: cognome,
        email: email,
        photoUrl: '',  // Puoi iniziare con un URL vuoto, da aggiornare in seguito
      });

      console.log('Utente registrato e dati salvati nel Firestore');
      setMessage("Registrazione riuscita!");
      // Naviga alla schermata di login o profilo
      navigation.navigate("Login");

    } catch (error: any) {
      console.error('Errore durante la registrazione:', error);
      setError(error.message); // Mostra il messaggio di errore
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrazione</Text>

      <TextInput
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Nome"
        value={formData.nome}
        onChangeText={(text) => handleChange("nome", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Cognome"
        value={formData.cognome}
        onChangeText={(text) => handleChange("cognome", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        style={styles.input}
        secureTextEntry
      />

      <Button title="Registrati" onPress={handleRegister} />
      
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text onPress={() => navigation.navigate("Login")} style={styles.link}>
        Hai già un account? Login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  message: { marginTop: 10, color: "green" },
  error: { marginTop: 10, color: "red" },
  link: { color: "#007bff", marginTop: 15, textAlign: "center" },
});

export default RegisterScreen;
