// React Router
import { useNavigate } from 'react-router-dom';

// React Icons
import { BsArrowLeftShort } from 'react-icons/bs';

// Chakra
import { Button, Icon } from '@chakra-ui/react';

// Styles
import './back-button.scss';

function BackButton({ path }) {
  const navigate = useNavigate();

  return (
    <div className="back-button-container">
      <Button variant="link" onClick={() => navigate(path)}>
        <Icon as={BsArrowLeftShort} w={6} h={6} />
        Go Back
      </Button>
    </div>
  );
}

export default BackButton;
