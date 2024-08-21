import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, SectionList, Alert } from 'react-native';
import { useUser } from '../../context/UserContext';
import { auth } from '../../firebaseConfig';
import styles from '../Profile/ProfileScreenStyles';
import * as ImagePicker from 'expo-image-picker';
import PlannedHunts from '../../components/PlannedHunts';
import ActiveHunts from '../../components/ActiveHunts';

const ProfileScreen = ({ navigation }) => {
  const { user, username, imageUri, isLoading } = useUser();
  const [imageUriState, setImageUriState] = useState(imageUri);

  useEffect(() => {
    if (imageUri) {
      setImageUriState(imageUri);
    }
  }, [imageUri]);

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
      setImageUriState(result.assets[0].uri);
      await uploadImageToStorage(result.assets[0].uri);
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
    return <Text>Loading...</Text>; //kontroll för logout
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
            {imageUriState ? (
              <Image source={{ uri: imageUriState }} style={styles.profileImage} />
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
      title: '',
      data: [{}],
      renderItem: () => (
        <>
          <Pressable style={styles.createHuntButton} onPress={() => navigation.navigate('CreateHunt')}>
            <Text style={styles.createHuntButtonText}>Create Hunt</Text>
          </Pressable>

          <View style={styles.medalsContainer}>
            <Text style={styles.medalsTitle}>MEDALS</Text>
          </View>
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
