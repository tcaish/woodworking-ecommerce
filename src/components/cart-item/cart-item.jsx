// React
import { useEffect, useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Chakra
import { Button, useDisclosure, useToast } from '@chakra-ui/react';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// Firebase
import { removeCartItem } from '../../utils/firebase/firebase';

// Slices
import { selectUser } from '../../redux/slices/userSlice';
import { selectCartQuantity, setPromoCode } from '../../redux/slices/cartSlice';
import { selectProducts } from '../../redux/slices/inventorySlice';

// Components
import EditCartItemModal from '../modals/edit-cart-item-modal/edit-cart-item-modal';

// Exports
import { getProduct } from '../../exports/functions';

// Styles
import './cart-item.scss';

function CartItem(props) {
  const dispatch = useDispatch();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const user = useSelector(selectUser);
  const products = useSelector(selectProducts);
  const cartQuantity = useSelector(selectCartQuantity);

  const [product, setProduct] = useState(null);
  const [removingItem, setRemovingItem] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Sets the product specified in the cart product object when available
  useEffect(() => {
    const productObj = getProduct(products, props.cartProduct.product);
    productObj && setProduct(productObj);
  }, [props, products]);

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

        // If there is 1 cart product, then we're removing the last cart item.
        // Remove promo code since there are no more cart products.
        if (cartQuantity <= 1) {
          dispatch(setPromoCode(null));
        }

        toast({
          title: 'Successfully Removed from Cart',
          description: `${props.cartProduct.quantity} ${
            props.cartProduct.quantity === 1 ? 'order' : 'orders'
          } of ${
            getProduct(products, props.cartProduct.product).title
          } were removed from your cart.`,
          status: 'success',
          duration: 7000,
          isClosable: true
        });
      })
      .catch((err) => {
        console.log(err);
        setRemovingItem(false);

        toast({
          title: 'Failed to Remove Item',
          description:
            'There was an error removing your item from your cart. Please try again later.',
          status: 'error',
          duration: 7000,
          isClosable: true
        });
      });
  }

  return (
    <>
      {product && (
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
                  backgroundImage: `url(${product.pictures[0]})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover'
                }}
              ></div>
              <div className="cart-item-details-container">
                <h1>{product.title}</h1>
                <h3>{props.cartProduct.color}</h3>
                <p>{props.cartProduct.notes}</p>

                <div className="cart-item-quantity-cost-container">
                  <p>{`Quantity: ${props.cartProduct.quantity}`}</p>
                  <h2>{`$${(
                    product.totalCost() * props.cartProduct.quantity
                  ).toFixed(2)}`}</h2>
                </div>

                <div className="cart-item-actions-container">
                  <Button
                    variant="link"
                    onClick={() => {
                      setShowModal(true);
                      onOpen();
                    }}
                  >
                    Edit
                  </Button>
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
      )}

      {showModal && (
        <EditCartItemModal
          user={user}
          cartProduct={props.cartProduct}
          product={product}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      )}
    </>
  );
}

export default CartItem;
