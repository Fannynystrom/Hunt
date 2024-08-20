import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, FlatList, Alert } from 'react-native';
import { useUser } from '../../context/UserContext';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import { auth } from '../../firebaseConfig';
import styles from '../Profile/ProfileScreenStyles';
import * as ImagePicker from 'expo-image-picker';
import DefaultProfileImage from '../../assets/ingenProfilbild.png'; 

const ProfileScreen = ({ navigation }) => {
  const { user, username, imageUri: initialImageUri } = useUser();
  const [imageUri, setImageUri] = useState(initialImageUri);
  const [plannedHunts, setPlannedHunts] = useState([]);
  const [activeHunts, setActiveHunts] = useState([]);
  const [participants, setParticipants] = useState({});

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
        await fetchParticipants(userPlannedHunts); // hämta info från den inbjudna
      } catch (error) {
        console.error('Error fetching planned hunts:', error);
      }
    };
  
    const fetchParticipants = async (hunts) => {
      const participantPromises = hunts.flatMap(hunt => 
        hunt.invitedUsers.map(async (userId) => {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            let avatar = userData.imageUri;
            if (!avatar) {
              try {
                const url = await getDownloadURL(ref(storage, `profilePictures/${userId}`));
                avatar = url;
              } catch (error) {
                if (error.code === 'storage/object-not-found') {
                  avatar = Image.resolveAssetSource(DefaultProfileImage).uri;
                }
              }
            }
            return { [userId]: { username: userData.username, avatar } };
          }
          return null;
        })
      );
  
      const participantsArray = await Promise.all(participantPromises);
      const participantsMap = participantsArray.reduce((acc, participant) => ({ ...acc, ...participant }), {});
      setParticipants(participantsMap);
    };
  
    fetchPlannedHunts();
  }, [user.uid]);
  
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


  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await uploadImageToStorage(result.assets[0].uri);
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

 const fetchParticipants = async () => {
  const participantPromises = plannedHunts.map(async (hunt) => {
    const participantIds = hunt.participants || [];
    const participantDataArray = await Promise.all(
      participantIds.map(async (participantId) => {
        const participantRef = doc(db, 'users', participantId);
        const participantSnap = await getDoc(participantRef);
        if (participantSnap.exists()) {
          const participantData = participantSnap.data();
          let avatar = participantData.imageUri;
          if (!avatar) {
            try {
              const url = await getDownloadURL(ref(storage, `profilePictures/${participantId}`));
              avatar = url;
            } catch (error) {
              if (error.code === 'storage/object-not-found') {
                avatar = Image.resolveAssetSource(DefaultProfileImage).uri;
              }
            }
          }
          return { [participantId]: { ...participantData, avatar } };
        }
        return null;
      })
    );

    return participantDataArray.reduce((acc, participant) => {
      if (participant) {
        return { ...acc, ...participant };
      }
      return acc;
    }, {});
  });

  const participantsMapArray = await Promise.all(participantPromises);
  const participantsMap = participantsMapArray.reduce((acc, map) => ({ ...acc, ...map }), {});
  setParticipants(participantsMap);
};

const renderHunt = ({ item }) => {
  return (
    <View style={styles.huntItem}>
      {item.invitedUsers && item.invitedUsers.map(userId => {
        const participant = participants[userId];
        return (
          <View key={userId} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
            <Image 
              source={{ uri: participant?.avatar || Image.resolveAssetSource(DefaultProfileImage).uri }} 
              style={styles.userAvatar} 
            />
            <Text style={styles.huntTitle}>{participant?.username || 'Unknown User'}</Text>
          </View>
        );
      })}
    </View>
  );
};



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
