// React
import { useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Icons
import { BsCheck2 } from 'react-icons/bs';
import { FcCancel } from 'react-icons/fc';

// Bootstrap
import { Container } from 'react-bootstrap';

// Chakra
import {
  Avatar,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  Input,
  useToast
} from '@chakra-ui/react';

// Firebase
import {
  updateUserProfile,
  sendResetPasswordEmail,
  updateUserEmail,
  sendUserVerificationEmail
} from '../../utils/firebase/firebase';

// Slices
import {
  selectUser,
  selectDisplayName,
  selectEmail,
  selectPhotoURL,
  setDisplayName,
  setEmail,
  setPhotoURL
} from '../../redux/slices/userSlice';

// Styles
import './profile.scss';

function Profile() {
  const toast = useToast();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const displayName = useSelector(selectDisplayName);
  const email = useSelector(selectEmail);
  const photoURL = useSelector(selectPhotoURL);

  const [formInput, setFormInput] = useState(user);
  const [updateNameLoading, setUpdateNameLoading] = useState(false);
  const [updateEmailLoading, setUpdateEmailLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);

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
    if (formInput.email === '' || email === formInput.email) return;

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

  // Handles the sending of the password reset email
  async function handlePasswordResetEmail() {
    if (!email) return;

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
      updateEmailLoading &&
      user.providerData[0].providerId !== 'password' &&
      inputType === 'email'
    ) {
      return true;
    } else if (
      resetPasswordLoading &&
      user.providerData[0].providerId !== 'password' &&
      inputType === 'password'
    ) {
      return true;
    } else if (verifyEmailLoading && inputType === 'verify') {
      return true;
    }

    return false;
  }

  return (
    <Container className="main-container profile-container">
      <Grid templateRows="repeat(4, 1fr)" templateColumns="repeat(2, 1fr)">
        <GridItem rowSpan={2} colSpan={1}>
          <Center h="100%">
            <Avatar
              className="profile-avatar"
              size="2xl"
              bg={photoURL && 'none'}
              name={displayName ? displayName : ''}
              src={photoURL ? photoURL : ''}
            />
          </Center>
        </GridItem>

        <GridItem className="update-profile-container" rowSpan={4}>
          <h1 className="profile-update-header">Update Profile</h1>

          <FormControl className="profile-form-control">
            <FormLabel>Full Name</FormLabel>
            <Input
              type="email"
              placeholder="e.g. John Doe"
              focusBorderColor="#f7d794"
              isDisabled={isInputDisabled('name')}
              value={formInput.displayName ? formInput.displayName : ''}
              onChange={(e) =>
                setFormInput({ ...formInput, displayName: e.target.value })
              }
            />
            <Button
              className="profile-form-update-button"
              size="sm"
              isLoading={updateNameLoading}
              onClick={handleNameUpdate}
            >
              Update Name
            </Button>
          </FormControl>

          <FormControl className="profile-form-control">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="e.g. johndoe@gmail.com"
              focusBorderColor="#f7d794"
              value={formInput.email ? formInput.email : ''}
              onChange={(e) =>
                setFormInput({ ...formInput, email: e.target.value })
              }
              isDisabled={isInputDisabled('email')}
              isInvalid={formInput.email === ''}
            />

            {user.providerData[0].providerId !== 'password' && (
              <FormHelperText>
                You cannot change your email when signed in via a provider.
              </FormHelperText>
            )}

            {!user.emailVerified ? (
              <FormHelperText>
                <Icon as={FcCancel} />
                <span className="profile-email-not-verified-text">
                  Email not verified
                </span>
                {' | '}
                <Button
                  variant="link"
                  isDisabled={isInputDisabled('verify')}
                  isLoading={verifyEmailLoading}
                  onClick={() => handleVerificationEmail(false)}
                >
                  Verify Email
                </Button>
              </FormHelperText>
            ) : (
              <FormHelperText>
                <Icon as={BsCheck2} color="green" />{' '}
                <span className="profile-email-verified-text">
                  Email verified
                </span>
              </FormHelperText>
            )}
            <Button
              className="profile-form-update-button"
              size="sm"
              isLoading={updateEmailLoading}
              onClick={handleEmailUpdate}
            >
              Update Email
            </Button>
          </FormControl>

          <FormControl className="profile-form-control">
            <FormLabel>Password</FormLabel>
            <Button
              variant="link"
              isDisabled={isInputDisabled('password')}
              isLoading={resetPasswordLoading}
              onClick={handlePasswordResetEmail}
            >
              Send Reset Password Email
            </Button>
            {user.providerData[0].providerId !== 'password' && (
              <FormHelperText>
                You cannot change your password when signed in via a provider.
              </FormHelperText>
            )}
          </FormControl>
        </GridItem>

        <GridItem rowSpan={1} colSpan={1}>
          <Center>
            <div className="profile-name-container">
              <h1 className="profile-name">
                {displayName ? displayName : `user-${user.uid.substring(0, 6)}`}
              </h1>
            </div>
          </Center>
          <Center>
            <div className="profile-email-container">
              <h1 className="profile-email">{email}</h1>
            </div>
          </Center>
        </GridItem>
      </Grid>
    </Container>
  );
}

export default Profile;
