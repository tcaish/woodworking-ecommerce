// React Router
import { Link } from 'react-router-dom';

// Chakra
import { Divider, Heading, Text } from '@chakra-ui/react';

// Exports
import { NAVIGATION_PATHS } from '../../../exports/constants';

function CancellationPolicy() {
  return (
    <div className="main-container">
      <Heading>Cancellation Policy</Heading>
      <Text fontSize="lg">
        Since we are building items from scratch when orders are made, it is
        important that cancellations are made with haste, if needed.
      </Text>

      <Divider marginTop="20px" marginBottom="20px" />

      <Text fontSize="lg" marginBottom="5px">
        Cancellations made <Text as="u">before</Text>{' '}
        <Text as="mark">24 hours</Text> (1 day) of your purchase date/time will
        receive a 100% refund.
      </Text>
      <Text fontSize="lg" marginBottom="5px">
        Cancellations made <Text as="u">within</Text>{' '}
        <Text as="mark">24-72 hours</Text> (1-3 days) of your purchase date/time
        will incur a 30% fee of your total purchase and the remainder will be
        refunded.
      </Text>
      <Text fontSize="lg" marginBottom="20px">
        Cancellations made <Text as="u">after</Text>{' '}
        <Text as="mark">72 hours</Text> (3 days) of your purchase will incur a
        50% fee of your total purchase and the remainder will be refunded.
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

export default CancellationPolicy;
