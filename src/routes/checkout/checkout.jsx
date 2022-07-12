// Chakra
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input
} from '@chakra-ui/react';

// Stripe
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Col, Row } from 'react-bootstrap';

// Styles
import './checkout.scss';

function Checkout() {
  const stripe = useStripe();
  const elements = useElements();

  const card_options = {
    iconStyle: 'solid',
    style: {
      base: {
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '17px',
        fontSmoothing: 'antialiased'
      },
      invalid: {
        iconColor: 'rgb(207, 0, 0)',
        color: 'rgb(207, 0, 0)'
      }
    }
  };

  async function paymentHandler() {
    if (!stripe || !elements) return;

    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: 1500 })
    });
    const content = await response.json();

    const client_secret = `${content.paymentIntent.client_secret}`;
    const paymentResult = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Tim Caish'
        }
      }
    });

    if (paymentResult.error) {
      alert(paymentResult.error.message);
    } else {
      if (paymentResult.paymentIntent.status === 'succeeded') {
        alert('payment successful');
      }
    }
  }

  return (
    <div className="main-container">
      <Row>
        <Col>
          <div className="checkout-payment-container">
            <Heading className="checkout-margin-bottom" fontSize="2xl">
              Payment Info
            </Heading>

            <FormControl className="checkout-margin-bottom">
              <FormLabel>Full Name</FormLabel>
              <Input type="text" placeholder="John Doe" />
            </FormControl>

            <FormControl className="checkout-margin-bottom">
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="john.doe@gmail.com" />
            </FormControl>

            <FormControl className="checkout-margin-bottom">
              <FormLabel>Phone Number</FormLabel>
              <Input type="phone" placeholder="(555) 555-5555" />
            </FormControl>

            <FormControl>
              <FormLabel>Credit Card</FormLabel>
              <CardElement options={card_options} />
            </FormControl>
            <Button onClick={paymentHandler}>Pay Now</Button>
          </div>
        </Col>
        <Col>Test</Col>
      </Row>
    </div>
  );
}

export default Checkout;
