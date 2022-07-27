// React Router
import { Link } from 'react-router-dom';

// React Icons
import { MdOutlineOpenInNew } from 'react-icons/md';

// Chakra
import { Heading, Icon, Text } from '@chakra-ui/react';

// Styles
import './policy-link.scss';

function PolicyLink(props) {
  return (
    <div className={props.className}>
      <Heading size="md">
        <Link
          className="policy-support-link"
          target="_blank"
          to={props.linkPath}
        >
          {props.title}
        </Link>
        <Icon
          className="policy-support-icon"
          as={MdOutlineOpenInNew}
          w={4}
          h={4}
        />
      </Heading>
      <Text>{props.description}</Text>
    </div>
  );
}

export default PolicyLink;
