// React
import { useEffect } from 'react';

// React Redux
import { useSelector } from 'react-redux';

// Chakra
import { Heading, Text } from '@chakra-ui/react';

// Firebase
import { removeAllCartItems } from '../../utils/firebase/firebase';

// Components
import SuccessAnimation from '../success-animation/success-animation';

// Slices
import { selectUser } from '../../redux/slices/userSlice';

// Styles
import './checkout-success.scss';

function CheckoutSuccess(props) {
  const user = useSelector(selectUser);

  // Remove all cart items when success component shows
  useEffect(() => {
    user && removeAllCartItems(user.uid);
  }, [user]);

  return (
    <div className="checkout-success-container">
      <SuccessAnimation />

      <Heading className="checkout-success-heading-hooray">Hooray! 🎉</Heading>
      <Heading fontSize="3xl">Your order was placed.</Heading>
      <Text
        className="checkout-success-text-order-id checkout-success-text-bold"
        fontSize="2xl"
      >
        <span>Order ID</span>: {props.orderId}
      </Text>
      <Text className="checkout-success-text-bold" fontSize="2xl">
        We have sent an order confirmation to <span>{props.email}</span>.
      </Text>
    </div>
  );
}

export default CheckoutSuccess;
