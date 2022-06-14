// React Redux
import { useSelector } from 'react-redux';

// Bootstrap
import { Container } from 'react-bootstrap';

// Chakra
import { Avatar, Center, Grid, GridItem } from '@chakra-ui/react';

// Slices
import { selectUser } from '../../redux/slices/userSlice';

// Styles
import './profile.scss';

function Profile() {
  const user = useSelector(selectUser);

  return (
    <Container className="profile-container">
      <Grid templateRows="repeat(3, 1fr)" templateColumns="repeat(2, 1fr)">
        <GridItem rowSpan={1} colSpan={1}>
          <Center h="100%">
            <Avatar
              size="2xl"
              bg={user && user.photoURL && 'none'}
              name={user && user.displayName ? user.displayName : ''}
              src={user && user.photoURL ? user.photoURL : ''}
            />
          </Center>
        </GridItem>

        <GridItem rowSpan={2} bg="tomato"></GridItem>

        <GridItem>
          {user.displayName && (
            <Center>
              <div className="profile-name-container">
                <h1 className="profile-name">{user.displayName}</h1>
              </div>
            </Center>
          )}
          {user.email && (
            <Center>
              <div className="profile-email-container">
                <h1 className="profile-email">{user.email}</h1>
              </div>
            </Center>
          )}
        </GridItem>
      </Grid>
    </Container>
  );
}

export default Profile;
