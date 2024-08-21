import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../context/UserContext';
import styles from '../screens/Profile/ProfileScreenStyles';

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
        console.log("Active Hunts:", userActiveHunts);  
        setActiveHunts(userActiveHunts);
      } catch (error) {
        console.error('Error fetching active hunts:', error);
      }
    };
  
    fetchActiveHunts();
  }, [user.uid]);


  const renderHunt = ({ item }) => {
    console.log("Rendering Hunt:", item);
    return (
      <Pressable 
        style={[styles.huntItem, { backgroundColor: '#f0f0f0' }]} //bakgrund runt active i profile
        onPress={() => navigation.navigate('ConfirmHunt', { huntId: item.id })}
      >
        <Text style={[styles.huntTitle, { color: 'black' }]}>{item.title}</Text>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: 'black', fontSize: 18, marginBottom: 10 }}>Rendering Active Hunts List</Text>
      <FlatList
        data={activeHunts}
        renderItem={renderHunt}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ color: 'black' }}>You have no active hunts.</Text>}
      />
    </View>
  );
};

export default ActiveHunts;
