// React Router
import { Link, Outlet } from 'react-router-dom';

// React Redux
import { useSelector } from 'react-redux';

// React Icons
import { IoCartOutline } from 'react-icons/io5';

// Bootstrap
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

// Chakra
import { Avatar, IconButton } from '@chakra-ui/react';

// Firebase
import { signOutUser } from '../../utils/firebase/firebase';

// Slices
import { selectUser } from '../../redux/slices/userSlice';

// Components
import Footer from '../../components/footer/footer';

// Images
import Logo from '../../assets/images/logo/logo-horiz-yellow.png';

// Styles
import './navigation.scss';

function Navigation() {
  const user = useSelector(selectUser);

  // Hides the dropdown menu when clicking a menu item button
  function hideDropdown() {
    const dropdownDiv = document.getElementsByClassName('dropdown')[0];
    const dropdownMenu = document.getElementsByClassName('dropdown-menu')[0];
    dropdownDiv.classList.remove('show');
    dropdownMenu.classList.remove('show');
  }

  return (
    <Container>
      <Navbar expand="lg">
        <Container>
          <Link className="navbar-link" to="/">
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
              <Link className="nav-link" to="/shop">
                Furniture
              </Link>
              <Link className="nav-link" to="/shop/custom">
                Custom Builds
              </Link>
              <Link className="nav-link" to="/shop/restoration">
                Restoration
              </Link>
            </Nav>
            <Nav>
              <NavDropdown
                className="avatar-dropdown-link"
                title={
                  <Avatar
                    size="md"
                    bg={user && user.photoURL && 'none'}
                    name={user && user.displayName ? user.displayName : ''}
                    src={user && user.photoURL ? user.photoURL : ''}
                  />
                }
              >
                <Link
                  className="navbar-right-link dropdown-item"
                  to={user ? '/profile' : '/sign-in'}
                  onClick={hideDropdown}
                >
                  {user ? 'Profile' : 'Sign In'}
                </Link>

                {user && (
                  <Link className="dropdown-item" to="/" onClick={signOutUser}>
                    Sign Out
                  </Link>
                )}
              </NavDropdown>
              <Link className="navbar-right-link nav-link" to="/cart">
                <IconButton
                  variant="outline"
                  colorScheme="green"
                  aria-label="Cart"
                  size="lg"
                  fontSize="25px"
                  icon={<IoCartOutline />}
                />
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
