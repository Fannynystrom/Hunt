import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from './MapScreenStyles';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const MapScreen = ({ route, navigation }) => {
  const { selectedUsers, title, description, duration, imageUri } = route.params;

  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]); 

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

  const saveHunt = async () => {
    if (markers.length === 0) {
      alert('Please place at least one marker on the map to select locations.');
      return;
    }

    try {
      const huntsRef = collection(db, 'hunts');
      const newHunt = {
        title,
        description,
        duration,
        imageUri,
        locations: markers.map(marker => ({
          latitude: marker.latitude,
          longitude: marker.longitude,
        })),
        createdBy: auth.currentUser.uid,
        invitedUsers: selectedUsers,
        createdAt: new Date(),
      };
      
      await addDoc(huntsRef, newHunt);
      console.log('Hunt saved successfully!');
      alert('Hunt created successfully!');
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error saving hunt:', error);
    }
  };

  const handlePress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setMarkers((prevMarkers) => [...prevMarkers, coordinate]);
  };

  return (
    <View style={styles.container}>
      {location && (
        <>
          <MapView
            style={styles.map}
            initialRegion={location}
            onPress={handlePress} 
          >
            <Circle
              center={location}
              radius={100}
              strokeColor="rgba(0, 0, 255, 0.5)"
              fillColor="rgba(0, 0, 255, 0.2)"
            />
            {markers.map((marker, index) => (
              <Marker key={index} coordinate={marker} />
            ))}
          </MapView>

          {/* Knappen för att spara jakten */}
          <Pressable style={styles.createHuntButton} onPress={saveHunt}>
            <Text style={styles.createHuntButtonText}>Save Hunt</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default MapScreen;
