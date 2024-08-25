import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, Pressable, SectionList, Alert } from 'react-native';
import { useUser } from '../../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { auth, storage, db } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import styles from '../Profile/ProfileScreenStyles';
import * as ImagePicker from 'expo-image-picker';
import PlannedHunts from '../../components/PlannedHunts';
import ActiveHunts from '../../components/ActiveHunts';
import Medals from '../../components/Medals';

const ProfileScreen = ({ navigation, route }) => {
    const { user, username, imageUri, isLoading, uploadImageToStorage } = useUser();
    const [localImageUri, setLocalImageUri] = useState(imageUri);
    const [medals, setMedals] = useState([]);
    const huntId = route.params?.huntId;

    const [refresh, setRefresh] = useState(false);

    const handleUpdate = () => {
        navigation.replace('Profile', { refresh: !refresh });
    };

    const fetchMedals = useCallback(async () => {
        if (user) {
            try {
                const medalsRef = collection(db, 'medals');
                const q = query(medalsRef, where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const userMedals = querySnapshot.docs.map(doc => doc.data());
                setMedals(userMedals);
            } catch (error) {
                console.error('Error fetching medals:', error);
            }
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            fetchMedals(); 
        }, [fetchMedals])
    );

    const handleChoosePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const selectedUri = result.assets[0].uri;
            setLocalImageUri(selectedUri);
            await uploadImageToStorage(selectedUri);
        }
    };

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const photoUri = result.assets[0].uri;
            setLocalImageUri(photoUri);
            await uploadImageToStorage(photoUri);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        await auth.signOut();
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (!user) {
        return null;
    }

    const sections = [
        {
            title: '',
            data: [{}],
            renderItem: () => (
                <>
                    <Pressable style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>X</Text>
                    </Pressable>

                    <View style={styles.imageContainer}>
                        {localImageUri ? (
                            <Image source={{ uri: localImageUri || imageUri }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.placeholderImage} />
                        )}
                        <Pressable 
                            role="button" 
                            style={styles.editIcon} 
                            onPress={() => {
                                Alert.alert(
                                    "Select Option",
                                    "Choose an option to update your profile picture",
                                    [
                                        {
                                            text: "Choose from Library",
                                            onPress: handleChoosePhoto
                                        },
                                        {
                                            text: "Take a Photo",
                                            onPress: handleTakePhoto
                                        },
                                        {
                                            text: "Cancel",
                                            style: "cancel"
                                        }
                                    ]
                                );
                            }}
                        >
                            <Text style={styles.editIconText}>✎</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.username}>{username || 'Static Username'}</Text>
                </>
            ),
        },
        { title: 'Planned Hunts', data: [{}], renderItem: () => <PlannedHunts /> },
        { title: 'Active Hunts', data: [{}], renderItem: () => <ActiveHunts navigation={navigation} /> },
        { 
            title: 'Medals', 
            data: [{}], 
            renderItem: () => <Medals medals={medals} />
        },
        {
            title: '',
            data: [{}],
            renderItem: () => (
                <>
                    <Pressable style={styles.createHuntButton} onPress={() => navigation.navigate('CreateHunt')}>
                        <Text style={styles.createHuntButtonText}>Create Hunt</Text>
                    </Pressable>
                </>
            ),
        },
    ];

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item, index) => item + index}
            renderSectionHeader={({ section: { title } }) =>
                title ? <Text style={styles.sectionTitle}>{title}</Text> : null
            }
            contentContainerStyle={styles.container}
        />
    );
};

export default ProfileScreen;
