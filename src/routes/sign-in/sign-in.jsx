// Firebase
import { signInWithGooglePopup } from '../../utils/firebase/firebase';

function SignIn() {
  async function signInViaGoogle() {
    await signInWithGooglePopup();
  }

  return (
    <div>
      <h1>Sign In Page</h1>
      <button onClick={signInViaGoogle}>Sign In with Google Popup</button>
    </div>
  );
}

export default SignIn;
