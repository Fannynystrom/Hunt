import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
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
            Alert.alert('Photo Taken', 'Photo was successfully taken!');
        }
    };

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

                    {photoUri && (
                        <View style={{ marginTop: 20, alignItems: 'center' }}>
                            <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} />
                            <Text>{'1/3'}</Text> 
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

export default NavigateMapScreen;
