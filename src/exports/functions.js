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
