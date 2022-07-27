// Chakra
import { Heading } from '@chakra-ui/react';

// Exports
import { NAVIGATION_PATHS } from '../../exports/constants';

// Components
import PolicyLink from '../../components/policy-link/policy-link';

// Styles
import './policies.scss';

function Policies() {
  return (
    <div className="main-container">
      <Heading className="policy-heading">Policies</Heading>

      <PolicyLink
        className="policy-link"
        title="Cancellation"
        description="This describes under what conditions you can cancel your orders and how
        to go about it."
        linkPath={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_cancellation}`}
      />
      <PolicyLink
        className="policy-link"
        title="Delivery"
        description="This describes how and where our items are shipped and on what timeline."
        linkPath={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_delivery}`}
      />
      <PolicyLink
        className="policy-link"
        title="Privacy"
        description="Consumer data privacy is now a priority for legislation and governments around the world. Here, we clearly explain our website’s privacy policy so you can understand how your data is protected, used, and disclosed."
        linkPath={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_privacy}`}
      />
      <PolicyLink
        title="Refunds &amp; Returns"
        description="This describes under what conditions you can return items and be refunded."
        linkPath={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_refund_return}`}
      />
    </div>
  );
}

export default Policies;
