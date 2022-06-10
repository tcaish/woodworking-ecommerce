// React Icons
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';

// Chakra
import {
  Center,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Switch
} from '@chakra-ui/react';

// Firebase
import { signInWithGooglePopup } from '../../utils/firebase/firebase';

// Styles
import './sign-in.scss';

function SignIn() {
  async function signInViaGoogle() {
    await signInWithGooglePopup()
      .then((res) => {})
      .catch((err) => {
        if (
          err.code !== 'auth/popup-closed-by-user' &&
          err.code !== 'cancelled-popup-request'
        ) {
          console.log(err);
        }
      });
  }

  return (
    <Center>
      <div className="sign-in-container">
        <div className="sign-in-header-container">
          <Center>
            <span className="sign-in-title">Sign In</span>
          </Center>
          <Center>
            <div className="sign-in-auth-providers-container">
              <IconButton
                color="#4267B2"
                variant="link"
                aria-label="Facebook"
                fontSize="30px"
                icon={<BsFacebook />}
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
            <Input type="Email" placeholder=" " size="md" required />
            <FormLabel>Email</FormLabel>
          </FormControl>
          <FormControl variant="floating">
            <Input type="Password" placeholder=" " size="md" required />
            <FormLabel>Password</FormLabel>
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <Switch className="sign-in-switch" />
            <FormLabel htmlFor="email-alerts" mb="0">
              Remember me
            </FormLabel>
          </FormControl>
        </div>
      </div>
    </Center>
  );
}

export default SignIn;
