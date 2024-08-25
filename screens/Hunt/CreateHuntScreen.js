import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore'; 
import { useUser } from '../../context/UserContext'; 
import { db } from '../../firebaseConfig'; 
import styles from '../Hunt/CreateHuntScreenStyles';

const CreateHuntScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const { user } = useUser(); 

  const handleContinue = async () => {
    // kollar om alla fält är ifyllda annars FYLL I
    if (!title || !duration || !imageUri) {
      alert('Please fill out all fields and choose an image.');
      return;
    }

    try {
      const newHunt = {
        title,
        description,
        duration,
        imageUri,
        createdBy: user.uid, 
        status: 'planned',
        invitedUsers: [], 
      };

      // lägger till i data i firebase
      const huntRef = await addDoc(collection(db, 'hunts'), newHunt);

      // skiiicka till invite 
      navigation.navigate('Invite', { 
        huntId: huntRef.id, 
        title,
        description,
        duration,
        imageUri 
      });

    } catch (error) {
      console.error('Error creating hunt:', error);
      alert('Failed to create hunt. Please try again.');
    }
  };

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // sparar bildens uri
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Create Hunt</Text>
      
      <Text style={styles.inputLabel}>How long should it be?</Text>
      <TextInput
        style={styles.input}
        placeholder="3 hours? 2 days? You pick."
        value={duration}
        onChangeText={setDuration}
      />
      
      <Text style={styles.inputLabel}>What do you want to call your hunt?</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.inputLabel}>Insert image</Text>
      <Pressable style={styles.imageContainer} onPress={handleChoosePhoto}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>+</Text> 
        )}
      </Pressable>
      
      <Pressable style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>CONTINUE</Text>
      </Pressable>
    </View>
  );
};

export default CreateHuntScreen;
