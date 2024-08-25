import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../screens/Profile/ProfileScreenStyles'; 
import DefaultProfileImage from '../assets/ingenProfilbild.png';

const PlannedHunts = () => {
  const { user } = useUser();
  const [plannedHunts, setPlannedHunts] = useState([]);
  const [participants, setParticipants] = useState({});

  const fetchPlannedHunts = useCallback(async () => {
    if (!user) return; 

    try {
      const huntsRef = collection(db, 'hunts');
      const plannedQuery = query(huntsRef, where('createdBy', '==', user.uid));
      const querySnapshot = await getDocs(plannedQuery);
      const userPlannedHunts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).filter(hunt => hunt.status !== 'completed'); 

      setPlannedHunts(userPlannedHunts);
      await fetchParticipants(userPlannedHunts);
    } catch (error) {
      console.error('Error fetching planned hunts:', error);
    }
  }, [user]);

  const fetchParticipants = useCallback(async (hunts) => {
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
  }, []); 
  useFocusEffect(
    useCallback(() => {
      fetchPlannedHunts(); 
    }, [fetchPlannedHunts]) 
  );

  const renderHunt = ({ item }) => {
    return (
      <View style={styles.huntItem}>
        {item.invitedUsers && item.invitedUsers.map((userId) => {
          const participant = participants[userId];
          return (
            <View key={userId} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <Image 
                source={{ uri: participant?.avatar || Image.resolveAssetSource(DefaultProfileImage).uri }} 
                style={styles.userAvatar} 
              />
              <Text style={styles.huntTitle}>{item.title || 'Untitled Hunt'}</Text>
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
      ListEmptyComponent={<Text style={styles.noHuntsText}>You have no planned hunts.</Text>}
    />
  );
};

export default PlannedHunts;