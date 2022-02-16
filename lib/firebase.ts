import { initializeApp, getApps, getApp } from 'firebase/app'

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { 
  getFirestore, 
  collection, 
  where, 
  getDocs, 
  query, 
  limit, 
  QueryDocumentSnapshot 
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  TwitterAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-qeSWwnjZlWbJhk5GeG3h_kxgnsFfKNw",
  authDomain: "e-commercetemplate-852c6.firebaseapp.com",
  projectId: "e-commercetemplate-852c6",
  storageBucket: "e-commercetemplate-852c6.appspot.com",
  messagingSenderId: "463514598215",
  appId: "1:463514598215:web:6b17c256dfbf9f66e4aa62",
  measurementId: "G-E3536958N0"
};

// Initialize Firebase
// let firebaseApp;
// let firestore;
// if (!getApps.length){
//     initializeApp(firebaseConfig)
//     firestore = getFirestore();
// }

function createFirebaseApp(config){
  try {
    return getApp()
  } catch {
    return initializeApp(config)
  }
}

const firebaseApp = createFirebaseApp(firebaseConfig);

// Auth Exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
export const twitterAuthProvider = new TwitterAuthProvider();
// export const githubAuthProvider = new GithubAuthProvider();

// Firestore Exports
export const firestore = getFirestore();

// Storage Exports
export const storage = getStorage();
export const STATE_CHANGED = 'state_changed'

// Analytics Exports
// export const analytics = isSupported() ? getAnalytics() : null;

/// Helper Functions
/**
 * Gets a users/{uid} document with username
 * @param {string} username 
 * @returns {Object}
 */
export async function getUserWithUsername(username){
  const q = query(
    collection(firestore, 'users'), 
    where('username', '==', username),
    limit(1)
  )
  const userDoc:QueryDocumentSnapshot = ( await getDocs(q) ).docs[0]
  return userDoc
}

/**
 * 
 * @param doc - firestore document
 * @returns 
 */
export function postToJSON(doc){
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt?.toMillis() || 0,
    updatedAt: data?.updatedAt?.toMillis() || 0,
  }
}