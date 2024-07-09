import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const InviteScreen = ({ route, navigation }) => {
  const { userId } = route.params;

  const inviteUser = () => {
    //implementera logik för att bjuda in vänner
    console.log(`Invite user with ID: ${userId} to Hunt`);
    // navigera tillbaka efter inbjudan
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Invite User</Text>
      <Text style={styles.info}>Invite user with ID: {userId} to your Hunt.</Text>
      <Button title="Invite" onPress={inviteUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  info: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default InviteScreen;
