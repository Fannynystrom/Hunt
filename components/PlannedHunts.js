import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const PlannedHuntsScreen = () => {
    const [hunts, setHunts] = useState([]);

}
    export default PlannedHuntsScreen;
