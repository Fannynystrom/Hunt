import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

const HuntScreen = () => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('No user is logged in');
          return;
        }

        const querySnapshot = await getDocs(collection(db, 'invitations'));
        const invitationsList = await Promise.all(
          querySnapshot.docs.map(async (invitationDoc) => {
            const data = invitationDoc.data();
            const userDocRef = doc(db, 'users', data.userId);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();
            return {
              id: invitationDoc.id,
              userId: data.userId,
              status: data.status,
              senderUsername: userData ? userData.username : 'N/A',
            };
          })
        );
        setInvitations(invitationsList);
      } catch (error) {
        console.error('Error fetching invitations:', error);
      }
    };

    fetchInvitations();
  }, []);

  const handleAccept = async (invitationId) => {
    try {
      const invitationRef = doc(db, 'invitations', invitationId);
      await updateDoc(invitationRef, { status: 'accepted' });
      setInvitations((prevInvitations) =>
        prevInvitations.map((invitation) =>
          invitation.id === invitationId ? { ...invitation, status: 'accepted' } : invitation
        )
      );
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>Username: {item.senderUsername}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>
      {item.status === 'pending' && (
        <Pressable style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </Pressable>
      )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    padding: 16,
    marginLeft: 300,
    width: 250,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  //conteiner för förfrågningar
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
  },
  acceptButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HuntScreen;
