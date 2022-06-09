// React Icons
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook } from 'react-icons/bs';

// Bootstrap
import { Container } from 'react-bootstrap';

// Chakra
import { Center, IconButton } from '@chakra-ui/react';

// Firebase
import { signInWithGooglePopup } from '../../utils/firebase/firebase';

// Styles
import './sign-in.scss';

function SignIn() {
  async function signInViaGoogle() {
    await signInWithGooglePopup();
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
              />
            </div>
          </Center>
        </div>
        <button onClick={signInViaGoogle}>Sign In with Google Popup</button>
      </div>
    </Center>
  );
}

export default SignIn;
