// React Router
import { Link } from 'react-router-dom';

// Chakra
import { Icon } from '@chakra-ui/react';

// Styles
import './list-item.scss';

function CustomListItem(props) {
  return (
    <div className="list-item-container">
      <Icon
        className="list-item-icon"
        as={props.icon}
        color={props.iconColor}
        w={9}
        h={9}
      />
      <Link className="list-item-link" to={props.linkPath}>
        {props.title}
      </Link>
    </div>
  );
}

export default CustomListItem;
