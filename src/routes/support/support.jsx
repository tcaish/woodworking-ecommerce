// React
import { useEffect, useState } from 'react';

// React Redux
import { useSelector } from 'react-redux';

// Chakra
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Textarea
} from '@chakra-ui/react';

// Bootstrap
import { Container } from 'react-bootstrap';

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

const defaultInvalidFormInputs = {
  name: false,
  email: false,
  message: false
};

function Support() {
  const name = useSelector(selectDisplayName);
  const email = useSelector(selectEmail);

  const [formInput, setFormInput] = useState(defaultFormInput);
  const [invalidFormInputs, setInvalidFormInputs] = useState(
    defaultInvalidFormInputs
  );
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

  // Validates the form input
  function formIsValid() {
    let valid = true;

    if (!formInput.name || !formInput.email || !formInput.message) {
      valid = false;
    }

    setInvalidFormInputs({
      name: !formInput.name,
      email: !formInput.email,
      message: !formInput.message
    });

    return valid;
  }

  // Submits the contact form
  async function submitForm(e) {
    e.preventDefault();

    if (!formIsValid()) return;

    await fetch('/', {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formInput).toString()
    })
      .then((res) => {
        console.log('Form successfully submitted');
        setSubmitting(false);
      })
      .catch((error) => {
        setSubmitting(false);
        alert(error);
      });
  }
  return (
    <Container className="main-container">
      <form className="support-form" method="post" onSubmit={submitForm}>
        <input type="hidden" name="form-name" value="contact" />

        <FormControl
          className="support-margin-bottom"
          isRequired
          isInvalid={invalidFormInputs.name}
        >
          <FormLabel>Full Name</FormLabel>
          <Input
            type="text"
            name="name"
            placeholder="e.g. John Doe"
            onChange={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
            value={formInput.name}
          />
        </FormControl>

        <FormControl
          className="support-margin-bottom"
          isRequired
          isInvalid={invalidFormInputs.email}
        >
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="e.g. john.doe@gmail.com"
            onChange={(e) =>
              setFormInput({ ...formInput, email: e.target.value })
            }
            value={formInput.email}
          />
        </FormControl>

        <FormControl className="support-margin-bottom" as="fieldset" isRequired>
          <FormLabel as="legend">Type of Issue</FormLabel>
          <RadioGroup
            name="issue[]"
            onChange={(value) => setFormInput({ ...formInput, issue: value })}
            value={formInput.issue}
          >
            <HStack spacing="24px">
              <Radio value="Products">Products</Radio>
              <Radio value="Orders">Orders</Radio>
              <Radio value="Profile">Profile</Radio>
              <Radio value="Website">Website</Radio>
              <Radio value="Other">Other</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl
          className="support-margin-bottom"
          isRequired
          isInvalid={invalidFormInputs.message}
        >
          <FormLabel>Message</FormLabel>
          <Textarea
            name="message"
            placeholder="Tell us the problem you are experiencing..."
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
    </Container>
  );
}

export default Support;
