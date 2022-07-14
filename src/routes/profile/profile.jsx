// React
import { useEffect, useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Bootstrap
import { Container } from 'react-bootstrap';

// Chakra
import { useToast } from '@chakra-ui/react';

// Firebase
import {
  updateUserProfile,
  sendResetPasswordEmail,
  updateUserEmail,
  sendUserVerificationEmail,
  updateUser
} from '../../utils/firebase/firebase';

// Slices
import {
  selectUser,
  selectDisplayName,
  selectEmail,
  selectPhotoURL,
  setDisplayName,
  setEmail,
  setPhotoURL,
  selectPhoneNumber,
  setPhoneNumber
} from '../../redux/slices/userSlice';
import { selectScreenWidth } from '../../redux/slices/screenSlice';

// Components
import ProfileDesktop from './profile.desktop';
import ProfileMobile from './profile.mobile';
import { validatePhoneNumber } from '../../exports/functions';

const defaultFormInput = {
  displayName: '',
  photoURL: '',
  email: '',
  phoneNumber: ''
};

function Profile() {
  const toast = useToast();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const displayName = useSelector(selectDisplayName);
  const email = useSelector(selectEmail);
  const photoURL = useSelector(selectPhotoURL);
  const phoneNumber = useSelector(selectPhoneNumber);
  const screenWidth = useSelector(selectScreenWidth);

  const [formInput, setFormInput] = useState(defaultFormInput);
  const [profileLoading, setProfileLoading] = useState(false);
  const [updateNameLoading, setUpdateNameLoading] = useState(false);
  const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
  const [updatePhoneLoading, setUpdatePhoneLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);

  // Sets the form input to user data when user is available
  useEffect(() => {
    setProfileLoading(true);

    if (displayName) {
      setFormInput({
        displayName,
        photoURL,
        email,
        phoneNumber
      });
      setProfileLoading(false);
    }
  }, [displayName, photoURL, email, phoneNumber]);

  // Handles the updating of the user's display name and picture
  async function handleNameUpdate() {
    if (displayName === formInput.displayName) return;

    setUpdateNameLoading(true);

    await updateUserProfile({
      displayName: formInput.displayName,
      photoURL: formInput.photoURL
    })
      .then(() => {
        dispatch(setDisplayName(formInput.displayName));
        dispatch(setPhotoURL(formInput.photoURL));

        handleProfileUpdateOrError(
          'Profile Updated Successfully',
          'Your full name was updated successfully!',
          null
        );

        setUpdateNameLoading(false);
      })
      .catch((err) => {
        handleProfileUpdateOrError(
          'Profile Update Failed',
          'There was an error updating your full name. Try again later.',
          err
        );
        setUpdateNameLoading(false);
      });
  }

  // Handles the sending of the email to verify the user's email
  async function handleVerificationEmail(isChangingEmail) {
    if (!isChangingEmail) setVerifyEmailLoading(true);

    await sendUserVerificationEmail()
      .then(() => {
        const title = !isChangingEmail
          ? 'Verification Email Sent Successfully'
          : 'Email Changed Successfully';
        handleProfileUpdateOrError(
          title,
          'Please check your inbox or spam folder for a verification email.',
          null
        );
        !isChangingEmail
          ? setVerifyEmailLoading(false)
          : setUpdateEmailLoading(false);
      })
      .catch((err) => {
        handleProfileUpdateOrError(
          'Verification Email Failed',
          'There was an error sending the verification email. Try again later.',
          err
        );
        !isChangingEmail
          ? setVerifyEmailLoading(false)
          : setUpdateEmailLoading(false);
      });
  }

  // Handles the updating of the user email
  async function handleEmailUpdate() {
    if (
      formInput.email === '' ||
      email === formInput.email ||
      (user && user.providerData[0].providerId !== 'password')
    )
      return;

    setUpdateEmailLoading(true);

    await updateUserEmail(formInput.email)
      .then(() => {
        dispatch(setEmail(formInput.email));
        handleVerificationEmail(true);
      })
      .catch((err) => {
        handleProfileUpdateOrError(
          'Email Change Failed',
          'There was an error changing your email. Try again later.',
          err
        );
        setUpdateEmailLoading(false);
      });
  }

  // Handles updating the user's phone number
  async function handlePhoneNumberUpdate() {
    if (formInput.phoneNumber === '' || phoneNumber === formInput.phoneNumber)
      return;

    if (!validatePhoneNumber(formInput.phoneNumber)) {
      handleProfileUpdateOrError(
        'Phone Number Invalid',
        'Please enter a valid phone number (e.g. (555) 555-5555).',
        { code: '' }
      );
      return;
    }

    setUpdatePhoneLoading(true);

    await updateUser(user.uid, { phoneNumber: formInput.phoneNumber })
      .then((res) => {
        handleProfileUpdateOrError(
          'Phone Number Updated',
          'Your phone number was updated successfully!',
          null
        );
        dispatch(setPhoneNumber(formInput.phoneNumber));
        setUpdatePhoneLoading(false);
      })
      .catch((err) => {
        handleProfileUpdateOrError(
          'Phone Number Update Failed',
          'There was an error updating your phone number. Please try again later!',
          err
        );
        setUpdatePhoneLoading(false);
      });
  }

  // Handles the sending of the password reset email
  async function handlePasswordResetEmail() {
    if (!email || (user && user.providerData[0].providerId !== 'password'))
      return;

    setResetPasswordLoading(true);

    await sendResetPasswordEmail(email)
      .then(() => {
        handleProfileUpdateOrError(
          'Email Sent Successfully',
          `An email to reset your password has been sent to ${email}. Please check your spam folder!`,
          null
        );
        setResetPasswordLoading(false);
      })
      .catch((err) => {
        handleProfileUpdateOrError(
          'Reset Password Failed',
          'There was an error sending the reset password email. Try again later.',
          err
        );
        setResetPasswordLoading(false);
      });
  }

  // Shows toast depending on success or error when updating profile
  function handleProfileUpdateOrError(title, description, err) {
    if (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          description = 'The email you entered is invalid.';
          break;
        case 'auth/requires-recent-login':
          description =
            'Please sign out and sign back in to change your email.';
          break;
        case 'auth/email-already-in-use':
          description =
            'Email is already in use. Please use a different email.';
          break;
        case 'auth/too-many-requests':
          description = 'Too many requests. Please try again later.';
          break;
        default:
          break;
      }
    }

    toast({
      title: title,
      description: description,
      status: err ? 'error' : 'success',
      duration: 7000,
      isClosable: true
    });
  }

  // Returns if the input field is disabled given the input type
  function isInputDisabled(inputType) {
    if (updateNameLoading && inputType === 'name') {
      return true;
    } else if (
      user &&
      (updateEmailLoading ||
        (user.providerData[0].providerId !== 'password' &&
          inputType === 'email'))
    ) {
      return true;
    } else if (
      user &&
      (resetPasswordLoading ||
        (user.providerData[0].providerId !== 'password' &&
          inputType === 'password'))
    ) {
      return true;
    } else if (verifyEmailLoading && inputType === 'verify') {
      return true;
    }

    return false;
  }

  return (
    <Container className="main-container profile-container">
      {screenWidth > 991 ? (
        <ProfileDesktop
          user={user}
          displayName={displayName}
          email={email}
          photoURL={photoURL}
          phoneNumber={phoneNumber}
          formInput={formInput}
          setFormInput={setFormInput}
          isInputDisabled={isInputDisabled}
          updateNameLoading={updateNameLoading}
          handleNameUpdate={handleNameUpdate}
          verifyEmailLoading={verifyEmailLoading}
          handleVerificationEmail={handleVerificationEmail}
          updateEmailLoading={updateEmailLoading}
          handleEmailUpdate={handleEmailUpdate}
          resetPasswordLoading={resetPasswordLoading}
          handlePasswordResetEmail={handlePasswordResetEmail}
          handlePhoneNumberUpdate={handlePhoneNumberUpdate}
          updatePhoneLoading={updatePhoneLoading}
        />
      ) : (
        <ProfileMobile
          user={user}
          displayName={displayName}
          email={email}
          photoURL={photoURL}
          phoneNumber={phoneNumber}
          formInput={formInput}
          setFormInput={setFormInput}
          isInputDisabled={isInputDisabled}
          updateNameLoading={updateNameLoading}
          handleNameUpdate={handleNameUpdate}
          verifyEmailLoading={verifyEmailLoading}
          handleVerificationEmail={handleVerificationEmail}
          updateEmailLoading={updateEmailLoading}
          handleEmailUpdate={handleEmailUpdate}
          resetPasswordLoading={resetPasswordLoading}
          handlePasswordResetEmail={handlePasswordResetEmail}
          handlePhoneNumberUpdate={handlePhoneNumberUpdate}
          updatePhoneLoading={updatePhoneLoading}
        />
      )}
    </Container>
  );
}

export default Profile;
