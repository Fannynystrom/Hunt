import React from 'react';
import { UserProvider } from './context/UserContext';
import AppNavigator from './navigation/Navigation';

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
