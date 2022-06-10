import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCwxDol6MzET1-8O1P_wXkR1zpKS3Oxm1U',
  authDomain: 'woodworking-ecommerce.firebaseapp.com',
  projectId: 'woodworking-ecommerce',
  storageBucket: 'woodworking-ecommerce.appspot.com',
  messagingSenderId: '704353120878',
  appId: '1:704353120878:web:232365792eaa769d70ec7f',
  measurementId: 'G-N0LMGF0KGZ'
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
getAnalytics(firebaseApp);

// Auth
export const auth = getAuth();

// Auth - Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

// Auth - Facebook provider
const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({
  display: 'popup'
});
export const signInWithFacebookPopup = () =>
  signInWithPopup(auth, facebookProvider);

// Auth - email and password
export async function createAuthUserWithEmailAndPassword(email, password) {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
}

export const signInWithEmailPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// Firestore
export const firestore = getFirestore();

export async function createUserDocumentFromAuth(
  userAuth,
  additionalInfo = {}
) {
  if (!userAuth) return;

  const userDocRef = doc(firestore, 'users', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  // if user data exists
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInfo
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userDocRef;
}
