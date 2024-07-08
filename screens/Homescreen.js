import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Welcome to GeoCaching App!</Text>
      <Button
        title="Start a Hunt"
        onPress={() => navigation.navigate('Hunt')}
      />
    </View>
  );
}
