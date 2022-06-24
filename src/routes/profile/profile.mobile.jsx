// React Icons
import { BsCheck2 } from 'react-icons/bs';
import { FcCancel } from 'react-icons/fc';

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

// Styles
import './profile.mobile.scss';

function ProfileMobile(props) {
  return (
    <Grid templateRows="repeat(3, 1fr)" templateColumns="repeat(1, 1fr)">
      <GridItem rowSpan={1} colSpan={1}>
        <Center>
          <Avatar
            className="profile-avatar"
            referrerPolicy="no-referrer"
            size="2xl"
            bg={props.photoURL && 'none'}
            name={props.displayName ? props.displayName : ''}
            src={props.photoURL ? props.photoURL : ''}
          />
        </Center>

        <div className="profile-details-container">
          {props.user && (
            <Center>
              <div className="profile-name-container">
                <h1 className="profile-name">
                  {props.displayName
                    ? props.displayName
                    : `user-${props.user.uid.substring(0, 6)}`}
                </h1>
              </div>
            </Center>
          )}
          <Center>
            <div className="profile-email-container">
              <h1 className="profile-email">{props.email}</h1>
            </div>
          </Center>
        </div>
      </GridItem>

      <GridItem className="update-profile-container" rowSpan={2} colSpan={1}>
        <FormControl className="profile-form-control">
          <FormLabel>Full Name</FormLabel>
          <Input
            type="email"
            placeholder="e.g. John Doe"
            focusBorderColor="#f7d794"
            isDisabled={props.isInputDisabled('name')}
            value={
              props.formInput.displayName ? props.formInput.displayName : ''
            }
            onChange={(e) =>
              props.setFormInput({
                ...props.formInput,
                displayName: e.target.value
              })
            }
          />
          <Button
            className="profile-form-update-button"
            size="sm"
            isLoading={props.updateNameLoading}
            onClick={props.handleNameUpdate}
          >
            Update Name
          </Button>
        </FormControl>

        <FormControl className="profile-form-control">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="e.g. johndoe@gmail.com"
            focusBorderColor="#f7d794"
            value={props.formInput.email ? props.formInput.email : ''}
            onChange={(e) =>
              props.setFormInput({ ...props.formInput, email: e.target.value })
            }
            isDisabled={props.isInputDisabled('email')}
            isInvalid={props.formInput.email === ''}
          />

          {props.user &&
            props.user.providerData[0].providerId !== 'password' && (
              <FormHelperText>
                You cannot change your email when signed in via a provider.
              </FormHelperText>
            )}

          {props.user && !props.user.emailVerified ? (
            <FormHelperText>
              <Icon as={FcCancel} />
              <span className="profile-email-not-verified-text">
                Email not verified
              </span>
              {' | '}
              <Button
                variant="link"
                isDisabled={props.isInputDisabled('verify')}
                isLoading={props.verifyEmailLoading}
                onClick={() => props.handleVerificationEmail(false)}
              >
                Verify Email
              </Button>
            </FormHelperText>
          ) : (
            <FormHelperText>
              <Icon as={BsCheck2} color="green" />{' '}
              <span className="profile-email-verified-text">
                Email verified
              </span>
            </FormHelperText>
          )}
          <Button
            className="profile-form-update-button"
            size="sm"
            isLoading={props.updateEmailLoading}
            isDisabled={
              props.user && props.user.providerData[0].providerId !== 'password'
            }
            onClick={props.handleEmailUpdate}
          >
            Update Email
          </Button>
        </FormControl>

        <FormControl className="profile-form-control">
          <FormLabel>Password</FormLabel>
          <Button
            variant="link"
            isDisabled={props.isInputDisabled('password')}
            isLoading={props.resetPasswordLoading}
            onClick={props.handlePasswordResetEmail}
          >
            Send Reset Password Email
          </Button>
          {props.user &&
            props.user.providerData[0].providerId !== 'password' && (
              <FormHelperText>
                You cannot change your password when signed in via a provider.
              </FormHelperText>
            )}
        </FormControl>
      </GridItem>
    </Grid>
  );
}

export default ProfileMobile;
