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

      <Heading className="checkout-success-heading-hooray">Horray! 🎉</Heading>
      <Heading fontSize="3xl">Your order was placed.</Heading>
      <Text className="checkout-success-text-order-id" fontSize="2xl">
        <span>Order ID</span>: {props.orderId}
      </Text>
      <Text fontSize="2xl">
        We have sent an order confirmation to {props.email}.
      </Text>
    </div>
  );
}

export default CheckoutSuccess;
