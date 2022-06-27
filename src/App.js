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
import { setScreenWidth } from './redux/slices/screenSlice';

// Components
import Home from './routes/home/home';
import Navigation from './routes/navigation/navigation';
import SignIn from './routes/sign-in/sign-in';
import SignUp from './routes/sign-up/sign-up';
import Cart from './routes/cart/cart';
import Profile from './routes/profile/profile';
import Support from './routes/support/support';
import Shop from './routes/shop/shop';
import Furniture from './routes/shop/furniture/furniture';
import Custom from './routes/shop/custom/custom';
import Restoration from './routes/shop/restoration/restoration';
import {
  ProtectedUserRoute,
  ProtectedNoUserRoute
} from './routes/protected/protected';
import Detail from './routes/shop/furniture/detail/detail';

// Styles
import './App.scss';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  window.onresize = () => dispatch(setScreenWidth(window.innerWidth));

  // Listens for the user to sign in or out
  useEffect(() => {
    onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
        sessionStorage.setItem('Auth Token', user.refreshToken);
      } else {
        sessionStorage.removeItem('Auth Token');
      }

      dispatch(setUser(user));
    });
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />}>
          <Route index element={<Furniture />} />
          <Route path="product-details/:productId" element={<Detail />} />
          <Route path="custom" element={<Custom />} />
          <Route path="restoration" element={<Restoration />} />
        </Route>
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
            <ProtectedNoUserRoute>
              <SignIn />
            </ProtectedNoUserRoute>
          }
        />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="support" element={<Support />} />
      </Route>
    </Routes>
  );
}

export default App;
