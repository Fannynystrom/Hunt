import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeScreen from '../screens/HomeScreen';
import HuntScreen from '../screens/HuntScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createMaterialTopTabNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Hunt" component={HuntScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;