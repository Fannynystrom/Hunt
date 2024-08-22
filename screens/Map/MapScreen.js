import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from './MapScreenStyles';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const MapScreen = ({ route, navigation }) => {
  const { selectedUsers, title, description, duration, imageUri, huntLocation } = route.params;

  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: huntLocation.latitude,
              longitude: huntLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Circle
              center={location}
              radius={100}
              strokeColor="rgba(0, 0, 255, 0.5)"
              fillColor="rgba(0, 0, 255, 0.2)"
            />
            <Marker coordinate={huntLocation} />
          </MapView>

          <Pressable style={styles.createHuntButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.createHuntButtonText}>Return to Profile</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default MapScreen;
