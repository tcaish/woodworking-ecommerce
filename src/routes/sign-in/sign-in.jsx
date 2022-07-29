// React
import { useState } from 'react';

// React Router
import { Link, useNavigate } from 'react-router-dom';

// React Icons
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';

// Chakra
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Switch,
  Text,
  useToast
} from '@chakra-ui/react';

// Firebase
import {
  signInWithGooglePopup,
  signInWithFacebookPopup,
  signInWithEmailPassword
} from '../../utils/firebase/firebase';

// Exports
import { handleSignInUpErrors } from '../../exports/functions';
import { NAVIGATION_PATHS } from '../../exports/constants';

// Styles
import './sign-in.scss';
import './sign-in.mobile.scss';

const defaultFormInput = {
  email: '',
  email_missing: false,
  password: '',
  password_missing: false,
  remember: false
};

function SignIn() {
  const toast = useToast();
  const navigate = useNavigate();

  const [formInput, setFormInput] = useState(defaultFormInput);
  const [isLoading, setIsLoading] = useState(false);

  function handleSignInErrors(err) {
    let title = 'Error Signing In';
    const description = handleSignInUpErrors(err);

    toast({
      title: title,
      description: description,
      status: 'error',
      duration: 7000,
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
        handleSignInErrors(err);
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
        handleSignInErrors(err);
      });
  }

  async function signInViaEmailPassword() {
    if (!formInput.email || !formInput.password) {
      setFormInput({
        ...formInput,
        email_missing: formInput.email === '',
        password_missing: formInput.password === ''
      });
      return;
    }

    setIsLoading(true);

    await signInWithEmailPassword(formInput.email, formInput.password)
      .then((res) => {
        setIsLoading(false);
        setFormInput(defaultFormInput);
        redirectToHomePage();
      })
      .catch((err) => {
        setIsLoading(false);
        setFormInput({
          ...formInput,
          email_missing: false,
          password_missing: false
        });
        handleSignInErrors(err);
      });
  }

  return (
    <Center>
      <div className="sign-in-container">
        <div className="sign-in-header-container">
          <Center>
            <span className="sign-in-title">Sign in with a provider</span>
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
              className="sign-in-input"
              type="Email"
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
              type="Password"
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
          <FormControl display="flex" alignItems="center">
            <Switch
              className="sign-in-switch"
              isChecked={formInput.remember}
              onChange={(event) => {
                setFormInput({ ...formInput, remember: event.target.checked });
              }}
            />
            <FormLabel htmlFor="email-alerts" mb="0">
              Remember me
            </FormLabel>
          </FormControl>
        </div>

        <div className="sign-in-button-container sign-in-up-button-margin">
          <Button
            className="log-in-button"
            isLoading={isLoading}
            onClick={signInViaEmailPassword}
          >
            Sign In
          </Button>
        </div>

        <div className="sign-in-up-policy-text-container">
          <Text fontSize="sm">
            By signing in, you are agreeing to our{' '}
            <Link
              target="_blank"
              to={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_privacy}`}
            >
              privacy policy
            </Link>
            .
          </Text>
        </div>

        <div className="sign-in-create-account-container">
          <Center>
            <Link to={`/${NAVIGATION_PATHS.sign_up}`}>
              <Button variant="link">Create an Account</Button>
            </Link>
          </Center>
        </div>
      </div>
    </Center>
  );
}

export default SignIn;
