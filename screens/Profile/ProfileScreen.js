import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, FlatList, Alert } from 'react-native';
import { useUser } from '../../context/UserContext';
import * as ImagePicker from 'react-native-image-picker';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../../firebaseConfig';
import styles from '../Profile/ProfileScreenStyles';

const ProfileScreen = ({ navigation }) => {
  const { user, username, imageUri: initialImageUri } = useUser();
  const [imageUri, setImageUri] = useState(initialImageUri);
  const [plannedHunts, setPlannedHunts] = useState([]);
  const [activeHunts, setActiveHunts] = useState([]);

  useEffect(() => {
    if (initialImageUri) {
      setImageUri(initialImageUri);
    }
  }, [initialImageUri]);

  useEffect(() => {
    const fetchPlannedHunts = async () => {
      try {
        const huntsRef = collection(db, 'hunts');
        const plannedQuery = query(huntsRef, where('createdBy', '==', user.uid));
        const querySnapshot = await getDocs(plannedQuery);
        const userPlannedHunts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlannedHunts(userPlannedHunts);
      } catch (error) {
        console.error('Error fetching planned hunts:', error);
      }
    };

    const fetchActiveHunts = async () => {
      try {
        const huntsRef = collection(db, 'hunts');
        const activeQuery = query(huntsRef, where('status', '==', 'active'));
        const querySnapshot = await getDocs(activeQuery);
        const userActiveHunts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActiveHunts(userActiveHunts);
      } catch (error) {
        console.error('Error fetching active hunts:', error);
      }
    };

    fetchPlannedHunts();
    fetchActiveHunts();
  }, [user.uid]);

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

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            await auth.signOut();
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const renderHunt = ({ item }) => (
    <View style={styles.huntItem}>
      <Text style={styles.huntTitle}>{item.title}</Text>
    </View>
  );

  return (
    <FlatList
      data={plannedHunts}
      renderItem={renderHunt}
      keyExtractor={item => item.id}
      ListHeaderComponent={
        <>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>X</Text>
          </Pressable>
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

          {/* rubrikerna Planned Hunts och Active Hunts  */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Planned Hunts</Text>
            <Text style={styles.sectionTitle}>Active Hunts</Text>
          </View>
        </>
      }
      ListFooterComponent={
        <>
          <Pressable style={styles.createHuntButton} onPress={() => navigation.navigate('CreateHunt')}>
            <Text style={styles.createHuntButtonText}>Create Hunt</Text>
          </Pressable>

          <View style={styles.medalsContainer}>
            <Text style={styles.medalsTitle}>MEDALS</Text>
          </View>
        </>
      }
      ListEmptyComponent={<Text style={styles.noHuntsText}>You have no planned hunts.</Text>}
    />
  );
};

export default ProfileScreen;
