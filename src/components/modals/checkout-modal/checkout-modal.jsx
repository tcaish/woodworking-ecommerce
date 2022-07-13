// React
import { useState } from 'react';

// React Redux
import { useSelector } from 'react-redux';

// Chakra
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';

// Components
import Checkout from '../../checkout/checkout';
import CheckoutSuccess from '../../checkout-success/checkout-success';

// Slices
import { selectEmail } from '../../../redux/slices/userSlice';

// Styles
import './checkout-modal.scss';

function CheckoutModal(props) {
  const userEmail = useSelector(selectEmail);

  const [email, setEmail] = useState(userEmail ? userEmail : '');
  const [orderId, setOrderId] = useState('');

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
            {true ? (
              <CheckoutSuccess email={email} orderId={orderId} />
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
                  setOrderId={setOrderId}
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
