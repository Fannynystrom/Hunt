import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [imageUri, setImageUri] = useState(null);

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
            const url = await getDownloadURL(storageRef);
            setImageUri(url);
            await saveImageUriToFirestore(uid, url);
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserProfile(currentUser.uid);
      } else {
        setUser(null);
        setUsername(null);
        setImageUri(null);
      }
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
    <UserContext.Provider value={{ user, username, imageUri }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
