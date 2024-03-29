// React
import { useEffect, useState } from 'react';

// React Router
import { Link, useNavigate } from 'react-router-dom';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Icons
import { IoMdLock } from 'react-icons/io';

// Chakra
import {
  Button,
  Center,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  useToast
} from '@chakra-ui/react';

// Firebase
import {
  addOrder,
  addUserToPromoCode,
  updateUser
} from '../../utils/firebase/firebase';

// Stripe
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Third party
import PhoneNumberInput from 'react-phone-number-input/input';

// Slices
import {
  selectDisplayName,
  selectPhoneNumber,
  selectStripeCustomerId,
  selectUser,
  setPhoneNumber,
  setStripeCustomerId
} from '../../redux/slices/userSlice';
import {
  selectCartProducts,
  selectCartTotal,
  selectDiscountTotal,
  selectOrderDescription,
  selectOrderMetaData,
  selectPromoCode,
  setPromoCode,
  setCartTotal
} from '../../redux/slices/cartSlice';
import { selectProducts } from '../../redux/slices/inventorySlice';

// Exports
import { NAVIGATION_PATHS } from '../../exports/constants';
import {
  addDecimalToNumber,
  getProduct,
  validateEmail,
  validatePhoneNumber
} from '../../exports/functions';

// Images
import PoweredByStripeImg from '../../assets/images/stripe.png';
import SecureImg from '../../assets/images/secure.png';

// Styles
import './checkout.scss';

