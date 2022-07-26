// React Icons
import { TiCancel } from 'react-icons/ti';
import { TbTruckDelivery } from 'react-icons/tb';
import { MdPrivacyTip } from 'react-icons/md';
import { RiRefund2Line } from 'react-icons/ri';

// Chakra
import { Heading, List } from '@chakra-ui/react';

// Exports
import { NAVIGATION_PATHS } from '../../exports/constants';

// Styles
import './policies.scss';
import CustomListItem from '../../components/list-item/list-item';

function Policies() {
  return (
    <div className="main-container">
      <Heading className="policy-heading">Policies</Heading>
      <List spacing={3}>
        <CustomListItem
          title="Cancellation"
          icon={TiCancel}
          iconColor="rgb(203, 0, 0);"
          linkPath={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_cancellation}`}
        />
        <CustomListItem
          title="Delivery"
          icon={TbTruckDelivery}
          iconColor="#7F5112"
          linkPath={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_delivery}`}
        />
        <CustomListItem
          title="Privacy"
          icon={MdPrivacyTip}
          iconColor="rgb(85, 85, 255)"
          linkPath={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_privacy}`}
        />
        <CustomListItem
          title="Refunds &amp; Returns"
          icon={RiRefund2Line}
          iconColor="rgb(0, 161, 0)"
          linkPath={`/${NAVIGATION_PATHS.policies}/${NAVIGATION_PATHS.policy_refund_return}`}
        />
      </List>
    </div>
  );
}

export default Policies;
