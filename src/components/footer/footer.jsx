// React Router
import { Link } from 'react-router-dom';

// React Icons
import { BsFacebook, BsInstagram, BsLinkedin } from 'react-icons/bs';

// Bootstrao
import { Container } from 'react-bootstrap';

// Chakra
import { Grid, GridItem, HStack } from '@chakra-ui/react';

// Exports
import { NAVIGATION_PATHS } from '../../exports/constants';

// Styles
import './footer.scss';
import './footer.mobile.scss';

function Footer() {
  return (
    <div className="footer-container">
      <Container>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem>Copyright © 2022 Caish Enterprises, LLC</GridItem>
          <GridItem className="footer-link-align-center">
            <Link to={`/${NAVIGATION_PATHS.support}`}>Support</Link>
            {' • '}
            <Link to={`/${NAVIGATION_PATHS.return}`}>Returns</Link>
          </GridItem>
          <GridItem className="footer-link-align-right">
            <HStack spacing="15px">
              <a href="/" target="_blank">
                <BsFacebook className="footer-social-icon" />
              </a>
              <a href="/" target="_blank">
                <BsInstagram className="footer-social-icon" />
              </a>
              <a href="/" target="_blank">
                <BsLinkedin className="footer-social-icon" />
              </a>
            </HStack>
          </GridItem>
        </Grid>
      </Container>
    </div>
  );
}

export default Footer;
