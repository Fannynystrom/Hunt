import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import styles from './MapScreenStyles';

const NavigateMapScreen = ({ route, navigation }) => {
  const { huntLocation, huntTitle } = route.params;
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    })();
  }, []);

  const handleTakePhoto = () => {
    Alert.alert('Photo Action', 'This is where you would take a photo!');
  };

  return (
    <View style={styles.container}>
      {userLocation && (
        <>
          <MapView
            style={styles.map}
            initialRegion={userLocation}
            showsUserLocation={true}
          >
            <Marker coordinate={huntLocation} title={huntTitle} />
          </MapView>

          <Pressable style={styles.cameraButton} onPress={handleTakePhoto}>
            <Ionicons name="camera" size={40} color="white" />
          </Pressable>
        </>
      )}
    </View>
  );
};

export default NavigateMapScreen;
