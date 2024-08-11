import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


const MapScreen = ({ navigation }) => {
 const [selectedLocations, setSelectedLocations] = useState([]);


 const handleMapPress = (event) => {
   const newLocation = event.nativeEvent.coordinate;
   setSelectedLocations([...selectedLocations, newLocation]);
 };


 const handleCreateHunt = () => {
   if (selectedLocations.length === 0) {
     alert('Please select at least one location');
     return;
   }

//skicka vidare till confirm sen FINNS EJ ÄN
   navigation.navigate('ConfirmHunt', { locations: selectedLocations });
 };


 return (
   <View style={styles.container}>
     <MapView
       style={styles.map}
       onPress={handleMapPress}
       initialRegion={{
        latitude: 57.7089, // kordinat för gbg
        longitude: 11.9746, // kordinat för gbg
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      
      
     >
       {selectedLocations.map((location, index) => (
         <Marker key={index} coordinate={location} />
       ))}
     </MapView>
     <Pressable style={styles.createHuntButton} onPress={handleCreateHunt}>
       <Text style={styles.createHuntButtonText}>History Hunt</Text>
     </Pressable>
   </View>
 );

};



   






export default MapScreen;
