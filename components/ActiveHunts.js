import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, Image, Pressable } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../screens/Profile/ProfileScreenStyles'; 
import DefaultProfileImage from '../assets/ingenProfilbild.png';

const ActiveHunts = ({ navigation }) => {
  const { user } = useUser();
  const [activeHunts, setActiveHunts] = useState([]);
  const [creators, setCreators] = useState({});

  const fetchCreators = async (hunts) => {
    const creatorPromises = hunts.map(async (hunt) => {
      const creatorDoc = await getDoc(doc(db, 'users', hunt.createdBy));
      if (creatorDoc.exists()) {
        const creatorData = creatorDoc.data();
        let avatar = creatorData.imageUri;
        if (!avatar) {
          try {
            const url = await getDownloadURL(ref(storage, `profilePictures/${hunt.createdBy}`));
            avatar = url;
          } catch (error) {
            if (error.code === 'storage/object-not-found') {
              avatar = Image.resolveAssetSource(DefaultProfileImage).uri;
            }
          }
        }
        return { [hunt.createdBy]: { username: creatorData.username, avatar } };
      }
      return null;
    });

    const creatorsArray = await Promise.all(creatorPromises);
    const creatorsMap = creatorsArray.reduce((acc, creator) => ({ ...acc, ...creator }), {});
    setCreators(creatorsMap);
  };

  const fetchActiveHunts = useCallback(async () => {
    try {
      const huntsRef = collection(db, 'hunts');
      const activeQuery = query(huntsRef, where('invitedUsers', 'array-contains', user.uid));
      const querySnapshot = await getDocs(activeQuery);
      const userActiveHunts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).filter(hunt => hunt.status !== 'completed'); 
      setActiveHunts(userActiveHunts);
      await fetchCreators(userActiveHunts);
    } catch (error) {
      console.error('Error fetching active hunts:', error);
    }
  }, [user.uid]);

  useFocusEffect(
    useCallback(() => {
      fetchActiveHunts(); 
    }, [fetchActiveHunts])
  );

  const renderHunt = ({ item }) => {
    const creator = creators[item.createdBy];
    return (
      <Pressable 
        style={styles.huntItem}
        onPress={() => navigation.navigate('ConfirmHunt', { 
          huntId: item.id, 
          huntLocations: item.locations,
          huntTitle: item.title,
        })}
      >
        <Image 
          source={{ uri: creator?.avatar || Image.resolveAssetSource(DefaultProfileImage).uri }} 
          style={styles.userAvatar} 
        />
        <Text style={styles.huntTitle}>{item.title || 'Untitled Hunt'}</Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={activeHunts}
      renderItem={renderHunt}
      keyExtractor={item => item.id}
      ListEmptyComponent={<Text style={styles.noHuntsText}>You have no active hunts.</Text>}
    />
  );
};

export default ActiveHunts;
