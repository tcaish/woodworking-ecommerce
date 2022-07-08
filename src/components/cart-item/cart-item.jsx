// React
import { useState } from 'react';

// React Redux
import { useSelector } from 'react-redux';

// Chakra
import { Button, useToast } from '@chakra-ui/react';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// Firebase
import { removeCartItem } from '../../utils/firebase/firebase';

// Slices
import { selectUser } from '../../redux/slices/userSlice';

// Styles
import './cart-item.scss';

function CartItem(props) {
  const toast = useToast();

  const user = useSelector(selectUser);

  const [removingItem, setRemovingItem] = useState(false);

  // Adds margin to the bottom of each cart item container if it's not
  // the last one in the list.
  function shouldAddMarginBottom() {
    return props.index !== props.cartProductsLength - 1;
  }

  // Handles removing an item from the cart
  async function handleRemovingCartProduct() {
    if (!user || !props.cartProduct) return;

    setRemovingItem(true);

    await removeCartItem(user.uid, props.cartProduct.id)
      .then((res) => {
        setRemovingItem(false);

        toast({
          title: 'Successfully Removed from Cart',
          description: `${props.cartProduct.quantity} ${
            props.cartProduct.quantity === 1 ? 'order' : 'orders'
          } of ${
            props.getProduct(props.cartProduct.product).title
          } were removed from your cart.`,
          status: 'success',
          duration: 6000,
          isClosable: true
        });
      })
      .catch((err) => {
        setRemovingItem(false);

        toast({
          title: 'Failed to Remove Item',
          description:
            'There was an error removing your item from your cart. Please try again later.',
          status: 'error',
          duration: 6000,
          isClosable: true
        });
      });
  }

  return (
    <Row>
      <Col>
        <div
          className={`cart-item-container ${
            shouldAddMarginBottom() && 'cart-item-margin-bottom'
          }`}
        >
          <div
            className="cart-item-image-container"
            style={{
              backgroundImage: `url(${
                props.getProduct(props.cartProduct.product).pictures[0]
              })`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          ></div>
          <div className="cart-item-details-container">
            <h1>{props.getProduct(props.cartProduct.product).title}</h1>
            <h3>{props.cartProduct.color}</h3>
            <p>{props.cartProduct.notes}</p>

            <div className="cart-item-quantity-cost-container">
              <p>{`Quantity: ${props.cartProduct.quantity}`}</p>
              <h2>{`$${(
                props.getProduct(props.cartProduct.product).totalCost() *
                props.cartProduct.quantity
              ).toFixed(2)}`}</h2>
            </div>

            <div className="cart-item-actions-container">
              <Button variant="link">Edit</Button>
              <span>{'• '}</span>
              <Button
                variant="link"
                isLoading={removingItem}
                onClick={handleRemovingCartProduct}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default CartItem;
