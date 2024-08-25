import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const defaultProfileImageUri = 'url_to_default_image';

  useEffect(() => {
    const fetchUserProfile = async (uid) => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setUsername(userData.username);
                if (userData.imageUri) {
                    setImageUri(userData.imageUri);
                } else {
                    const storageRef = ref(storage, `profilePictures/${uid}`);
                    try {
                        const url = await getDownloadURL(storageRef);
                        setImageUri(url);
                        await saveImageUriToFirestore(uid, url);
                    } catch (error) {
                        if (error.code === 'storage/object-not-found') {
                            console.warn('Profile picture not found, using default image instead');
                            setImageUri(defaultProfileImageUri);
                        } else {
                            throw error;
                        }
                    }
                }
            } else {
                console.log('No such document!');
                setImageUri(defaultProfileImageUri); 
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setImageUri(defaultProfileImageUri); 
        }
    };

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            await fetchUserProfile(currentUser.uid);
        } else {
            setUser(null);
            setUsername(null);
            setImageUri(defaultProfileImageUri);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
}, []);


  const uploadImageToStorage = async (uri) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        await saveImageUriToFirestore(user.uid, downloadURL);
        setImageUri(downloadURL); // Uppdatera lokal state
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};

const saveImageUriToFirestore = async (uid, uri) => {
    try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, { imageUri: uri }, { merge: true });
        console.log('Image URI saved to Firestore:', uri); 
    } catch (error) {
        console.error('Error saving image URI:', error);
    }
};

  return (
    <UserContext.Provider value={{ user, username, imageUri, isLoading, uploadImageToStorage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
