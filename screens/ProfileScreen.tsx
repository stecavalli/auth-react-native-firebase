// screens/ProfileScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Button, ActivityIndicator, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

const ProfileScreen = ({ navigation }: Props) => {
  const [userData, setUserData] = useState({
    username: "",
    nome: "",
    cognome: "",
    photoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Funzione per recuperare i dati dell'utente da Firestore
  const fetchUserData = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        Alert.alert("Errore", "Utente non autenticato.");
        return;
      }

      const doc = await firestore().collection('users').doc(currentUser.uid).get();
      if (doc.exists()) {
        setUserData({
          username: doc.data()?.username ?? "",
          nome: doc.data()?.nome ?? "",
          cognome: doc.data()?.cognome ?? "",
          photoUrl: doc.data()?.photoUrl ?? "",
        });
      }
    } catch (error) {
      console.error("Errore nel recuperare i dati:", error);
      setError("Errore nel recuperare i dati.");
    } finally {
      setLoading(false);
    }
  };

  // Usa useFocusEffect per ricaricare i dati ogni volta che la schermata è in primo piano
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  // Gestione dell'errore se i dati non sono caricati
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Immagine del profilo */}
      <View style={styles.imageContainer}>
        <Image
          source={userData.photoUrl ? { uri: userData.photoUrl } : require("../assets/default-avatar.png")}
          style={styles.profileImage}
        />
      </View>

      {/* Dati del profilo */}
      <Text style={styles.profileText}>Username: {userData.username}</Text>
      <Text style={styles.profileText}>Nome: {userData.nome}</Text>
      <Text style={styles.profileText}>Cognome: {userData.cognome}</Text>

      {/* Pulsante per modificare il profilo */}
      <Button title="Modifica Profilo" onPress={() => navigation.navigate("EditProfile")} />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileImage: { width: 150, height: 150, borderRadius: 75, backgroundColor: "#ccc" },
  imageContainer: { marginBottom: 20 },
  profileText: { fontSize: 18, marginVertical: 10 },
  error: { color: "red", marginTop: 10 },
});

export default ProfileScreen;
