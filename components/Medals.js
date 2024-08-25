import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../screens/Profile/ProfileScreenStyles';

const Medals = () => {
  const { user } = useUser();
  const [medals, setMedals] = useState([]);

  const fetchMedals = useCallback(async () => {
    if (user) {
      try {
        const medalsRef = collection(db, 'medals');
        const q = query(medalsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedMedals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMedals(fetchedMedals);
      } catch (error) {
        console.error('Error fetching medals:', error);
      }
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchMedals();
    }, [fetchMedals]) 
  );

  const renderMedal = ({ item }) => (
    <View style={styles.medalItem}>
      <Image source={{ uri: item.imageUri }} style={styles.medalImage} />
      <Text style={styles.medalTitle}>{item.title || 'Untitled Hunt'}</Text>
    </View>
  );

  return (
    <FlatList
      data={medals}
      renderItem={renderMedal}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.noMedalsText}>You have no medals yet.</Text>}
      numColumns={3}  // Kolumner per rad
      columnWrapperStyle={styles.medalColumnWrapper} 
    />
  );
};

export default Medals;
