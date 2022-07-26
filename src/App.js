// React
import { useEffect } from 'react';

// React Router
import { Routes, Route, useLocation } from 'react-router-dom';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Icons
import { TbError404 } from 'react-icons/tb';

// Firebase
import {
  createUserDocumentFromAuth,
  onAuthStateChangedListener
} from './utils/firebase/firebase';

// Slices
import {
  selectUser,
  setPhoneNumber,
  setStripeCustomerId,
  setUser
} from './redux/slices/userSlice';
import { setScreenWidth } from './redux/slices/screenSlice';
import { setCurrentPath } from './redux/slices/routingSlice';

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
import Orders from './routes/orders/orders';
import PageEmpty from './components/page-empty/page-empty';
import Policies from './routes/policies/policies';
import RefundReturnPolicy from './routes/policies/refund-return-policy/refund-return-policy';
import DeliveryPolicy from './routes/policies/delivery-policy/delivery-policy';

// Exports
import { NAVIGATION_PATHS } from './exports/constants';

// Styles
import './App.scss';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector(selectUser);

  // On window resize, set the screen width
  window.onresize = () => dispatch(setScreenWidth(window.innerWidth));

  // Listens for the user to sign in or out
  useEffect(() => {
    onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user).then((res) => {
          if (!res.error && res.type === 'get' && res.data.phone_number) {
            dispatch(setPhoneNumber(res.data.phone_number));
          }

          if (!res.error && res.type === 'get' && res.data.stripe_customer_id) {
            dispatch(setStripeCustomerId(res.data.stripe_customer_id));
          }
        });

        dispatch(setUser(user));
        sessionStorage.setItem('Auth Token', user.refreshToken);
      } else {
        sessionStorage.removeItem('Auth Token');
      }
    });
  }, [dispatch]);

  // Sets the current path the user is on
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <Routes>
      <Route path={NAVIGATION_PATHS.home} element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path={NAVIGATION_PATHS.shop} element={<Shop />}>
          <Route index element={<Furniture />} />
          <Route
            path={`${NAVIGATION_PATHS.shop_product_details}/:productId`}
            element={<Detail />}
          />
          <Route path={NAVIGATION_PATHS.shop_custom} element={<Custom />} />
          <Route
            path={NAVIGATION_PATHS.shop_restoration}
            element={<Restoration />}
          />
        </Route>
        <Route path={NAVIGATION_PATHS.cart} element={<Cart />} />
        <Route
          path={NAVIGATION_PATHS.orders}
          element={
            <ProtectedUserRoute
              user={user}
              redirectPath={NAVIGATION_PATHS.sign_in}
            >
              <Orders />
            </ProtectedUserRoute>
          }
        />
        <Route
          path={NAVIGATION_PATHS.profile}
          element={
            <ProtectedUserRoute
              user={user}
              redirectPath={NAVIGATION_PATHS.sign_in}
            >
              <Profile />
            </ProtectedUserRoute>
          }
        />
        <Route
          path={NAVIGATION_PATHS.sign_in}
          element={
            <ProtectedNoUserRoute>
              <SignIn />
            </ProtectedNoUserRoute>
          }
        />
        <Route path={NAVIGATION_PATHS.sign_up} element={<SignUp />} />
        <Route path={NAVIGATION_PATHS.support} element={<Support />} />
        <Route
          path={`${NAVIGATION_PATHS.support}/:orderId`}
          element={<Support />}
        />
        <Route path={NAVIGATION_PATHS.policies}>
          <Route index element={<Policies />} />
          <Route
            path={NAVIGATION_PATHS.policy_refund_return}
            element={<RefundReturnPolicy />}
          />
          <Route
            path={NAVIGATION_PATHS.policy_delivery}
            element={<DeliveryPolicy />}
          />
        </Route>
        <Route
          path="*"
          element={
            <PageEmpty
              icon={TbError404}
              title="Page Not Found"
              text="We couldn't find the page you were looking for."
              linkPath={NAVIGATION_PATHS.home}
              linkText="Let's go home."
              is404={true}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
