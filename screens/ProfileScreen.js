import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import styles from './ProfileScreenStyles';


const ProfileScreen = () => {
  const user = {
    name: 'Fanny Nyström',
    email: 'Fanny.Nyström@example.com',
    avatar: 'https://placekitten.com/200/200', // bilden
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>
  );
};

export default ProfileScreen;
