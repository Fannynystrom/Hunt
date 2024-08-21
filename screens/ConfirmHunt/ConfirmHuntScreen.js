import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';

const ConfirmHunt = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { title, locations, duration } = route.params;

  const handleConfirm = () => {
    console.log('Hunt confirmed!');
    navigation.navigate('Profile'); 
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Confirm Hunt</Text>
        <Text style={styles.subHeaderText}>You picked:</Text>
        <Text style={styles.titleText}>{title}</Text>

        <MapView 
          style={styles.map}
          initialRegion={{
            latitude: locations[0]?.latitude || 37.4219999,
            longitude: locations[0]?.longitude || -122.0840575,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {locations.map((location, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={`Location ${index + 1}`}
            />
          ))}
          <Polyline 
            coordinates={locations.map(location => ({
              latitude: location.latitude,
              longitude: location.longitude
            }))}
            strokeColor="#007BFF" 
            strokeWidth={3} 
          />
        </MapView>

        <Text style={styles.durationText}>
          This should take approximately: {duration}
        </Text>

        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>CONFIRM</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//   },
//   scrollContainer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   headerText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subHeaderText: {
//     fontSize: 16,
//     color: '#888',
//     marginBottom: 5,
//   },
//   titleText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   map: {
//     width: '100%',
//     height: 300,
//     marginBottom: 20,
//   },
//   durationText: {
//     fontSize: 16,
//     color: '#888',
//     marginBottom: 20,
//   },
//   confirmButton: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 5,
//   },
//   confirmButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

export default ConfirmHunt;
