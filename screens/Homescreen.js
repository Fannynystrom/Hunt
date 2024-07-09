
import styles from './HomeScreenStyles'; 
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to GeoCaching App!</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Hunt')}
      >
        <Text style={styles.buttonText}>Start a Hunt</Text>
      </Pressable>
    </View>
  );
}
