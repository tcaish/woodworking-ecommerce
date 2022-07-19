// React Router
import { useNavigate } from 'react-router-dom';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Icons
import { BsArrowLeftShort } from 'react-icons/bs';

// Chakra
import { Button, Icon } from '@chakra-ui/react';

// Slices
import {
  selectProducts,
  setFilteredProducts
} from '../../redux/slices/inventorySlice';

// Styles
import './back-button.scss';

function BackButton({ path }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector(selectProducts);

  return (
    <div className="back-button-container">
      <Button
        variant="link"
        onClick={() => {
          dispatch(setFilteredProducts(products));
          navigate(path);
        }}
      >
        <Icon as={BsArrowLeftShort} w={6} h={6} />
        Go Back
      </Button>
    </div>
  );
}

export default BackButton;
