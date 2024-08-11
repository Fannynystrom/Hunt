import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, Image, ScrollView } from 'react-native';
import { db, storage, auth } from '../../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import DefaultProfileImage from '../../assets/ingenProfilbild.png'; 

const InviteScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!auth.currentUser) {
      console.log('User not authenticated');
      navigation.navigate('Login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const userData = { id: doc.id, ...doc.data() };
            try {
              if (userData.imageUri) {
                userData.avatar = userData.imageUri;
              } else {
                const url = await getDownloadURL(ref(storage, `profilePictures/${doc.id}`));
                userData.avatar = url;
              }
            } catch (error) {
              if (error.code === 'storage/object-not-found' || error.code === 'storage/unauthorized') {
                console.warn(`Profile picture for ${doc.id} not found or unauthorized, using default image`);
                userData.avatar = Image.resolveAssetSource(DefaultProfileImage).uri;
              } else {
                console.error(`Error fetching profile picture for user ${doc.id}:`, error);
                userData.avatar = Image.resolveAssetSource(DefaultProfileImage).uri;
              }
            }
            return userData;
          })
        );
        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter(user =>
        user.username && user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prevSelected =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleInvite = async () => {
    try {
      for (let userId of selectedUsers) {
        console.log('Invitation prepared for user:', userId);
      }
      alert('Invitations prepared successfully!');
      setSelectedUsers([]);
      
      // skickar vidare till nästa process, kartan 
      navigation.navigate('MapScreen');
    } catch (error) {
      console.error('Error inviting users:', error);
      alert('Failed to invite users. Please try again.');
    }
  };
  
  const renderUserItem = ({ item }) => {
    const isSelected = selectedUsers.includes(item.id);
    return (
      <Pressable
        style={[styles.userItem, isSelected && styles.selectedUserItem]}
        onPress={() => handleSelectUser(item.id)}
      >
        <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
        <Text style={styles.username}>{item.username}</Text>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </Pressable>
    );
  };
  

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const groupedUsers = alphabet.map(letter => ({
    title: letter,
    data: filteredUsers.filter(user => user.username && user.username[0].toUpperCase() === letter)
  })).filter(group => group.data.length > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Invite Friends</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchQuery}
        onChangeText={handleSearch}
      />
 <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {groupedUsers.map(({ title, data }) => (
        <View key={title} style={styles.letterGroup}>
          <Text style={styles.sectionHeaderText}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            horizontal
          />
        </View>
      ))}
    </ScrollView>
      <Pressable style={styles.inviteButton} onPress={handleInvite}>
        <Text style={styles.inviteButtonText}>INVITE</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  //rubrik
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  //sökrutan för användare
  searchInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  alphabetContainer: {
    flex: 1,
  },
  letterGroup: {
    marginBottom: 16,
  },

  //bokstäverna för alla användare, A,B,C osv
  sectionHeaderText: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007BFF', 

  },

  //conteiner för varje användare
  userItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    width: 110,
    height: 120,
    position: 'relative', 
    backgroundColor: '#D3D3D3',
    borderRadius: 20,

  },

  selectedUserItem: {
    backgroundColor: '#e0f7fa',
    borderRadius: 20,
  },

  //bilden (avatar)
  userAvatar: {
    width: 60,
    height: 65,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginBottom: 5,
    marginTop: 10,
  },
  username: {
    fontSize: 19,
    marginTop: 1,
  },

  //conteiner för check markering för vald användare
  checkmarkContainer: {
    position: 'absolute', 
    top: 1,
    left: 20,
    width: '60%',
    height: '65%',
    backgroundColor: '#007BFF',
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  //själva checkmarkeringen 
  checkmark: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },


  inviteButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InviteScreen;
