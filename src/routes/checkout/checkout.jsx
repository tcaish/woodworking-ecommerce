// React
import { useEffect, useState } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// React Redux
import { useSelector } from 'react-redux';

// React Icons
import { IoMdLock } from 'react-icons/io';

// Chakra
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input
} from '@chakra-ui/react';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// Firebase
import { updateUser } from '../../utils/firebase/firebase';

// Stripe
import {
  CardElement,
  useStripe,
  useElements,
  PaymentElement
} from '@stripe/react-stripe-js';

// Third party
import PhoneNumberInput from 'react-phone-number-input/input';

// Slices
import { selectPhoneNumber, selectUser } from '../../redux/slices/userSlice';
import { selectCartTotal } from '../../redux/slices/cartSlice';

// Exports
import { NAVIGATION_PATHS } from '../../exports/constants';
import { validateEmail, validatePhoneNumber } from '../../exports/functions';

// Styles
import './checkout.scss';

function Checkout() {
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const user = useSelector(selectUser);
  const phoneNumber = useSelector(selectPhoneNumber);
  const total = useSelector(selectCartTotal);

  const [name, setName] = useState(user && user.displayName);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [email, setEmail] = useState(user && user.email);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [phone, setPhone] = useState(phoneNumber ? phoneNumber : '');
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [cardError, setCardError] = useState('');
  const [cardEmpty, setCardEmpty] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

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

  useEffect(() => {
    if (total <= 0) navigate(`/${NAVIGATION_PATHS.cart}`);
  }, [total, navigate]);

  // Reset all invalid states to defaults
  function resetInvalidStatesToDefaults() {
    setNameInvalid(false);
    setEmailInvalid(false);
    setPhoneInvalid(false);
    setCardError('');
  }

  // Returns whether or not the inputs are invalid in order to submit form
  function isFormValid() {
    let formValid = true;

    if (!stripe || !elements) {
      formValid = false;
    }

    if (!name || name === '') {
      setNameInvalid(true);
      formValid = false;
    }
    if (!email || email === '' || !validateEmail(email)) {
      setEmailInvalid(true);
      formValid = false;
    }
    if (!phone || phone === '' || !validatePhoneNumber(phone)) {
      setPhoneInvalid(true);
      formValid = false;
    }
    if (cardError || cardEmpty) {
      !cardError && setCardError('Please enter your credit card information.');
      formValid = false;
    }

    return formValid;
  }

  async function paymentHandler() {
    if (!isFormValid()) return;

    // Everything is valid so reset all invalid states to defaults
    resetInvalidStatesToDefaults();

    await updateUser(user.uid, { phoneNumber: phone })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    setPlacingOrder(true);

    try {
      const totalWithoutDecimal = `${total}`.replace('.', '');
      console.log(totalWithoutDecimal);
      const response = await fetch(
        '/.netlify/functions/create-payment-intent',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount: totalWithoutDecimal })
        }
      );
      const content = await response.json();
      console.log(content);

      const client_secret = `${content.paymentIntent.client_secret}`;
      const paymentResult = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
            email,
            phone
          }
        }
      });

      if (paymentResult.error) {
        alert(paymentResult.error.message);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          console.log(paymentResult.paymentIntent);
          alert('payment successful');
        }
      }

      setPlacingOrder(false);
    } catch (err) {
      console.log(err);
      setPlacingOrder(false);
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

            <FormControl
              className="checkout-margin-bottom"
              isRequired
              isInvalid={nameInvalid}
            >
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                placeholder="John Doe"
                value={name ? name : ''}
                onFocus={() => setNameInvalid(false)}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl
              className="checkout-margin-bottom"
              isRequired
              isInvalid={emailInvalid}
            >
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="john.doe@gmail.com"
                value={email ? email : ''}
                onFocus={() => setEmailInvalid(false)}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl
              className="checkout-margin-bottom"
              isRequired
              isInvalid={phoneInvalid}
            >
              <FormLabel>Phone Number</FormLabel>
              <PhoneNumberInput
                country="US"
                placeholder="(555) 555-5555"
                inputComponent={Input}
                value={phone ? phone : ''}
                onFocus={() => setPhoneInvalid(false)}
                onChange={(value) => setPhone(value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Credit Card</FormLabel>
              <CardElement
                options={card_options}
                onChange={(e) => {
                  setCardError(e.error ? e.error.message : '');
                  setCardEmpty(e.empty);
                }}
              />
              <FormHelperText className="checkout-card-error-text">
                {cardError}
              </FormHelperText>
            </FormControl>

            <div className="checkout-total-pay-container">
              <Heading>
                Total: <span>${total}</span>
              </Heading>
              <Button
                leftIcon={<Icon as={IoMdLock} w={5} h={5} />}
                isLoading={placingOrder}
                onClick={paymentHandler}
              >
                Place Your Order
              </Button>
            </div>
          </div>
        </Col>
        <Col>Test</Col>
      </Row>
    </div>
  );
}

export default Checkout;
