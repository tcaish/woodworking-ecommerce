// React
import { useEffect, useState } from 'react';

// React Router
import { Link, Outlet } from 'react-router-dom';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Icons
import { IoCartOutline } from 'react-icons/io5';

// Bootstrap
import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

// Chakra
import { Avatar, IconButton, Spinner } from '@chakra-ui/react';

// Firebase
import { getCartProducts, signOutUser } from '../../utils/firebase/firebase';

// Slices
import {
  selectUser,
  selectDisplayName,
  selectPhotoURL,
  setUser
} from '../../redux/slices/userSlice';
import { selectScreenWidth } from '../../redux/slices/screenSlice';
import {
  selectCartProducts,
  selectCartQuantity,
  setCartProducts
} from '../../redux/slices/cartSlice';

// Components
import Footer from '../../components/footer/footer';

// Images
import Logo from '../../assets/images/logo/logo-horiz-yellow.png';

// Exports
import { NAVIGATION_PATHS } from '../../exports/constants';

// Styles
import './navigation.scss';
import './navigation.mobile.scss';

function Navigation() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const displayName = useSelector(selectDisplayName);
  const photoURL = useSelector(selectPhotoURL);
  const screenWidth = useSelector(selectScreenWidth);
  const cartProducts = useSelector(selectCartProducts);
  const cartQuantity = useSelector(selectCartQuantity);

  const [signingOut, setSigningOut] = useState(false);

  // Brings down the user's cart if it hasn't been loaded already
  useEffect(() => {
    if (cartProducts.length === 0 && user)
      getCartProducts(user.uid).then((res) => dispatch(setCartProducts(res)));
  }, [cartProducts.length, user, dispatch]);

  // Hides the dropdown menu when clicking a menu item button
  function hideDropdown() {
    const dropdownDiv = document.getElementsByClassName('dropdown')[0];
    const dropdownMenu = document.getElementsByClassName('dropdown-menu')[0];
    dropdownDiv.classList.remove('show');
    dropdownMenu.classList.remove('show');
  }

  // Collapses the navbar when on mobile if it is not collapsed
  function collapseNavbar() {
    const navbarToggler = document.getElementsByClassName('navbar-toggler')[0];
    const navbarCollapse =
      document.getElementsByClassName('navbar-collapse')[0];

    // If navbar is not collapsed
    if (navbarToggler.classList.length === 1) {
      navbarToggler.classList.add('collapsed');
      navbarCollapse.classList.remove('show');
    }
  }

  // Handles signing the user out
  async function handleSigningOut() {
    if (signingOut) return;

    setSigningOut(true);

    await signOutUser()
      .then((res) => {
        collapseNavbar();

        dispatch(setCartProducts([]));
        dispatch(setUser(null));

        setSigningOut(false);
      })
      .catch((err) => {
        setSigningOut(false);
      });
  }

  return (
    <Container fluid={screenWidth <= 767 ? 'true' : 'sm'}>
      <Navbar expand="lg">
        <Container>
          <Link className="navbar-link" to="/" onClick={collapseNavbar}>
            <Navbar.Brand>
              <img
                className="navbar-logo d-inline-block align-top"
                src={Logo}
                alt="Caish Workshop Logo"
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link
                className="nav-link"
                to={NAVIGATION_PATHS.shop}
                onClick={collapseNavbar}
              >
                Furniture
              </Link>
              <Link
                className="nav-link"
                to={`${NAVIGATION_PATHS.shop}/${NAVIGATION_PATHS.shop_custom}`}
                onClick={collapseNavbar}
              >
                Custom Builds
              </Link>
              <Link
                className="nav-link"
                to={`${NAVIGATION_PATHS.shop}/${NAVIGATION_PATHS.shop_restoration}`}
                onClick={collapseNavbar}
              >
                Restoration
              </Link>
            </Nav>
            <Nav>
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
                <Link
                  className="navbar-right-link dropdown-item"
                  to={
                    user ? NAVIGATION_PATHS.profile : NAVIGATION_PATHS.sign_in
                  }
                  onClick={() => {
                    hideDropdown();
                    collapseNavbar();
                  }}
                >
                  {user ? 'Profile' : 'Sign In'}
                </Link>

                {user && (
                  <Link
                    className="dropdown-item"
                    to={NAVIGATION_PATHS.home}
                    onClick={handleSigningOut}
                  >
                    Sign Out {signingOut && <Spinner size="sm" />}
                  </Link>
                )}
              </NavDropdown>
              <Link
                className="navbar-right-link nav-link"
                to={NAVIGATION_PATHS.cart}
                onClick={collapseNavbar}
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
      <Outlet />
      <Footer />
    </Container>
  );
}

export default Navigation;
