import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from '@env';

// Debug-loggning för att kontrollera att miljövariablerna laddas korrekt
console.log('API Key:', FIREBASE_API_KEY);
console.log('Auth Domain:', FIREBASE_AUTH_DOMAIN);
console.log('Project ID:', FIREBASE_PROJECT_ID);
console.log('Storage Bucket:', FIREBASE_STORAGE_BUCKET);
console.log('Messaging Sender ID:', FIREBASE_MESSAGING_SENDER_ID);
console.log('App ID:', FIREBASE_APP_ID);
console.log('Measurement ID:', FIREBASE_MEASUREMENT_ID);

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
