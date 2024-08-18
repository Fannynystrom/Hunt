import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from './MapScreenStyles';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const MapScreen = ({ route, navigation }) => {
  const { selectedUsers, title, description, duration, imageUri } = route.params;

  const [location, setLocation] = useState(null);
  const [marker, setMarker] = useState(null);

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

  const saveHunt = async (latitude, longitude) => {
    try {
      const huntsRef = collection(db, 'hunts');
      const newHunt = {
        title,
        description,
        duration,
        imageUri,
        location: {
          latitude,
          longitude,
        },
        createdBy: auth.currentUser.uid,
        invitedUsers: selectedUsers,
        createdAt: new Date(),
      };
      
      await addDoc(huntsRef, newHunt);
      console.log('Hunt saved successfully!');
      alert('Hunt created successfully!');
      navigation.goBack(); // tills ja skapat nästa sida
    } catch (error) {
      console.error('Error saving hunt:', error);
    }
  };

  const handlePress = async (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setMarker({ coordinate });

    // sparar i firebase Hunt
    await saveHunt(coordinate.latitude, coordinate.longitude);
  };

  return (
    <View style={styles.container}>
      {location && (
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
          {marker && (
            <Marker coordinate={marker.coordinate} />
          )}
        </MapView>
      )}
    </View>
  );
};

export default MapScreen;
