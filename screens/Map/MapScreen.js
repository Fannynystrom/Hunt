import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../Map/MapScreenStyles';

const MapScreen = ({ navigation }) => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);


  const handleMapPress = (event) => {
    const newLocation = event.nativeEvent.coordinate;
    setSelectedLocations([...selectedLocations, newLocation]);
  };

  const handleCreateHunt = () => {
    if (selectedLocations.length === 0) {
      alert('Please select at least one location');
      return;
    }

    navigation.navigate('ConfirmHunt', { locations: selectedLocations });
  };

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          style={styles.map}
          initialRegion={currentLocation}
          onPress={handleMapPress}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {selectedLocations.map((location, index) => (
            <Marker key={index} coordinate={location} />
          ))}
        </MapView>
      )}
      <Pressable style={styles.createHuntButton} onPress={handleCreateHunt}>
        <Text style={styles.createHuntButtonText}>History Hunt</Text>
      </Pressable>
    </View>
  );
};

export default MapScreen;
