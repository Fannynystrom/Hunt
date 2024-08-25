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
    const { user, username, imageUri, isLoading } = useUser();
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

    const uploadImageToStorage = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storageRef = ref(storage, `profilePictures/${user.uid}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            await saveImageUriToFirestore(downloadURL);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const saveImageUriToFirestore = async (uri) => {
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { imageUri: uri }, { merge: true });
        } catch (error) {
            console.error('Error saving image URI:', error);
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
                            <Image source={{ uri: localImageUri }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.placeholderImage} />
                        )}
                        <Pressable role="button" style={styles.editIcon} onPress={handleChoosePhoto}>
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
