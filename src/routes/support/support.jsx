// React
import { useEffect, useState } from 'react';

// React Redux
import { useSelector } from 'react-redux';

// React Router
import { useParams } from 'react-router-dom';

// Chakra
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/react';

// Bootstrap
import { Col, Container, Row } from 'react-bootstrap';

// Firebase
import { getOrder } from '../../utils/firebase/firebase';

// Third party
import Recaptcha from 'react-google-recaptcha';

// Components
import { PlaceholderSupport } from '../../components/placeholder/placeholder';

// Slices
import {
  selectDisplayName,
  selectEmail,
  selectUser
} from '../../redux/slices/userSlice';
import { selectOrders } from '../../redux/slices/ordersSlice';

// Styles
import './support.scss';

const defaultFormInput = {
  name: '',
  email: '',
  issue: '',
  message: '',
  'form-name': 'contact' // Netlify attribute
};

const RECAPTCHA_SITE_KEY = '6LcuXh0hAAAAAA6HUMcO2JdGxJNcTQKIGaeDgzoA';

function Support() {
  const params = useParams();
  const toast = useToast();

  const user = useSelector(selectUser);
  const orders = useSelector(selectOrders);
  const name = useSelector(selectDisplayName);
  const email = useSelector(selectEmail);

  const [selectedOrder, setSelectedOrder] = useState(
    orders.filter((order) =>
      params.orderId ? order.id === params.orderId : null
    )[0]
  );
  const [formInput, setFormInput] = useState(defaultFormInput);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Update form when user details become available if user is logged in
  useEffect(() => {
    setFormInput({
      ...formInput,
      name: name ? name : '',
      email: email ? email : ''
    });
    // eslint-disable-next-line
  }, [name, email]);

  // Fetches the order if there are no orders loaded
  useEffect(() => {
    // If order ID is in URL, there's a user, and there are no orders
    if (params.orderId && user && orders.length === 0) {
      setLoading(true);

      getOrder(user.uid, params.orderId).then((res) => {
        setSelectedOrder(res);
        setLoading(false);
      });
    }
    // eslint-disable-next-line
  }, [user]);

  // Submits the contact form
  async function submitForm(e) {
    e.preventDefault();

    if (
      !formInput.name ||
      !formInput.email ||
      !formInput.message ||
      !recaptchaVerified
    )
      return;

    setSubmitting(true);

    await fetch('/', {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formInput).toString()
    })
      .then((res) => {
        setSubmitting(false);

        setFormInput(defaultFormInput);
        setRecaptchaVerified(false);

        toast({
          title: 'Message Sent Successfully',
          description:
            'Your message has been submitted successfully. Please allow 1-2 business days for a response!',
          status: 'success',
          duration: 7000,
          isClosable: true
        });
      })
      .catch((err) => {
        setSubmitting(false);
        toast({
          title: 'Message Failed to Send',
          description:
            'There was an error sending your message. Please try again later.',
          status: 'error',
          duration: 7000,
          isClosable: true
        });
      });
  }
  return (
    <Container className="main-container">
      <Row className="support-container">
        <Col></Col>
        <Col sm={12} lg={5}>
          <Heading>{selectedOrder ? 'Request a Refund' : 'Contact Us'}</Heading>
          <Text className="support-margin-bottom">
            {selectedOrder
              ? 'We understand things happen! Refunds are fulfilled for any legitimate reason. Fill out the information below with a reason for your request for a refund, and we will get back to you within 1-2 business days!'
              : "If you're having an issue with any aspect of this website or your account, please reach out to us via the contact form below. We will get back to you within 1-2 business days!"}
          </Text>

          {loading ? (
            <PlaceholderSupport />
          ) : (
            <form className="support-form" method="post" onSubmit={submitForm}>
              <input type="hidden" name="form-name" value="contact" />

              <FormControl className="support-margin-bottom" isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  placeholder="e.g. John Doe"
                  variant="filled"
                  onChange={(e) =>
                    setFormInput({ ...formInput, name: e.target.value })
                  }
                  value={formInput.name}
                />
              </FormControl>

              <FormControl className="support-margin-bottom" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="e.g. john.doe@gmail.com"
                  variant="filled"
                  onChange={(e) =>
                    setFormInput({ ...formInput, email: e.target.value })
                  }
                  value={formInput.email}
                />
              </FormControl>

              <FormControl
                className="support-margin-bottom"
                isRequired
                isDisabled={selectedOrder}
              >
                <FormLabel as="legend">Type of Issue</FormLabel>
                <Select
                  name="issue[]"
                  placeholder="Select type of issue"
                  variant="filled"
                  onChange={(e) =>
                    setFormInput({ ...formInput, issue: e.target.value })
                  }
                  value={selectedOrder ? 'Request Refund' : formInput.issue}
                >
                  <option value="Orders">Orders</option>
                  <option value="Products">Products</option>
                  <option value="Profile">Profile</option>
                  {selectedOrder && (
                    <option value="Request Refund">Request Refund</option>
                  )}
                  <option value="Website">Website</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>

              {selectedOrder && (
                <FormControl
                  className="support-margin-bottom"
                  isRequired
                  isDisabled={true}
                >
                  <FormLabel>Order ID</FormLabel>
                  <Input
                    name="order_id"
                    variant="filled"
                    value={selectedOrder.id}
                  />
                </FormControl>
              )}

              <FormControl className="support-margin-bottom" isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea
                  name="message"
                  placeholder={
                    selectedOrder
                      ? 'Why are you requesting a refund?'
                      : 'Tell us the problem you are experiencing...'
                  }
                  variant="filled"
                  onChange={(e) =>
                    setFormInput({ ...formInput, message: e.target.value })
                  }
                  value={formInput.message}
                />
              </FormControl>

              <FormControl className="support-margin-bottom">
                <Recaptcha
                  sitekey={RECAPTCHA_SITE_KEY}
                  size="normal"
                  onChange={() => setRecaptchaVerified(true)}
                  onExpired={() => setRecaptchaVerified(false)}
                />
                {!recaptchaVerified && (
                  <FormHelperText className="recaptcha-helper-text">
                    Please verify you are not a robot.
                  </FormHelperText>
                )}
              </FormControl>

              <Button isLoading={submitting} type="submit">
                Submit
              </Button>
            </form>
          )}
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default Support;
