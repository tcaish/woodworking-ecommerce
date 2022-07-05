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

// Returns the amount of days that have gone by since the given timestamp
export function howManyDaysFromToday(timestamp) {
  const todaysTimestamp = Timestamp.fromDate(new Date()).toDate().getTime();
  const diffInTime = todaysTimestamp - timestamp.toDate().getTime();
  return diffInTime / (1000 * 3600 * 24);
}

// Returns the full URL of the current page encoded
export function getFullURLEncoded() {
  return encodeURIComponent(window.location.href);
}

// Opens a popup window to share page to specified social media
export function shareToSocialMedia(socialType) {
  let shareLink = '';

  if (socialType === SOCIAL_TYPES.facebook) {
    shareLink = 'https://www.facebook.com/sharer/sharer.php?u=';
  } else if (socialType === SOCIAL_TYPES.twitter) {
    shareLink = 'https://twitter.com/intent/tweet?url=';
  } else if (socialType === SOCIAL_TYPES.linkedin) {
    shareLink = 'http://www.linkedin.com/shareArticle?mini=true&url=';
  } else {
    return;
  }

  window.open(
    `${shareLink}${getFullURLEncoded()}`,
    'popup',
    'width=600,height=600,scrollbars=no,resizable=no'
  );
  return false;
}

// Returns the ratings for a given product
export function getRatingsForProduct(ratings, productId) {
  if (ratings.length === 0) return [];
  return ratings.filter((rating) => rating.product === productId);
}

// Returns the average rating for a given product's ratings
export function getAverageRatingForProduct(productRatings) {
  if (productRatings.length === 0) return 0;

  const totalRating = productRatings.reduce(
    (prevValue, rating) => prevValue + rating.rating,
    0
  );
  return (totalRating / productRatings.length).toFixed(1);
}
