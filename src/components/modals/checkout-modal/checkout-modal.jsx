// React
import { useState } from 'react';

// React Redux
import { useSelector } from 'react-redux';

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

// Components
import Checkout from '../../checkout/checkout';
import CheckoutSuccess from '../../checkout-success/checkout-success';

// Slices
import { selectEmail } from '../../../redux/slices/userSlice';

// Exports
import { NAVIGATION_PATHS } from '../../../exports/constants';

// Styles
import './checkout-modal.scss';

function CheckoutModal(props) {
  const navigate = useNavigate();

  const userEmail = useSelector(selectEmail);

  const [email, setEmail] = useState(userEmail ? userEmail : '');

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.handleCheckoutModalClose}
        closeOnOverlayClick={false}
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(8px)" />
        <ModalContent>
          <ModalHeader>Checkout</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            {props.orderSucceeded ? (
              <CheckoutSuccess email={email} orderId={'12345'} />
            ) : (
              <>
                <p className="checkout-margin-bottom">
                  Fill out your payment information below in order to place your
                  order.
                </p>

                <Checkout
                  email={email}
                  setEmail={setEmail}
                  setOrderSucceeded={props.setOrderSucceeded}
                />
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CheckoutModal;
