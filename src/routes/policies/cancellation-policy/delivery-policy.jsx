// React Router
import { Link } from 'react-router-dom';

// Chakra
import { Divider, Heading, Text } from '@chakra-ui/react';

// Exports
import { NAVIGATION_PATHS } from '../../../exports/constants';

function DeliveryPolicy() {
  return (
    <div className="main-container">
      <Heading>Delivery Policy</Heading>

      <Divider marginTop="20px" marginBottom="20px" />

      <Text fontSize="lg" marginBottom="10px">
        Given that the items on our website are handmade and possibly big, it is
        risky to deliver via a shipping method. We prefer to handle our business
        in person. This means that{' '}
        <Text as="mark">
          we will deliver our products to you at an agreed upon location
        </Text>{' '}
        that works for you and our delivery team. We will reach out to you via
        email when your item is ready to go, and that is when we will discuss
        time and location for the exchange.
      </Text>
      <Text fontSize="lg" marginBottom="20px">
        We only deliver to those that are willing to meet within a{' '}
        <Text as="mark">50-mile</Text> distance from where we are based, which
        is <Text as="mark">Spotsylvania, Virginia</Text>. If we need to drive
        further than that, we will charge a delivery fee of{' '}
        <Text as="mark">$0.75</Text> cents per extra mile we will have to drive.
      </Text>

      <Heading fontSize="2xl">Contact Us</Heading>
      <Text fontSize="lg">
        If you have any questions regarding the above policy, please reach out
        to us!{' '}
        <Link
          className="policy-support-link"
          to={`/${NAVIGATION_PATHS.support}`}
        >
          Go to support page.
        </Link>
      </Text>
    </div>
  );
}

export default DeliveryPolicy;
