import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import styles from './MapScreenStyles';
import { Image } from 'expo-image';

const NavigateMapScreen = ({ route, navigation }) => {
    const { huntLocations, huntTitle } = route.params;
    const [userLocation, setUserLocation] = useState(null);
    const [photoUri, setPhotoUri] = useState(null);
    const [visitedLocations, setVisitedLocations] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        (async () => {
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
        })();
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
            setIsModalVisible(true); // visar bilden efter den tagits
        }
    };

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

                    {/* förhandsvisning av bilden */}
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

