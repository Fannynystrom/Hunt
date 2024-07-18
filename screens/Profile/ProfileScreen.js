import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useUser } from '../../context/UserContext';
import * as ImagePicker from 'react-native-image-picker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const ProfileScreen = () => {
  const { user, username } = useUser();
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (user) {
      //setImageUri(user.photoURL); kommer logiken va sen när man väljer bilder
    }
  }, [user]);

  const handleChoosePhoto = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setImageUri(pickerResult.uri);
      saveImageUriToFirestore(pickerResult.uri);
    }
  };

  const saveImageUriToFirestore = async (uri) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { imageUri: uri }, { merge: true });
    } catch (error) {
      console.error('Error saving image URI:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <Pressable style={styles.editIcon} onPress={handleChoosePhoto}>
          <Text style={styles.editIconText}>✎</Text>
        </Pressable>
      </View>
      <Text style={styles.username}>{username || 'Static Username'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007BFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