function Checkout(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toast = useToast();

  const stripe = useStripe();
  const elements = useElements();

  const user = useSelector(selectUser);
  const stripeCustomerId = useSelector(selectStripeCustomerId);
  const products = useSelector(selectProducts);
  const cartProducts = useSelector(selectCartProducts);
  const userDisplayName = useSelector(selectDisplayName);
  const userPhoneNumber = useSelector(selectPhoneNumber);
  const total = useSelector(selectCartTotal);
  const discountTotal = useSelector(selectDiscountTotal);
  const promoCode = useSelector(selectPromoCode);
  const orderDescription = useSelector(selectOrderDescription);
  const orderMetaData = useSelector(selectOrderMetaData);

  const [name, setName] = useState(userDisplayName ? userDisplayName : '');
  const [nameInvalid, setNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [phone, setPhone] = useState(userPhoneNumber ? userPhoneNumber : '');
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [cardError, setCardError] = useState('');
  const [cardEmpty, setCardEmpty] = useState(true);
  const [policyChecked, setPolicyChecked] = useState(false);
  const [policyCheckInvalid, setPolicyCheckInvalid] = useState(false);
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

  // If there is no total set, redirect to the cart page
  useEffect(() => {
    if (total <= 0) navigate(`/${NAVIGATION_PATHS.cart}`);
  }, [total, navigate]);

  // Reset all invalid states to defaults
  function resetInvalidStatesToDefaults() {
    setNameInvalid(false);
    setEmailInvalid(false);
    setPhoneInvalid(false);
    setCardError('');
    setPolicyCheckInvalid(false);
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
    if (!props.email || props.email === '' || !validateEmail(props.email)) {
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
    if (!policyChecked) {
      setPolicyCheckInvalid(true);
      formValid = false;
    }

    return formValid;
  }

  // Handles showing messages to the user or doing other things depending
  // on if the payment succeeds or fails.
  async function handlePaymentResult(paymentResult) {
    let title = '';
    let description = '';
    let status = 'error';

    if (paymentResult.error) {
      title = 'Payment Failed';
      description = `${paymentResult.error.message}`;
    } else {
      if (paymentResult.paymentIntent.status === 'succeeded') {
        handlePaymentSuccess(paymentResult.paymentIntent);
        return;
      } else {
        title = 'Payment Processing';
        description =
          'Your payment requires additional processing. Please contact support for assistance.';
        status = 'info';
      }
    }

    toast({
      title: title,
      description: description,
      status: status,
      duration: 7000,
      isClosable: true
    });
  }

  // Handles what happens when the payment was successful
  async function handlePaymentSuccess(paymentIntent) {
    if (user) {
      const orderId = await addOrder(
        user.uid,
        cartProducts.map((c) => c.id),
        Number(discountTotal),
        paymentIntent.id,
        Number(total)
      );

      if (promoCode) {
        await addUserToPromoCode(user.uid, promoCode.id).then((res) => {
          dispatch(setPromoCode(null));
        });
      }

      props.setOrderId(orderId);
      props.setOrderSucceeded(true);
    }
  }

  // Creates a new Stripe customer
  async function createCustomer() {
    try {
      const response = await fetch('/.netlify/functions/create-customer', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email: props.email,
          phone
        })
      });

      const { customer } = await response.json();
      const customerId = customer.id;

      await updateUser(user.uid, { stripe_customer_id: customerId }).then(
        (res) => dispatch(setStripeCustomerId(customerId))
      );

      return customerId;
    } catch (err) {
      return null;
    }
  }

  // Retrieves a payment intent given the ID
  async function retrievePaymentIntent(paymentIntentId) {
    try {
      const response = await fetch(
        '/.netlify/functions/retrieve-payment-intent',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntentId
          })
        }
      );

      return await response.json();
    } catch (err) {
      return null;
    }
  }

  // Creates an order given the customer ID
  async function createStripeOrder(customerId) {
    const line_items = cartProducts.map((item) => {
      const product = getProduct(products, item.product);
      return {
        product: product.stripe_product_id,
        quantity: item.quantity
      };
    });

    try {
      const response = await fetch('/.netlify/functions/create-order', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: customerId,
          description: orderDescription,
          line_items,
          metadata: orderMetaData,
          promotion_code: promoCode ? promoCode.stripe_promo_code_id : ''
        })
      });

      return await response.json();
    } catch (err) {
      return null;
    }
  }

  // Submits an order given the order ID
  async function submitStripeOrder(orderId, amountTotal) {
    // const totalWithoutDecimal = `${total}`.replace('.', '');

    try {
      const response = await fetch('/.netlify/functions/submit-order', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId,
          total: amountTotal
        })
      });

      return await response.json();
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // Handles submitting the payment
  async function submitPayment() {
    if (!isFormValid()) return;

    // Everything is valid so reset all invalid states to defaults
    resetInvalidStatesToDefaults();

    setPlacingOrder(true);

    await updateUser(user.uid, { phone_number: phone }).then((res) =>
      dispatch(setPhoneNumber(phone))
    );

    let customerId = stripeCustomerId;
    if (!customerId) {
      customerId = await createCustomer(customerId);
    }

    try {
      const { order } = await createStripeOrder(customerId);
      dispatch(setCartTotal(addDecimalToNumber(order.amount_total)));

      const submittedOrder = await submitStripeOrder(
        order.id,
        order.amount_total
      );
      const { paymentIntent } = await retrievePaymentIntent(
        submittedOrder.payment.payment_intent
      );

      const paymentResult = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name,
              email: props.email,
              phone
            }
          },
          receipt_email: props.email
        }
      );

      handlePaymentResult(paymentResult);
      setPlacingOrder(false);
    } catch (err) {
      handlePaymentResult({ error: 'failed' });
      setPlacingOrder(false);
    }
  }

  return (
    <div className="checkout-payment-container">
      <FormControl
        className="checkout-margin-bottom"
        isRequired
        isInvalid={nameInvalid}
        isDisabled={placingOrder}
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
        isDisabled={placingOrder}
      >
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="john.doe@gmail.com"
          value={props.email ? props.email : ''}
          onFocus={() => setEmailInvalid(false)}
          onChange={(e) => props.setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl
        className="checkout-margin-bottom"
        isRequired
        isInvalid={phoneInvalid}
        isDisabled={placingOrder}
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

      <FormControl isRequired isDisabled={placingOrder}>
        <FormLabel>Credit Card</FormLabel>
        <CardElement
          options={card_options}
          onChange={(e) => {
            setCardError(e.error ? e.error.message : '');
            setCardEmpty(e.empty);
          }}
        />
        <FormHelperText>
          We do not store your credit card information. It is handled 100% via
          Stripe.
        </FormHelperText>
        <FormHelperText className="checkout-card-error-text">
          {cardError}
        </FormHelperText>
      </FormControl>

      <FormControl isRequired isInvalid={policyCheckInvalid}>
        <Checkbox
          className="checkout-policy-checkbox"
          size="md"
          isChecked={policyChecked}
          onChange={(e) => {
            setPolicyChecked(e.target.checked);
            e.target.checked && setPolicyCheckInvalid(false);
          }}
        >
          I affirm that I have read and agree with the{' '}
          <Link
            className="checkout-policy-link"
            target="_blank"
            to={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_cancellation}`}
          >
            cancellation policy
          </Link>
          ,{' '}
          <Link
            className="checkout-policy-link"
            target="_blank"
            to={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_delivery}`}
          >
            delivery policy
          </Link>
          , and{' '}
          <Link
            className="checkout-policy-link"
            target="_blank"
            to={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_refund_return}`}
          >
            refund/return policy
          </Link>
          .
        </Checkbox>
      </FormControl>

      <div className="checkout-total-pay-container">
        <Heading>
          Total: <span>${total}</span>
        </Heading>
        <Button
          style={{ animation: placingOrder && 'unset' }}
          leftIcon={<Icon as={IoMdLock} w={5} h={5} />}
          spinnerPlacement="end"
          loadingText="Processing payment..."
          isLoading={placingOrder}
          onClick={submitPayment}
        >
          Submit Order
        </Button>
      </div>

      <div className="checkout-logos-container">
        <Center>
          <HStack>
            <Image
              boxSize="70px"
              objectFit="cover"
              src={SecureImg}
              alt="100% Secure"
            />
            <Image
              w="150px"
              objectFit="cover"
              src={PoweredByStripeImg}
              alt="Powered by Stripe"
            />
          </HStack>
        </Center>
      </div>
    </div>
  );
}

export default Checkout;
