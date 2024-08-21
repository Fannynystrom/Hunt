// components/ActiveHunts.js

import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../context/UserContext';
import styles from '../screens/Profile/ProfileScreenStyles';  // Uppdaterad sökväg

const ActiveHunts = ({ navigation }) => {
  const { user } = useUser();
  const [activeHunts, setActiveHunts] = useState([]);

  useEffect(() => {
    const fetchActiveHunts = async () => {
      try {
        const huntsRef = collection(db, 'hunts');
        const activeQuery = query(
          huntsRef,
          where('invitedUsers', 'array-contains', user.uid),
          where('createdBy', '!=', user.uid)
        );
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
  
    fetchActiveHunts();
  }, [user.uid]);
  

  const renderHunt = ({ item }) => {
    return (
      <Pressable 
        style={styles.huntItem}
        onPress={() => navigation.navigate('ConfirmHunt', { huntId: item.id })}
      >
        <Text style={styles.huntTitle}>{item.title}</Text>
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
