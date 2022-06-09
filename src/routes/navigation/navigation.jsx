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

// Styles
import './navigation.scss';

// import { ReactComponent as CrownLogo } from '../../assets/crown.svg';

function Navigation() {
  const user = useSelector(selectUser);

  return (
    <Container>
      <Navbar bg="light" expand="lg">
        <Container>
          <Link className="navbar-link" to="/">
            <Navbar.Brand>Woodworking Logo</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link className="nav-link" to="/">
                Link
              </Link>

              <NavDropdown title="Dropdown">
                <Link className="dropdown-item" to="/">
                  Action
                </Link>
                <NavDropdown.Divider />
                <Link className="dropdown-item" to="/">
                  Action
                </Link>
              </NavDropdown>
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
    </Container>
  );
}

export default Navigation;
