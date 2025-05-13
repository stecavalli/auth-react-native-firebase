// screens/EditProfileScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { launchImageLibrary } from "react-native-image-picker";

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const currentUser = auth().currentUser;

  const [username, setUsername] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    if (!currentUser) return;

    try {
      const doc = await firestore().collection('users').doc(currentUser.uid).get();
      if (doc.exists()) {
        const data = doc.data();
        setUsername(data?.username || "");
        setNome(data?.nome || "");
        setCognome(data?.cognome || "");
        setPhotoUrl(data?.photoUrl || "");
      }
    } catch (e) {
      console.error("Errore nel recuperare i dati:", e);
      setError("Errore nel recuperare i dati.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const handleChoosePhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0) {
        setPhotoUrl(result.assets[0].uri || "");
      }
    } catch (e) {
      console.error('Errore selezione immagine:', e);
      setError("Errore nella selezione dell'immagine.");
    }
  };

  const handleSave = async () => {
  if (!currentUser) {
    setError("Utente non autenticato.");
    return;
  }

  try {
    setUploading(true);

    let uploadedPhotoUrl = photoUrl;

    if (photoUrl && !photoUrl.startsWith('https://')) {
      const filename = `profileImages/${currentUser.uid}/${currentUser.uid}.jpg`;
      const reference = storage().ref(filename);

      await reference.putFile(photoUrl);
      uploadedPhotoUrl = await reference.getDownloadURL();
    }

    const updatedData = {
      username,
      nome,
      cognome,
      photoUrl: uploadedPhotoUrl,
    };

    await firestore().collection('users').doc(currentUser.uid).update(updatedData);

    navigation.goBack();
  } catch (e) {
    console.error('Errore durante il salvataggio:', e);
    setError("Errore durante il salvataggio. Riprova.");
  } finally {
    setUploading(false);
  }
};


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifica Profilo</Text>

      <TouchableOpacity onPress={handleChoosePhoto}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={{ color: '#aaa' }}>Aggiungi foto</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <TextInput
        placeholder="Cognome"
        value={cognome}
        onChangeText={setCognome}
        style={styles.input}
      />

      {uploading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button title="Salva" onPress={handleSave} />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 16, textAlign: "center" },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 16,
  },
  avatarPlaceholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  error: { color: "red", marginTop: 8, textAlign: "center" },
});
