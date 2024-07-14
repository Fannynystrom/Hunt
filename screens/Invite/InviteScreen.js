import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SectionList, Pressable, StyleSheet } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const InviteScreen = ({ route, navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
        user.username.toLowerCase().includes(query.toLowerCase())
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
      console.log(`Inviting users: ${selectedUsers}`);
      navigation.goBack();
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
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>{item.username[0]}</Text>
        </View>
        <Text style={styles.username}>{item.username}</Text>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>
    );
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const groupedUsers = alphabet.map(letter => ({
    title: letter,
    data: filteredUsers.filter(user => user.username[0].toUpperCase() === letter)
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
      <View style={styles.listContainer}>
        <SectionList
          sections={groupedUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
        />
        <View style={styles.alphabetContainer}>
          {groupedUsers.map(({ title }) => (
            <Pressable key={title}>
              <Text style={styles.alphabetLetter}>{title}</Text>
            </Pressable>
          ))}
        </View>
      </View>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  userItem: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedUserItem: {
    backgroundColor: '#e0f7fa',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  selectedUserAvatar: {
    backgroundColor: '#4CAF50',
  },
  userInitial: {
    color: '#fff',
    fontSize: 18,
  },
  username: {
    fontSize: 14,
  },
  checkmark: {
    color: 'green',
    fontSize: 18,
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
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alphabetContainer: {
    marginLeft: 10,
    alignItems: 'center',
  },
  alphabetLetter: {
    fontSize: 16,
    color: '#007BFF',
    paddingVertical: 2,
  },
});

export default InviteScreen;
