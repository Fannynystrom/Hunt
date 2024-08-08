import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../../context/UserContext';
import * as ImagePicker from 'react-native-image-picker';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfileScreen = ({ navigation }) => {
  const { user, username, imageUri: initialImageUri } = useUser();
  const [imageUri, setImageUri] = useState(initialImageUri);

  useEffect(() => {
    if (initialImageUri) {
      setImageUri(initialImageUri);
    }
  }, [initialImageUri]);

  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) return;

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await uploadImageToStorage(uri);
    }
  };

  const uploadImageToStorage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      await saveImageUriToFirestore(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const saveImageUriToFirestore = async (uri) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { imageUri: uri }, { merge: true });
    } catch (error) {
      console.error('Error saving image URI:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <Pressable role="button" style={styles.editIcon} onPress={handleChoosePhoto}>
          <Text style={styles.editIconText}>✎</Text>
        </Pressable>
      </View>

      <Text style={styles.username}>{username || 'Static Username'}</Text>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Hunts</Text>
        <Text style={styles.sectionTitle}>Planned Hunts</Text>
      </View>

      <Pressable style={styles.createHuntButton} onPress={() => navigation.navigate('CreateHunt')}>
        <Text style={styles.createHuntButtonText}>Create Hunt</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
    // Container för profilbild och redigeringsikon
  imageContainer: {
    position: 'relative',
    marginBottom: 20,

  },
    // profilbilden
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 4, 
    borderColor: '007BFF#', 
  },
    //  platshållarbilden (visas om ingen bild finns)
  placeholderImage: {
    width: 250,
    height: 250,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: '#007BFF', 
  },
    // container för redigeringsikon
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007BFF',
    borderRadius: 40,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: '#fff', 
  },
    // pennan i redigeringsikon
  editIconText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 34,
    fontWeight: 'bold',
  },

//container för createhunt knappen
  createHuntButton: {
    backgroundColor: '#007BFF',
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 60,
    alignSelf: 'flex-start',
  },
  //texten i knappen createhunt
  createHuntButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default ProfileScreen;