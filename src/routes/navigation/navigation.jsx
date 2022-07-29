// React
import { useEffect, useState } from 'react';

// React Router
import { Link, Outlet, useNavigate } from 'react-router-dom';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Icons
import { IoCartOutline } from 'react-icons/io5';

// Bootstrap
import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

// Chakra
import { Avatar, IconButton, Spinner } from '@chakra-ui/react';

// Firebase
import {
  getAdvertisablePromoCode,
  getCartProducts,
  signOutUser
} from '../../utils/firebase/firebase';

// Slices
import {
  selectUser,
  selectDisplayName,
  selectPhotoURL,
  setUser,
  setPhoneNumber,
  setStripeCustomerId
} from '../../redux/slices/userSlice';
import { selectScreenWidth } from '../../redux/slices/screenSlice';
import {
  selectCartProducts,
  selectCartQuantity,
  setCartProducts
} from '../../redux/slices/cartSlice';
import { setOrders } from '../../redux/slices/ordersSlice';

// Components
import Footer from '../../components/footer/footer';
import PromoCodeBanner from '../../components/promo-code-banner/promo-code-banner';

// Images
import Logo from '../../assets/images/logo/logo_yellow_symbol.png';

// Exports
import { MAX_DELAY, NAVIGATION_PATHS } from '../../exports/constants';

// Styles
import './navigation.scss';
import './navigation.mobile.scss';

function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const displayName = useSelector(selectDisplayName);
  const photoURL = useSelector(selectPhotoURL);
  const screenWidth = useSelector(selectScreenWidth);
  const cartProducts = useSelector(selectCartProducts);
  const cartQuantity = useSelector(selectCartQuantity);

  const [advertisablePromoCode, setAdvertisablePromoCode] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Brings down the user's cart if it hasn't been loaded already
  useEffect(() => {
    if (cartProducts.length === 0 && user)
      getCartProducts(user.uid).then((res) => dispatch(setCartProducts(res)));
  }, [cartProducts.length, user, dispatch]);

  // Fetches any promo code that is advertisable and not expired
  useEffect(() => {
    getAdvertisablePromoCode().then((res) => {
      setAdvertisablePromoCode(res);

      const delay = res.ends.toDate().getTime() - Date.now();

      // Remove alert when promo code expires
      if (delay < MAX_DELAY) {
        setTimeout(() => {
          setAdvertisablePromoCode(null);
        }, delay);
      }
    });
  }, []);

  // Handles what happens when a dropdown menu item is selected
  function handleDropdownItemSelect(eventKey) {
    navigate(eventKey);
    setExpanded(false);
  }

  // Handles signing the user out
  async function handleSigningOut() {
    if (signingOut) return;

    setSigningOut(true);

    await signOutUser()
      .then((res) => {
        setExpanded(false);

        dispatch(setCartProducts([]));
        dispatch(setOrders([]));
        dispatch(setPhoneNumber(''));
        dispatch(setStripeCustomerId(''));
        dispatch(setUser(null));

        setSigningOut(false);
      })
      .catch((err) => {
        setSigningOut(false);
      });
  }

  return (
    <Container fluid={screenWidth <= 767 ? 'true' : 'sm'}>
      <Navbar expand="lg" sticky="top" expanded={expanded}>
        <Container>
          <Link
            className="navbar-link"
            to="/"
            onClick={() => setExpanded(false)}
          >
            <Navbar.Brand>
              <img
                className="navbar-logo d-inline-block align-top"
                src={Logo}
                alt="Caish Workshop Logo"
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(expanded ? false : 'expanded')}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link
                className="nav-link"
                to={NAVIGATION_PATHS.shop}
                onClick={() => setExpanded(false)}
              >
                Furniture
              </Link>
              <Link
                className="nav-link disabled-link"
                to={`${NAVIGATION_PATHS.shop}/${NAVIGATION_PATHS.shop_custom}`}
                onClick={() => setExpanded(false)}
              >
                Custom Builds
              </Link>
              <Link
                className="nav-link disabled-link"
                to={`${NAVIGATION_PATHS.shop}/${NAVIGATION_PATHS.shop_restoration}`}
                onClick={() => setExpanded(false)}
              >
                Restoration
              </Link>
            </Nav>
            <Nav onSelect={handleDropdownItemSelect}>
              <NavDropdown
                className="avatar-dropdown-link"
                title={
                  <Avatar
                    size="md"
                    referrerPolicy="no-referrer"
                    bg={photoURL && photoURL !== '' ? 'none' : null}
                    name={displayName ? displayName : ''}
                    src={photoURL ? photoURL : ''}
                  />
                }
              >
                <NavDropdown.Item
                  eventKey={
                    user ? NAVIGATION_PATHS.profile : NAVIGATION_PATHS.sign_in
                  }
                >
                  {user ? 'Profile' : 'Sign In'}
                </NavDropdown.Item>

                {user && (
                  <NavDropdown.Item eventKey={NAVIGATION_PATHS.orders}>
                    Orders
                  </NavDropdown.Item>
                )}

                {user && (
                  <NavDropdown.Item
                    eventKey={NAVIGATION_PATHS.home}
                    onClick={handleSigningOut}
                  >
                    Sign Out {signingOut && <Spinner size="sm" />}
                  </NavDropdown.Item>
                )}
              </NavDropdown>
              <Link
                className="navbar-right-link nav-link"
                to={NAVIGATION_PATHS.cart}
                onClick={() => setExpanded(false)}
              >
                <div className="cart-container">
                  <IconButton
                    variant="outline"
                    colorScheme="green"
                    aria-label="Cart"
                    size="lg"
                    fontSize="25px"
                    icon={<IoCartOutline />}
                  />
                  {cartProducts.length > 0 && (
                    <Badge pill text="dark">
                      {cartQuantity}
                    </Badge>
                  )}
                </div>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {advertisablePromoCode && (
        <PromoCodeBanner promoCode={advertisablePromoCode} />
      )}

      <Outlet />
      <Footer />
    </Container>
  );
}

export default Navigation;
