import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const AddPlacesScreen = ({ navigation }) => {
  const [place, setPlace] = useState('');
  const [places, setPlaces] = useState([]);

  const addPlace = () => {
    if (place.trim()) {
      setPlaces([...places, place]);
      setPlace('');
    }
  };

  const renderPlaceItem = ({ item }) => (
    <View style={styles.placeItem}>
      <Text style={styles.placeText}>{item}</Text>
    </View>
  );

  const handleCreateHunt = () => {
    // navigera till Confirm Hunt skärmen och skicka med platserna
    navigation.navigate('ConfirmHunt', { places });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Places</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter place"
        value={place}
        onChangeText={setPlace}
      />
      <Button title="Add Place" onPress={addPlace} />
      <FlatList
        data={places}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPlaceItem}
        style={styles.placeList}
      />
      <Button title="History Hunt" onPress={handleCreateHunt} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  placeList: {
    flex: 1,
    marginTop: 16,
  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  placeText: {
    fontSize: 16,
  },
});

export default AddPlacesScreen;
