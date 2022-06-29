// Chakra
import { Button, Tooltip } from '@chakra-ui/react';

// Styles
import './add-to-cart-button.scss';

function AddToCartButton(props) {
  return (
    <>
      <Tooltip
        hasArrow
        shouldWrapChildren
        mt="5"
        label={
          !props.selectedProduct.availability
            ? 'This item is currently out of stock.'
            : 'This item is already in your cart.'
        }
        isDisabled={!props.isItemAlreadyInCart()}
      >
        <Button
          className="add-to-cart-button"
          size="lg"
          isLoading={props.addingToCart}
          isDisabled={
            props.isItemAlreadyInCart() || !props.selectedProduct.availability
          }
          onClick={props.handleAddToCart}
        >
          Add to Cart
        </Button>
      </Tooltip>
    </>
  );
}

export default AddToCartButton;
