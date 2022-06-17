// React
import { useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Icons
import { BsCheck2 } from 'react-icons/bs';
import { FcCancel } from 'react-icons/fc';

// Bootstrap
import { Container } from 'react-bootstrap';

// Chakra
import {
  Avatar,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  Input
} from '@chakra-ui/react';

// Firebase
import { auth, updateUserProfile } from '../../utils/firebase/firebase';

// Slices
import { selectUser, setUser } from '../../redux/slices/userSlice';

// Styles
import './profile.scss';

function Profile() {
  const dispatch = useDispatch();
  let user = useSelector(selectUser);

  const [formInput, setFormInput] = useState(user);

  async function submitProfileUpdate() {
    if (formInput.email === '') {
      return;
    }

    let newUser = auth.currentUser;

    await updateUserProfile(newUser, {
      displayName: formInput.displayName,
      email: formInput.email
    })
      .then(() => {
        dispatch(setUser(formInput));
      })
      .catch((err) => console.log(err));
  }

  return (
    <Container className="main-container profile-container">
      <Grid templateRows="repeat(4, 1fr)" templateColumns="repeat(2, 1fr)">
        <GridItem rowSpan={2} colSpan={1}>
          <Center h="100%">
            <Avatar
              size="2xl"
              bg={user && user.photoURL && 'none'}
              name={user && user.displayName ? user.displayName : ''}
              src={user && user.photoURL ? user.photoURL : ''}
            />
          </Center>
        </GridItem>

        <GridItem className="update-profile-container" rowSpan={4}>
          <h1 className="profile-update-header">Update Profile</h1>

          <FormControl className="profile-form-control">
            <FormLabel>Full Name</FormLabel>
            <Input
              type="email"
              placeholder="e.g. John Doe"
              focusBorderColor="#f7d794"
              value={formInput.displayName}
              onChange={(e) =>
                setFormInput({ ...formInput, displayName: e.target.value })
              }
            />
            <FormHelperText>Optional</FormHelperText>
          </FormControl>

          <FormControl className="profile-form-control">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="e.g. johndoe@gmail.com"
              focusBorderColor="#f7d794"
              value={formInput.email}
              onChange={(e) =>
                setFormInput({ ...formInput, email: e.target.value })
              }
              isDisabled={
                user.providerData[0].providerId !== 'password' ? true : false
              }
              isInvalid={formInput.email === ''}
            />

            {user.providerData[0].providerId !== 'password' && (
              <FormHelperText>
                You cannot change your email when signed in via a provider.
              </FormHelperText>
            )}

            {!user.emailVerified ? (
              <FormHelperText>
                <Icon as={FcCancel} />
                <span className="profile-email-not-verified-text">
                  Email not verified
                </span>
                {' | '}
                <Button variant="link">Verify Email</Button>
              </FormHelperText>
            ) : (
              <FormHelperText>
                <Icon as={BsCheck2} color="green" />{' '}
                <span className="profile-email-verified-text">
                  Email verified
                </span>
              </FormHelperText>
            )}
          </FormControl>

          <FormControl className="profile-form-control">
            <FormLabel>Password</FormLabel>
            <Button variant="link">Send Reset Password Email</Button>
          </FormControl>

          <Button
            className="profile-form-update-button"
            onClick={submitProfileUpdate}
          >
            Update Profile
          </Button>
        </GridItem>

        <GridItem rowSpan={1} colSpan={1}>
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
