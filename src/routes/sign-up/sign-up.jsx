// React
import { useState } from 'react';

// React Redux
import { useDispatch } from 'react-redux';

// React Router
import { useNavigate } from 'react-router-dom';

// React Icons
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';

// Chakra
import {
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  useToast
} from '@chakra-ui/react';

// Firebase
import {
  signInWithGooglePopup,
  signInWithFacebookPopup,
  createAuthUserWithEmailAndPassword,
  updateUserProfile
} from '../../utils/firebase/firebase';

// Slices
import { setUser } from '../../redux/slices/userSlice';

// Functions
import { handleSignInUpErrors } from '../../exports/functions';

// Styles
import '../sign-in/sign-in.scss';

const defaultFormInput = {
  displayName: '',
  email: '',
  email_missing: false,
  password: '',
  password_missing: false,
  confirmPassword: '',
  confirm_password_missing: false
};

function SignUp() {
  const dispatch = useDispatch();

  const toast = useToast();
  const navigate = useNavigate();

  const [formInput, setFormInput] = useState(defaultFormInput);
  const [isLoading, setIsLoading] = useState(false);

  function handleSignUpErrors(err) {
    let title = 'Error Signing Up';
    const description = handleSignInUpErrors(err);

    toast({
      title: title,
      description: description,
      status: 'error',
      duration: 6000,
      isClosable: true
    });
  }

  function redirectToHomePage() {
    navigate('/');
  }

  async function signInViaGoogle() {
    setIsLoading(true);

    await signInWithGooglePopup()
      .then((res) => {
        setIsLoading(false);
        redirectToHomePage();
      })
      .catch((err) => {
        setIsLoading(false);
        handleSignUpErrors(err);
      });
  }

  async function signInViaFacebook() {
    setIsLoading(true);

    await signInWithFacebookPopup()
      .then((res) => {
        setIsLoading(false);
        redirectToHomePage();
      })
      .catch((err) => {
        setIsLoading(false);
        handleSignUpErrors(err);
      });
  }

  async function signUpViaEmailPassword() {
    if (!formInput.email || !formInput.password || !formInput.confirmPassword) {
      setFormInput({
        ...formInput,
        email_missing: formInput.email === '',
        password_missing: formInput.password === '',
        confirm_password_missing: formInput.confirmPassword === ''
      });
      return;
    }

    if (formInput.password !== formInput.confirmPassword) {
      toast({
        title: 'Password Error',
        description: 'Your passwords do not match.',
        status: 'error',
        duration: 6000,
        isClosable: true
      });
      return;
    }

    setIsLoading(true);

    await createAuthUserWithEmailAndPassword(
      formInput.email,
      formInput.password
    )
      .then((createRes) => {
        let newUser = createRes.user;

        if (formInput.displayName) {
          updateUserProfile(newUser, {
            displayName: formInput.displayName
          })
            .then((updateRes) => {
              newUser.displayName = formInput.displayName;
              dispatch(setUser(newUser));
            })
            .catch((err) => {
              toast({
                title: 'Profile Error',
                description: 'We were not able to update your display name.',
                status: 'error',
                duration: 6000,
                isClosable: true
              });
            });
        }

        setIsLoading(false);
        setFormInput(defaultFormInput);
        redirectToHomePage();
      })
      .catch((err) => {
        setIsLoading(false);
        setFormInput({
          ...formInput,
          email_missing: false,
          password_missing: false,
          confirm_password_missing: false
        });
        handleSignUpErrors(err);
      });
  }

  return (
    <Center>
      <div className="sign-in-container">
        <div className="sign-in-header-container">
          <Center>
            <span className="sign-in-title">Sign up with a provider</span>
          </Center>
          <Center>
            <div className="sign-in-auth-providers-container">
              <IconButton
                className="facebook-icon"
                color="#4267B2"
                variant="link"
                aria-label="Facebook"
                fontSize="30px"
                icon={<BsFacebook />}
                onClick={signInViaFacebook}
              />
              <IconButton
                variant="link"
                aria-label="Google"
                fontSize="30px"
                icon={<FcGoogle />}
                onClick={signInViaGoogle}
              />
            </div>
          </Center>
        </div>
        <div className="sign-in-inputs-container">
          <FormControl variant="floating">
            <Input
              type="text"
              placeholder=" "
              size="md"
              focusBorderColor="#f7d794"
              value={formInput.displayName}
              onChange={(event) =>
                setFormInput({
                  ...formInput,
                  displayName: event.target.value
                })
              }
            />
            <FormLabel>Full Name</FormLabel>
            <FormHelperText className="sign-in-input-helper-text">
              Optional
            </FormHelperText>
          </FormControl>
          <FormControl variant="floating">
            <Input
              className="sign-in-input"
              type="email"
              placeholder=" "
              size="md"
              focusBorderColor="#f7d794"
              value={formInput.email}
              isInvalid={formInput.email_missing}
              required
              onChange={(event) =>
                setFormInput({
                  ...formInput,
                  email: event.target.value,
                  email_missing: event.target.value === ''
                })
              }
            />
            <FormLabel>Email</FormLabel>
          </FormControl>
          <FormControl variant="floating">
            <Input
              className="sign-in-input"
              type="password"
              placeholder=" "
              size="md"
              focusBorderColor="#f7d794"
              value={formInput.password}
              isInvalid={formInput.password_missing}
              required
              onChange={(event) =>
                setFormInput({
                  ...formInput,
                  password: event.target.value,
                  password_missing: event.target.value === ''
                })
              }
            />
            <FormLabel>Password</FormLabel>
          </FormControl>
          <FormControl variant="floating">
            <Input
              className="sign-in-input"
              type="password"
              placeholder=" "
              size="md"
              focusBorderColor="#f7d794"
              value={formInput.confirmPassword}
              isInvalid={formInput.confirm_password_missing}
              required
              onChange={(event) =>
                setFormInput({
                  ...formInput,
                  confirmPassword: event.target.value,
                  confirm_password_missing: event.target.value === ''
                })
              }
            />
            <FormLabel>Confirm Password</FormLabel>
          </FormControl>
        </div>
        <div className="sign-in-button-container">
          <Button
            className="log-in-button"
            isLoading={isLoading}
            onClick={signUpViaEmailPassword}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </Center>
  );
}

export default SignUp;
