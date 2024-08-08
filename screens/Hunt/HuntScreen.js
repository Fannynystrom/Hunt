import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';

const HuntScreen = ({ navigation }) => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'invitations'));
        const invitationsList = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
          const userDocRef = doc(db, 'users', docSnap.data().userId);
          const userDocSnap = await getDoc(userDocRef);
          return { id: docSnap.id, ...docSnap.data(), username: userDocSnap.data()?.username || 'N/A' };
        }));
        setInvitations(invitationsList);
      } catch (error) {
        console.error('Error fetching invitations:', error);
      }
    };

    fetchInvitations();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>Username: {item.username}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Active Hunts</Text>
      <FlatList
        data={invitations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <Pressable style={styles.newHuntButton} onPress={() => navigation.navigate('Invite')}>
        <Text style={styles.newHuntButtonText}>Start New Hunt</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
  },
  newHuntButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  newHuntButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  
});

export default HuntScreen;
