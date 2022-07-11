// React Router
import { useNavigate } from 'react-router-dom';

// Chakra
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';

// Exports
import { NAVIGATION_PATHS } from '../../../exports/constants';

// Styles
import './not-signed-in-modal.scss';

function NotSignedInModal(props) {
  const navigate = useNavigate();

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(8px)" />
        <ModalContent>
          <ModalHeader>Not Signed In</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            In order to checkout, you need to sign in or create an account. It
            only takes a few minutes!
          </ModalBody>

          <ModalFooter>
            <Button
              className="sign-in-modal-button"
              mr={3}
              onClick={() => navigate(`/${NAVIGATION_PATHS.sign_in}`)}
            >
              Sign In
            </Button>
            <Button
              mr={3}
              colorScheme="green"
              onClick={() => navigate(`/${NAVIGATION_PATHS.sign_up}`)}
            >
              Create Account
            </Button>
            <Button onClick={props.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NotSignedInModal;
