import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PlannedHuntsScreen = () => {
  const [hunts, setHunts] = useState([]);
//hämtar hunts från firebase
  useEffect(() => {
    const fetchHunts = async () => {
      try {
        const huntsRef = collection(db, 'hunts');
        const q = query(huntsRef, where('createdBy', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userHunts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHunts(userHunts);
      } catch (error) {
        console.error('Error fetching planned hunts:', error);
      }
    };

    fetchHunts();
  }, []);
//visar i firebase
  const renderHunt = ({ item }) => (
    <View style={styles.huntItem}>
      <Text style={styles.huntTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>{item.duration}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Planned Hunts</Text>
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



export default PlannedHuntsScreen;
