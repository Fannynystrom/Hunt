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


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    //absoluteFillObject för att den alltid ska ta upp hela skärmen oavsett om du flyttar kartan
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    //knappen placeras imitten oavsett om du rör kartan
    createHuntButton: {
      position: 'absolute',
      bottom: 30,
      backgroundColor: '#007BFF',
      borderRadius: 50,
      paddingVertical: 15,
      paddingHorizontal: 30,
    },
    createHuntButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
   });
   
   






export default MapScreen;
