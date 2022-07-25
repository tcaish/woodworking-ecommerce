// React
import { useEffect, useState } from 'react';

// React Redux
import { useSelector } from 'react-redux';

// Chakra
import {
  Button,
  FormControl,
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

// Slices
import { selectDisplayName, selectEmail } from '../../redux/slices/userSlice';

// Styles
import './support.scss';

const defaultFormInput = {
  name: '',
  email: '',
  issue: 'Products',
  message: '',
  'form-name': 'contact'
};

function Support() {
  const toast = useToast();

  const name = useSelector(selectDisplayName);
  const email = useSelector(selectEmail);

  const [formInput, setFormInput] = useState(defaultFormInput);
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

    if (!formInput.name || !formInput.email || !formInput.message) return;

    setSubmitting(true);

    await fetch('/', {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formInput).toString()
    })
      .then((res) => {
        setSubmitting(false);
        setFormInput(defaultFormInput);
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
            If you're having an issue with any aspect of this website, please
            reach out to us via the contact form below. We will get back to you
            within 1-2 business days!
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
