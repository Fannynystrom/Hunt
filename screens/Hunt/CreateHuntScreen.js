import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CreateHuntScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const handleContinue = () => {
    navigation.navigate('Invite'); 
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

    if (!result.cancelled) {
      setImageUri(result.uri);
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
      
      <Text style={styles.inputLabel}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your hunt"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.imageLabel}>Insert image</Text>
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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
      
    },
    screenTitle: {
      fontSize: 54,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 70,
      color: '#007BFF',

    },
    inputLabel: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2c2c2c',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
    },
    imageLabel: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#007BFF',
      marginBottom: 20,
      textAlign: 'center',
    },
    imageContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 40,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 50,
    },
    imagePlaceholder: {
      fontSize: 36,
      color: '#000',
    },
    continueButton: {
      backgroundColor: '#007BFF',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    continueButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  

export default CreateHuntScreen;
