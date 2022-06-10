// React
import { useEffect } from 'react';

// React Router
import { Routes, Route } from 'react-router-dom';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Firebase
import {
  createUserDocumentFromAuth,
  onAuthStateChangedListener
} from './utils/firebase/firebase';

// Slices
import { selectUser, setUser } from './redux/slices/userSlice';

// Components
import Home from './routes/home/home';
import Navigation from './routes/navigation/navigation';
import SignIn from './routes/sign-in/sign-in';
import SignUp from './routes/sign-up/sign-up';
import Cart from './routes/cart/cart';
import Profile from './routes/profile/profile';

// Styles
import './App.scss';
import {
  ProtectedUserRoute,
  ProtectedNoUserRoute
} from './routes/protected/protected';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // Listens for the user to sign in or out
  useEffect(() => {
    onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }

      dispatch(setUser(user));
    });
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route
          path="profile"
          element={
            <ProtectedUserRoute user={user} redirectPath="/sign-in">
              <Profile />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="sign-in"
          element={
            <ProtectedNoUserRoute user={user}>
              <SignIn />
            </ProtectedNoUserRoute>
          }
        />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
    </Routes>
  );
}

export default App;
