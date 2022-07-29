import { Timestamp } from 'firebase/firestore';
import { SOCIAL_TYPES } from './constants';

// Signing in and out
export function handleSignInUpErrors(err) {
  let description = '';

  switch (err.code) {
    case 'auth/invalid-email':
      description = 'This email address is not in the correct format.';
      break;
    case 'auth/email-already-in-use':
      description = 'This email address is already in use.';
      break;
    case 'auth/weak-password':
      description =
        'Weak password. Password length must be at least 6 characters.';
      break;
    case 'auth/wrong-password':
      description = 'Password is invalid.';
      break;
    case 'auth/user-not-found':
      description =
        'This email/password combination does not match our records.';
      break;
    case 'auth/account-exists-with-different-credential':
      description = 'This is not the original provider you signed in with.';
      break;
    case 'auth/too-many-requests':
      description =
        'Account has been temporarily disabled due to many failed login ' +
        'attempts. Restore it by resetting your password, or try again later.';
      break;
    default:
      description = 'There was an issue signing in. Please try again!';
      break;
  }

  return description;
}

// Returns the product given a product ID
export function getProduct(products, productId) {
  return products.filter((product) => product.id === productId)[0];
}

// Returns a firebase timestamp given a date
export function getFirebaseTimestampFromDate(date) {
  return Timestamp.fromDate(date);
}

// Returns the amount of days that have gone by since the given timestamp
export function howManyDaysFromToday(timestamp) {
  const todaysTimestamp = getFirebaseTimestampFromDate(new Date())
    .toDate()
    .getTime();
  const diffInTime = todaysTimestamp - timestamp.toDate().getTime();
  return diffInTime / (1000 * 3600 * 24);
}

// Returns the full URL of the current page encoded
export function getFullURLEncoded() {
  return encodeURIComponent(window.location.href);
}

// Opens a popup window to share page
export async function shareToSocialMedia(
  title,
  text,
  url = getFullURLEncoded()
) {
  await navigator.share({
    title,
    text,
    url
  });
  // let shareLink = '';

  // if (socialType === SOCIAL_TYPES.facebook) {
  //   shareLink = 'https://www.facebook.com/sharer/sharer.php?u=';
  // } else if (socialType === SOCIAL_TYPES.twitter) {
  //   shareLink = 'https://twitter.com/intent/tweet?url=';
  // } else if (socialType === SOCIAL_TYPES.linkedin) {
  //   shareLink = 'http://www.linkedin.com/shareArticle?mini=true&url=';
  // } else {
  //   return;
  // }

  // window.open(
  //   `${shareLink}${getFullURLEncoded()}`,
  //   'popup',
  //   'width=600,height=600,scrollbars=no,resizable=no'
  // );
  // return false;
}

// Returns the ratings for a given product
export function getRatingsForProduct(ratings, productId) {
  if (ratings.length === 0) return [];
  return ratings.filter((rating) => rating.product === productId);
}

// Returns the average rating for a given product's ratings
export function getAverageRatingForProduct(productRatings) {
  let avgRating = 0;

  if (productRatings.length === 0) return avgRating.toFixed(1);

  const totalRating = productRatings.reduce(
    (prevValue, rating) => prevValue + rating.rating,
    0
  );
  return (totalRating / productRatings.length).toFixed(1);
}

// Capitalizes the first letter of a string
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Validates a string is an email
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// Validates that a phone number is in the correct format and length
export const validatePhoneNumber = (phoneNumber) => {
  // +12345678901 is a valid phone number (length == 12)
  if (phoneNumber.length !== 12) return false;
  return String(phoneNumber)
    .toLowerCase()
    .match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im);
};

// Formats a phone number to look like this: (555) 555-5555
export function formatPhoneNumber(phoneNumber) {
  let tempNum = phoneNumber;

  // Remove +1
  tempNum = tempNum.replace('+1', '');

  // Add parenthesis to area code
  tempNum = '(' + tempNum.slice(0, 3) + ') ' + tempNum.slice(3);

  // Add hyphen
  tempNum = tempNum.slice(0, 9) + '-' + tempNum.slice(9);

  return tempNum;
}

// Loads an image and returns when it finishes.
// This is only used for setting images via the background-image property
// in CSS.
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', resolve);
    image.addEventListener('error', reject);
    image.src = src;
  });
}

// Adds a decimal to any number passed in
export function addDecimalToNumber(number) {
  let tempNumber = `${number}`;
  tempNumber =
    tempNumber.slice(0, tempNumber.length - 2) +
    '.' +
    tempNumber.slice(tempNumber.length - 2, tempNumber.length);
  return Number(tempNumber);
}
