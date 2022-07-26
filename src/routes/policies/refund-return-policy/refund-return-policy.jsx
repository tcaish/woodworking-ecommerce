// React Router
import { Link } from 'react-router-dom';

// Chakra
import { Divider, Heading, Text } from '@chakra-ui/react';

// Exports
import { NAVIGATION_PATHS } from '../../../exports/constants';

function RefundReturnPolicy() {
  return (
    <div className="main-container">
      <Heading>Refund/Return Policy</Heading>
      <Text fontSize="lg">
        We appreciate you shopping at Caish Workshop. If you are not entirely
        satisfied with your purchase, we are more than happy to help!
      </Text>

      <Divider marginTop="20px" marginBottom="20px" />

      <Heading fontSize="2xl">Returns</Heading>
      <Text fontSize="lg" marginBottom="10px">
        You have <Text as="mark">14 calendar days</Text> to return an item from
        the date you received it. To be eligible for a return, your item must be
        in the same condition that you received it. You also will need to have
        the receipt or proof of purchase.
      </Text>
      <Text fontSize="lg" marginBottom="20px">
        You can also ask for a new build of the item if it does not meet your
        expectations in place of a return/refund. We will work out what was
        wrong with the first build and come to a consensus on what the build was
        supposed to be and go from there.
      </Text>

      <Heading fontSize="xl">How to Return an Item</Heading>
      <Text fontSize="lg" marginBottom="20px">
        You cannot ship the item back to us. We will communicate on the best way
        for us to meet in person to do the exchange as long as you meet the
        requirements in the return policy stated above.
      </Text>

      <Heading fontSize="2xl">Refunds</Heading>
      <Text fontSize="lg" marginBottom="20px">
        Once we receive your item, we will inspect it and make sure it complies
        with out return policy above. We will immediately notify you on the
        status of your refund after inspecting the item. If your return is
        approved, we will initiate a refund to your credit card (or original
        method of payment). You will receive the credit within a certain amount
        of days, depending on your card issuer's policies.
      </Text>

      <Heading fontSize="2xl">Contact Us</Heading>
      <Text fontSize="lg">
        If you have any questions regarding the above policies, please reach out
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

export default RefundReturnPolicy;
