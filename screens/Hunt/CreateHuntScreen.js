import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

const CreateHuntScreen = ({ navigation }) => {
  const [huntName, setHuntName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const handleCreateHunt = async () => {
    try {
      const huntRef = await addDoc(collection(db, 'hunts'), {
        name: huntName,
        description: description,
        duration: duration,
        imageUri: imageUri
      });
      console.log('Hunt created with ID:', huntRef.id);
      navigation.navigate('Invite', { huntId: huntRef.id });
    } catch (error) {
      console.error('Error creating hunt:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Hunt</Text>
      <TextInput
        style={styles.input}
        placeholder="Hunt Name"
        value={huntName}
        onChangeText={setHuntName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Estimated Duration"
        value={duration}
        onChangeText={setDuration}
      />
      <Pressable style={styles.imagePicker} onPress={pickImage}>
        <Text>Pick an Image</Text>
      </Pressable>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Pressable style={styles.createButton} onPress={handleCreateHunt}>
        <Text style={styles.buttonText}>Create Hunt</Text>
      </Pressable>
    </View>
  );
};



export default CreateHuntScreen;