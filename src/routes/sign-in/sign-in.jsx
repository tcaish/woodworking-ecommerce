// React
import { useState } from 'react';

// React Router
import { Link } from 'react-router-dom';

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
  Switch
} from '@chakra-ui/react';

// Firebase
import {
  signInWithGooglePopup,
  signInWithFacebookPopup,
  signInWithEmailPassword
} from '../../utils/firebase/firebase';

// Styles
import './sign-in.scss';

const defaultFormInput = {
  email: '',
  email_missing: false,
  password: '',
  password_missing: false,
  remember: false
};

function SignIn() {
  const [formInput, setFormInput] = useState(defaultFormInput);
  const [isLoading, setIsLoading] = useState(false);

  function handleSignInErrors(err) {
    if (
      err.code !== 'auth/popup-closed-by-user' &&
      err.code !== 'cancelled-popup-request'
    ) {
      console.log(err);
    }
  }

  async function signInViaGoogle() {
    setIsLoading(true);

    await signInWithGooglePopup()
      .then((res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        handleSignInErrors(err);
      });
  }

  async function signInViaFacebook() {
    setIsLoading(true);

    await signInWithFacebookPopup()
      .then((res) => setIsLoading(false))
      .catch((err) => {
        setIsLoading(false);
        handleSignInErrors(err);
      });
  }

  async function signInViaEmailPassword() {
    if (!formInput.email) {
      setFormInput({ ...formInput, email_missing: true });
      return;
    }
    if (!formInput.password) {
      setFormInput({ ...formInput, password_missing: true });
      return;
    }

    setIsLoading(true);

    await signInWithEmailPassword(formInput.email, formInput.password)
      .then((res) => {
        setIsLoading(false);
        setFormInput(defaultFormInput);
      })
      .catch((err) => {
        switch (err.code) {
          case 'auth/invalid-email':
            console.log('This email address does not match our records.');
            break;
          case 'auth/user-not-found':
            console.log(
              'This email/password combination does not match our records.'
            );
            break;
          default:
            console.log(err);
            break;
        }

        setIsLoading(false);
        setFormInput({
          ...formInput,
          email_missing: false,
          password_missing: false
        });
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
              type="Email"
              placeholder=" "
              size="md"
              value={formInput.email}
              isInvalid={formInput.email_missing}
              required
              onChange={(event) =>
                setFormInput({ ...formInput, email: event.target.value })
              }
            />
            <FormLabel>Email</FormLabel>
          </FormControl>
          <FormControl variant="floating">
            <Input
              type="Password"
              placeholder=" "
              size="md"
              value={formInput.password}
              isInvalid={formInput.password_missing}
              required
              onChange={(event) =>
                setFormInput({ ...formInput, password: event.target.value })
              }
            />
            <FormLabel>Password</FormLabel>
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <Switch
              className="sign-in-switch"
              onChange={(event) => {
                setFormInput({ ...formInput, remember: event.target.checked });
              }}
            />
            <FormLabel htmlFor="email-alerts" mb="0">
              Remember me
            </FormLabel>
          </FormControl>
        </div>
        <div className="sign-in-button-container">
          <Button
            className="log-in-button"
            isLoading={isLoading}
            onClick={signInViaEmailPassword}
          >
            Log In
          </Button>
        </div>

        <div className="sign-in-create-account-container">
          <Center>
            <Link to="/sign-up">
              <Button variant="link">Create an Account</Button>
            </Link>
          </Center>
        </div>
      </div>
    </Center>
  );
}

export default SignIn;
