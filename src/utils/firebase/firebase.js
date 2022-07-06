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
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  sendEmailVerification
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { productConverter } from '../../classes/Product';
import { ratingConverter } from '../../classes/Rating';
import { getFirebaseTimestampFromDate } from '../../exports/functions';
import { cartProductConverter } from '../../classes/CartProduct';

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

export const signOutUser = async () => {
  await signOut(auth);
};

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// Auth - profile
export const updateUserProfile = (additionalInfo) =>
  updateProfile(auth.currentUser, additionalInfo);

export const sendResetPasswordEmail = (email) =>
  sendPasswordResetEmail(auth, email);

export const sendUserVerificationEmail = () =>
  sendEmailVerification(auth.currentUser);

export const updateUserEmail = (email) => updateEmail(auth.currentUser, email);

// Firestore
export const firestore = getFirestore();

// Adds user to database if not already there
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

// Returns the products from the database
export async function getProducts() {
  const products = [];
  const ref = collection(firestore, 'products').withConverter(productConverter);
  const querySnapshot = await getDocs(ref);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    products.push(data);
  });
  return products;
}

// Returns the items in the user's cart
export async function getCartProducts(userId) {
  const cartProducts = [];

  const cartRef = collection(firestore, 'users', userId, 'cart').withConverter(
    cartProductConverter
  );
  const cartSnapshot = await getDocs(cartRef);
  cartSnapshot.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    cartProducts.push(data);
  });
  return cartProducts;
}

// Returns the ratings from the database
export async function getRatings() {
  const ratings = [];

  const ref = collection(firestore, 'ratings').withConverter(ratingConverter);
  const querySnapshot = await getDocs(ref);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    ratings.push(data);
  });
  return ratings;
}

// Adds a product to the user's cart
export async function addProductToCart(
  color,
  notes,
  product,
  quantity,
  userId
) {
  const cartRef = collection(firestore, 'users', userId, 'cart');

  const q = query(cartRef, where('product', '==', product));
  const querySnapshot = await getDocs(q);

  // If the cart item already exists
  if (!querySnapshot.empty) return { added: false, error: 'already-exists' };

  return await addDoc(cartRef, {
    color,
    notes,
    product,
    quantity
  })
    .then((res) => {
      return { added: true, error: '' };
    })
    .catch((err) => {
      return { added: false, error: err.code };
    });
}

// Adds user to database if not already there
export async function addUserRating(rating, userId, productId) {
  if (!rating || !userId || !productId) return;

  const ratingsRef = collection(firestore, 'ratings');
  const q = query(
    ratingsRef,
    where('user', '==', userId),
    where('product', '==', productId)
  );
  const querySnapshot = await getDocs(q);

  // If rating doesn't exist for the user for this specific product
  if (querySnapshot.empty) {
    const createdAt = getFirebaseTimestampFromDate(new Date());

    try {
      const doc = await addDoc(ratingsRef, {
        rating,
        user: userId,
        product: productId,
        submitted: createdAt
      });
      return doc.id;
    } catch (err) {
      return null;
    }
  } else {
    return null;
  }
}

export async function editUserRating(rating, ratingId, userId, productId) {
  if (!rating || !ratingId || !userId || !productId) return;

  const ratingRef = doc(firestore, 'ratings', ratingId);

  // If rating exists for user for given product
  if (!ratingRef.empty) {
    const createdAt = getFirebaseTimestampFromDate(new Date());

    try {
      return await updateDoc(ratingRef, {
        rating,
        submitted: createdAt
      })
        .then((res) => true)
        .catch((err) => null);
    } catch (err) {
      console.log(err);
      return null;
    }
  } else {
    return null;
  }
}
