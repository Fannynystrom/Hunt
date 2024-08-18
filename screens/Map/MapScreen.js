import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapComponent() {
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

  const handlePress = (event) => {
    setMarker({
      coordinate: event.nativeEvent.coordinate,
    });
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
