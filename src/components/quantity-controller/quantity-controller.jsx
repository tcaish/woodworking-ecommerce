// Chakra
import { Button } from '@chakra-ui/react';

// Styles
import './quantity-controller.scss';

function QuantityController({ quantity, setQuantity }) {
  // Handles updating the quantity of the item to add to cart
  function handleUpdateQuantity(increase) {
    if (quantity === 1 && !increase) return;
    const newQuantity = increase ? quantity + 1 : quantity - 1;
    setQuantity(newQuantity);
  }

  return (
    <div className="quantity-controller-container">
      <Button
        className="quantity-controller-button"
        variant="unstyled"
        onClick={() => handleUpdateQuantity(false)}
      >
        {'-'}
      </Button>
      <span className="quantity-controller-number">{quantity}</span>
      <Button
        className="quantity-controller-button"
        variant="unstyled"
        onClick={() => handleUpdateQuantity(true)}
      >
        {'+'}
      </Button>
    </div>
  );
}

export default QuantityController;
