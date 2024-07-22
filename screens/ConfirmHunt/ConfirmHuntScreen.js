import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const ConfirmHuntScreen = ({ route, navigation }) => {
  const { places } = route.params;

  const renderPlaceItem = ({ item }) => (
    <View style={styles.placeItem}>
      <Text style={styles.placeText}>{item}</Text>
    </View>
  );

  const handleConfirm = () => {
    // här kommer bekräfta och starta jakten
    alert('Hunt confirmed!');
    navigation.navigate('Hunt'); // navigera tillbaka till HuntScreen efter att ha bekräftat
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Confirm Hunt</Text>
      <FlatList
        data={places}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPlaceItem}
        style={styles.placeList}
      />
      <Button title="Confirm" onPress={handleConfirm} />
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
  placeList: {
    marginVertical: 16,
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

export default ConfirmHuntScreen;
