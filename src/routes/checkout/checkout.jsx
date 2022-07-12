// Chakra
import { Button } from '@chakra-ui/react';

// Stripe
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Col, Row } from 'react-bootstrap';

// Styles
import './checkout.scss';

function Checkout() {
  const stripe = useStripe();
  const elements = useElements();

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
          <CardElement />
          <Button onClick={paymentHandler}>Pay Now</Button>
        </Col>
        <Col>Test</Col>
      </Row>
    </div>
  );
}

export default Checkout;
