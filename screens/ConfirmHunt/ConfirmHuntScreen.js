import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import MapView, { Marker } from 'react-native-maps';

const ConfirmHuntScreen = ({ navigation }) => {
  const route = useRoute();
  const { huntId } = route.params;
  const [hunt, setHunt] = useState(null);

  useEffect(() => {
    const fetchHunt = async () => {
      const docRef = doc(db, 'hunts', huntId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHunt(docSnap.data());
      }
    };

    fetchHunt();
  }, [huntId]);

  if (!hunt) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Confirm Hunt</Text>
      <Text style={styles.subHeader}>You picked:</Text>
      <Text style={styles.huntTitle}>{hunt.title}</Text>
      <Text style={styles.routeHeader}>Here is the route you will be taking:</Text>
      
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: hunt.location.latitude,
          longitude: hunt.location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={hunt.location}
          title={hunt.title}
        />
        {hunt.locations?.map((location, index) => (
          <Marker key={index} coordinate={location} />
        ))}
      </MapView>
      
      <Text style={styles.estimatedTime}>This should take approximately: {hunt.duration}</Text>
      <Pressable style={styles.confirmButton} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.confirmButtonText}>CONFIRM</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  //confirm hunt header
  header: {
    fontSize: 37,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  //"du valde"
  subHeader: {
    fontSize: 17,
    textAlign: 'center',
    marginVertical: 5,
    color: '#6a0dad',
  },
  huntTitle: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  routeHeader: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 10,
    color: '#6a0dad',

  },
  map: {
    width: '100%',
    height: 400,
    marginBottom: 20,
  },
  estimatedTime: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConfirmHuntScreen;
