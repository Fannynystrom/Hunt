import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import styles from './MapScreenStyles';
import { Image } from 'expo-image';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useUser } from '../../context/UserContext';

const NavigateMapScreen = ({ route, navigation }) => {
    const { huntLocations, huntTitle, huntId, onHuntComplete } = route.params;
    console.log('NavigateMapScreen route.params:', route.params);

    const [userLocation, setUserLocation] = useState(null);
    const [photoUri, setPhotoUri] = useState(null);
    const [visitedLocations, setVisitedLocations] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        const fetchLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        };

        fetchLocation();
    }, []);

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access camera was denied');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
            setVisitedLocations(visitedLocations + 1);
            setIsModalVisible(true);
        }
    };

    const handleCompleteHunt = async () => {
        try {
            if (!huntId) {
                throw new Error('Hunt ID is not defined');
            }

            const huntRef = doc(db, 'hunts', huntId);
            await updateDoc(huntRef, {
                status: 'completed',
            });

            const medalRef = doc(db, 'medals', huntId);
            await setDoc(medalRef, {
                userId: user.uid,
                title: huntTitle,
                imageUri: photoUri,
                completedAt: new Date(),
            });

            if (onHuntComplete) {
                onHuntComplete(); 
            }

            navigation.navigate('Profile', { huntId });
        } catch (error) {
            console.error('Error completing hunt:', error);
            Alert.alert("Error", "An error occurred while completing the hunt. Please try again.");
        }
    };

    useEffect(() => {
        if (visitedLocations === huntLocations.length) {
            Alert.alert(
                "Hunt Complete!",
                "Congratulations! You've completed the hunt.",
                [
                    {
                        text: "OK",
                        onPress: () => handleCompleteHunt(),
                    },
                ]
            );
        }
    }, [visitedLocations]);

    const remainingLocations = huntLocations.length - visitedLocations;

    return (
        <View style={styles.container}>
            {userLocation && (
                <>
                    <MapView
                        style={styles.map}
                        initialRegion={userLocation}
                        showsUserLocation={true}
                    >
                        {huntLocations.map((location, index) => (
                            <Marker key={index} coordinate={location} title={huntTitle} />
                        ))}
                    </MapView>

                    <Pressable style={styles.cameraButton} onPress={handleTakePhoto}>
                        <Ionicons name="camera" size={40} color="white" />
                    </Pressable>

                    <Modal
                        transparent={true}
                        visible={isModalVisible}
                        onRequestClose={() => setIsModalVisible(false)}
                    >
                        <View style={styles.overlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalHeader}>NICE!</Text>
                                {photoUri && (
                                    <Image source={{ uri: photoUri }} style={styles.previewImage} />
                                )}
                                <Text style={styles.taskText}>
                                    You've completed {visitedLocations}/{huntLocations.length} tasks
                                </Text>
                                <Pressable
                                    style={styles.continueButton}
                                    onPress={() => setIsModalVisible(false)}
                                >
                                    <Text style={styles.continueButtonText}>CONTINUE</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </View>
    );
};

export default NavigateMapScreen;
