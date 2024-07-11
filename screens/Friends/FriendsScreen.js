import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';

const FriendsScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // här kommer backend snaaart
    //bara hårdkordat nu
    setUsers([
      { id: '1', name: 'User One', email: 'user1@example.com' },
      { id: '2', name: 'User Two', email: 'user2@example.com' },
      { id: '3', name: 'User Three', email: 'user3@example.com' },
    ]);
  }, []);

  const inviteUser = (userId) => {
    // här kommer kod för att bjuda in vänner till en huuuunt
    console.log(`Invite user with ID: ${userId} to Hunt`);
    // här kommer kod för inbjudan till backend
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <Button title="Invite" onPress={() => inviteUser(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userInfo: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
});

export default FriendsScreen;