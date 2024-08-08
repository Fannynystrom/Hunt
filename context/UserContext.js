import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
                setImageUri(null); 
              } else {
                throw error;
              }
            }
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserProfile(currentUser.uid);
      } else {
        setUser(null);
        setUsername(null);
        setImageUri(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveImageUriToFirestore = async (uid, uri) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { imageUri: uri }, { merge: true });
    } catch (error) {
      console.error('Error saving image URI:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, username, imageUri, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
