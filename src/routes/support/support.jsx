// React
import { createRef, useEffect, useState } from 'react';

// React Redux
import { useSelector } from 'react-redux';

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

// Third party
import Recaptcha from 'react-google-recaptcha';

// Slices
import { selectDisplayName, selectEmail } from '../../redux/slices/userSlice';

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
  const toast = useToast();

  const name = useSelector(selectDisplayName);
  const email = useSelector(selectEmail);

  const recaptchaRef = createRef();
  const [formInput, setFormInput] = useState(defaultFormInput);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
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

    const recaptchaValue = recaptchaRef.current.getValue();

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
          <Heading>Contact Us</Heading>
          <Text className="support-margin-bottom">
            If you're having an issue with any aspect of this website or your
            account, please reach out to us via the contact form below. We will
            get back to you within 1-2 business days!
          </Text>

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

            <FormControl className="support-margin-bottom" isRequired>
              <FormLabel as="legend">Type of Issue</FormLabel>
              <Select
                name="issue[]"
                placeholder="Select type of issue"
                variant="filled"
                onChange={(e) =>
                  setFormInput({ ...formInput, issue: e.target.value })
                }
                value={formInput.issue}
              >
                <option value="Products">Products</option>
                <option value="Orders">Orders</option>
                <option value="Profile">Profile</option>
                <option value="Website">Website</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>

            <FormControl className="support-margin-bottom" isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea
                name="message"
                placeholder="Tell us the problem you are experiencing..."
                variant="filled"
                onChange={(e) =>
                  setFormInput({ ...formInput, message: e.target.value })
                }
                value={formInput.message}
              />
            </FormControl>

            <FormControl className="support-margin-bottom">
              <Recaptcha
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                size="normal"
                onChange={() => setRecaptchaVerified(true)}
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
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default Support;
