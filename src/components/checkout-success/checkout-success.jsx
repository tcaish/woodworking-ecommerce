// Chakra
import { Heading, Text } from '@chakra-ui/react';

// Components
import SuccessAnimation from '../success-animation/success-animation';

// Styles
import './checkout-success.scss';

function CheckoutSuccess(props) {
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
