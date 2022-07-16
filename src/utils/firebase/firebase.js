// Firebase
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
  updateDoc,
  deleteDoc,
  writeBatch,
  arrayUnion
} from 'firebase/firestore';

// Classes
import { productConverter } from '../../classes/Product';
import { ratingConverter } from '../../classes/Rating';
import { cartProductConverter } from '../../classes/CartProduct';
import { promoCodeConverter } from '../../classes/PromoCode';
import { orderConverter } from '../../classes/Order';

// Exports
import { getFirebaseTimestampFromDate } from '../../exports/functions';

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

// Sign in with an email and password
export const signInWithEmailPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Sign out user
export const signOutUser = async () => {
  await signOut(auth);
};

// Listen to changes in authentication
export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// Auth - profile
// Update a user's profile with given options
export const updateUserProfile = (additionalInfo) =>
  updateProfile(auth.currentUser, additionalInfo);

// Send a reset password email
export const sendResetPasswordEmail = (email) =>
  sendPasswordResetEmail(auth, email);

// Send a verification email to the user to verify their email
export const sendUserVerificationEmail = () =>
  sendEmailVerification(auth.currentUser);

// Update the user's email with a new one
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
      return { type: 'set' };
    } catch (error) {
      return { error };
    }
  }

  const userData = await getDoc(userDocRef);
  return { type: 'get', data: userData.data() };
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
  const q = query(cartRef, where('purchased', '==', false));
  const cartSnapshot = await getDocs(q);
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

// Returns the promo code that matches the given code
export async function getPromoCode(code, userId) {
  if (!code || !userId) return;

  const promoRef = collection(firestore, 'promo_codes').withConverter(
    promoCodeConverter
  );
  const q = query(promoRef, where('code', '==', code));
  const querySnapshot = await getDocs(q);

  // If the promo code doesn't exist
  if (querySnapshot.empty) return { error: 'invalid' };

  // If the promo code expired
  const promoCode = querySnapshot.docs[0].data();
  if (promoCode.expired()) return { error: 'expired' };

  // If the promo code has already been used on a previous order
  if (promoCode.users && promoCode.users.includes(userId))
    return { error: 'used' };

  promoCode.id = querySnapshot.docs[0].id;
  return promoCode;
}

// Returns the promo code by the given ID
export async function getPromoCodeById(promoCodeId) {
  if (!promoCodeId) return;

  const promoRef = doc(firestore, 'promo_codes', promoCodeId).withConverter(
    promoCodeConverter
  );
  const promoSnapshot = await getDoc(promoRef);

  if (promoSnapshot.exists()) {
    const promoCode = promoSnapshot.data();
    return promoCode.expired() ? { error: 'expired' } : promoCode;
  }

  return { error: 'doesnt-exist' };
}

// Returns the orders for a user
export async function getOrders(userId) {
  const orders = [];

  const ordersRef = collection(
    firestore,
    'users',
    userId,
    'orders'
  ).withConverter(orderConverter);
  const ordersSnapshot = await getDocs(ordersRef);
  ordersSnapshot.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    orders.push(data);
  });
  return orders;
}

// Adds a product to the user's cart
export async function addProductToCart(
  color,
  notes,
  product,
  quantity,
  userId
) {
  if (!color || !product || !quantity || !userId) return;

  const cartRef = collection(firestore, 'users', userId, 'cart');

  const q = query(cartRef, where('product', '==', product));
  const querySnapshot = await getDocs(q);

  // If the cart item already exists
  if (!querySnapshot.empty) return { added: false, error: 'already-exists' };

  return await addDoc(cartRef, {
    color,
    notes,
    product,
    quantity,
    purchased: false
  })
    .then((res) => {
      return { added: true, error: '' };
    })
    .catch((err) => {
      return { added: false, error: err.code };
    });
}

// Adds the given promo code to each item in the user's cart
export async function addPromoCodeToCartProducts(promoCodeId, userId) {
  if (!promoCodeId || !userId) return;

  const batch = writeBatch(firestore);

  const cartRef = collection(firestore, 'users', userId, 'cart');
  const querySnapshot = await getDocs(cartRef);

  const cartItem = querySnapshot.docs[0].data();
  if (cartItem.promoCode === promoCodeId) {
    return { error: 'in_use' };
  }

  querySnapshot.forEach((document) => {
    const cartProductRef = doc(firestore, 'users', userId, 'cart', document.id);
    batch.update(cartProductRef, { promoCode: promoCodeId });
  });

  return await batch
    .commit()
    .then((res) => true)
    .catch((err) => ({ error: err }));
}

// Adds a user to the users array within the promo code object
export async function addUserToPromoCode(userId, promoCodeId) {
  if (!userId || !promoCodeId) return;

  const promoCodeUsersRef = doc(firestore, 'promo_codes', promoCodeId);
  return await updateDoc(promoCodeUsersRef, {
    users: arrayUnion(userId)
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

// Adds an order to the user's orders
export async function addOrder(
  userId,
  cartProducts,
  discountTotal = 0,
  stripeOrderId,
  total
) {
  if (!userId || !cartProducts || !stripeOrderId || !total) return;

  const ordered = getFirebaseTimestampFromDate(new Date());

  const ordersRef = collection(firestore, 'users', userId, 'orders');

  try {
    const doc = await addDoc(ordersRef, {
      cartProducts,
      discountTotal,
      ordered,
      stripeOrderId,
      total
    });
    return doc.id;
  } catch (err) {
    console.log(err);
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

// Removes an item from the user's cart
export async function removeCartItem(userId, cartProductId) {
  if (!userId || !cartProductId) return;

  const cartProductRef = doc(firestore, 'users', userId, 'cart', cartProductId);
  return await deleteDoc(cartProductRef);
}

// Removes all items from the user's cart
export async function removeAllCartItems(userId) {
  if (!userId) return;

  const batch = writeBatch(firestore);
  const cartRef = collection(firestore, 'users', userId, 'cart');
  const querySnapshot = await getDocs(cartRef);

  querySnapshot.forEach((document) => {
    const cartProductRef = doc(firestore, 'users', userId, 'cart', document.id);
    batch.delete(cartProductRef);
  });

  return await batch.commit();
}

// Updates the user with the given options
export async function updateUser(userId, options) {
  if (!userId || !options) return;

  const userRef = doc(firestore, 'users', userId);
  return await updateDoc(userRef, options);
}

// Updates a cart item with the given options
export async function updateCartItem(userId, cartProductId, options) {
  if (!userId || !cartProductId || !options) return;

  const cartProductRef = doc(firestore, 'users', userId, 'cart', cartProductId);
  return await updateDoc(cartProductRef, options);
}

// Removes all items from the user's cart
export async function updateAllCartItemsToPurchased(userId) {
  if (!userId) return;

  const batch = writeBatch(firestore);
  const cartRef = collection(firestore, 'users', userId, 'cart');
  const q = query(cartRef, where('purchased', '==', false));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((document) => {
    const cartProductRef = doc(firestore, 'users', userId, 'cart', document.id);
    batch.update(cartProductRef, { purchased: true });
  });

  return await batch.commit();
}

// Updates an order for a user with the given options
export async function updateOrder(userId, orderId, options) {
  if (!userId || !orderId || !options) return;

  const orderRef = doc(firestore, 'users', userId, 'orders', orderId);
  return await updateDoc(orderRef, options);
}
