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

// Third party
import PhoneNumberInput from 'react-phone-number-input/input';

// Components
import { PlaceholderProfileDesktop } from '../../components/placeholder/placeholder';

// Exports
import { formatPhoneNumber } from '../../exports/functions';

// Styles
import './profile.desktop.scss';

function ProfileDesktop(props) {
  return props.profileLoading ? (
    <PlaceholderProfileDesktop />
  ) : (
    <Grid templateRows="repeat(4, 1fr)" templateColumns="repeat(2, 1fr)">
      <GridItem rowSpan={2} colSpan={1}>
        <Center h="100%">
          <Avatar
            className="profile-avatar"
            referrerPolicy="no-referrer"
            size="2xl"
            bg={props.photoURL && 'none'}
            name={props.displayName ? props.displayName : ''}
            src={props.photoURL ? props.photoURL : ''}
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
              props.setFormInput({
                ...props.formInput,
                email: e.target.value
              })
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
          <FormLabel>Phone Number</FormLabel>
          <PhoneNumberInput
            country="US"
            placeholder="(555) 555-5555"
            inputComponent={Input}
            focusBorderColor="#f7d794"
            value={props.phoneNumber ? props.phoneNumber : ''}
            onChange={(value) =>
              props.setFormInput({ ...props.formInput, phoneNumber: value })
            }
          />
          <Button
            className="profile-form-update-button"
            size="sm"
            isLoading={props.updatePhoneLoading}
            onClick={props.handlePhoneNumberUpdate}
          >
            Update Phone Number
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

      <GridItem rowSpan={1} colSpan={1}>
        {props.displayName && (
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
        {props.email && (
          <Center>
            <div className="profile-email-container">
              <h1 className="profile-email">{props.email}</h1>
            </div>
          </Center>
        )}
        {props.phoneNumber && (
          <Center>
            <div className="profile-phone-container">
              <h1 className="profile-phone">
                {formatPhoneNumber(props.phoneNumber)}
              </h1>
            </div>
          </Center>
        )}
      </GridItem>
    </Grid>
  );
}

export default ProfileDesktop;
