// navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import LoginScreen from '../screens/Login/LoginScreen';
import SignupScreen from '../screens/Signup/SignupScreen';
import HuntScreen from '../screens/Hunt/HuntScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import FriendsScreen from '../screens/Friends/FriendsScreen';
import InviteScreen from '../screens/Invite/InviteScreen';
import AddPlacesScreen from '../screens/AddPlaces/AddPlacesScreen';
import ConfirmHuntScreen from '../screens/ConfirmHunt/ConfirmHuntScreen';
import CreateHuntScreen from '../screens/Hunt/CreateHuntScreen';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Profile">
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Hunt" component={HuntScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Invite" component={InviteScreen} options={{ title: 'Invite' }} />
        <Stack.Screen name="AddPlaces" component={AddPlacesScreen} options={{ title: 'Add Places' }} />
        <Stack.Screen name="ConfirmHunt" component={ConfirmHuntScreen} options={{ title: 'Confirm Hunt' }} />
        <Stack.Screen name="CreateHunt" component={CreateHuntScreen} options={{ title: 'Create Hunt' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
