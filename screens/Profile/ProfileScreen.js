import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'react-native-image-picker';

const ProfileScreen = () => {
  const [username, setUsername] = useState('Static Username'); 
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log('Fetched user profile:', userData);
            setUsername(userData.username);
            setImageUri(userData.imageUri);
          } else {
            console.log('No such document!');
          }
        } else {
          console.log('No user is logged in');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('User is signed in:', user);
      } else {
        console.log('User is signed out');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('Username updated:', username);
  }, [username]);

  const handleChoosePhoto = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibrary({
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
      const user = auth.currentUser;
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { imageUri: uri }, { merge: true });
      console.log('Saved image URI to Firestore:', uri);
    } catch (error) {
      console.error('Error saving image URI:', error);
    }
  };

  const renderedUsername = useMemo(() => {
    console.log('Rendering ProfileScreen with username:', username);
    return username || 'Static Username';
  }, [username]);

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
      <Text style={styles.username}>{renderedUsername}</Text>
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
