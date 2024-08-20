import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { db, storage } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useUser } from '../context/UserContext';
import DefaultProfileImage from '../../assets/ingenProfilbild.png'; // Anta att du har en standardbild

const PlannedHunts = () => {
  const { user } = useUser();
  const [hunts, setHunts] = useState([]);
  const [participants, setParticipants] = useState({});

  useEffect(() => {
    const fetchHunts = async () => {
      try {
        const huntsRef = collection(db, 'hunts');
        const q = query(huntsRef, where('createdBy', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userHunts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHunts(userHunts);

        const participantsPromises = userHunts.map(async (hunt) => {
          const participantRef = doc(db, 'users', hunt.participantId);
          const participantSnap = await getDoc(participantRef);
          if (participantSnap.exists()) {
            const participantData = participantSnap.data();
            let avatar = participantData.imageUri;
            if (!avatar) {
              try {
                const url = await getDownloadURL(ref(storage, `profilePictures/${hunt.participantId}`));
                avatar = url;
              } catch (error) {
                if (error.code === 'storage/object-not-found') {
                  avatar = Image.resolveAssetSource(DefaultProfileImage).uri;
                }
              }
            }
            return { [hunt.participantId]: { ...participantData, avatar } };
          }
          return null;
        });

        const participantsArray = await Promise.all(participantsPromises);
        const participantsMap = participantsArray.reduce((acc, participant) => {
          if (participant) {
            return { ...acc, ...participant };
          }
          return acc;
        }, {});
        setParticipants(participantsMap);
      } catch (error) {
        console.error('Error fetching planned hunts:', error);
      }
    };

    fetchHunts();
  }, [user.uid]);

  const renderHunt = ({ item }) => {
    const participant = participants[item.participantId];
    return (
      <View style={styles.huntItem}>
        <Image source={{ uri: participant?.avatar || Image.resolveAssetSource(DefaultProfileImage).uri }} style={styles.userAvatar} />
        <Text style={styles.huntTitle}>{participant?.username || 'Unknown User'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {hunts.length > 0 ? (
        <FlatList
          data={hunts}
          renderItem={renderHunt}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noHuntsText}>You have no planned hunts.</Text>
      )}
    </View>
  );
};

export default PlannedHunts;
