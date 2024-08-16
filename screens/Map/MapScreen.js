import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../Map/MapScreenStyles';

const markers = [
  { id: '1', name: 'Marker 1', image: require('../../assets/marker1.png') },
  { id: '2', name: 'Marker 2', image: require('../../assets/marker2.png') },
  { id: '3', name: 'Marker 3', image: require('../../assets/marker3.png') },
];

const MapScreen = ({ navigation }) => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [draggingMarker, setDraggingMarker] = useState(null);

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
    if (draggingMarker) {
      const newLocation = event.nativeEvent.coordinate;
      setSelectedLocations([
        ...selectedLocations,
        { ...draggingMarker, coordinate: newLocation },
      ]);
      setDraggingMarker(null);
    }
  };

  const startDragging = (marker) => {
    setDraggingMarker(marker);
  };

  const handleMarkerDragEnd = (event, markerId) => {
    const newCoordinate = event.nativeEvent.coordinate;
    setSelectedLocations((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === markerId ? { ...marker, coordinate: newCoordinate } : marker
      )
    );
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
      <FlatList
        data={markers}
        horizontal
        renderItem={({ item }) => {
          console.log('Rendering marker:', item);
          return (
            <Pressable onPress={() => startDragging(item)} style={styles.markerOption}>
              <Image source={item.image} style={styles.markerImage} />
              <Text>{item.name}</Text>
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.id}
        style={styles.markerList}
      />
      {currentLocation ? (
        <MapView
          style={styles.map}
          initialRegion={currentLocation}
          onPress={handleMapPress}
          showsUserLocation={true}
        >
          {selectedLocations.map((location) => (
            <Marker
              key={location.id}
              coordinate={location.coordinate}
              draggable // gör markören flyttbar
              onDragEnd={(e) => handleMarkerDragEnd(e, location.id)}
              image={location.image} // använder den specifika markörbilden
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading map...</Text>
      )}
      <Pressable style={styles.createHuntButton} onPress={handleCreateHunt}>
        <Text style={styles.createHuntButtonText}>History Hunt</Text>
      </Pressable>
    </View>
  );
};

export default MapScreen;
