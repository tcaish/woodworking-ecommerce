// React
import { useEffect, useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Bootstrap
import { Col, Container, Row } from 'react-bootstrap';

// Slices
import { selectProducts, setProducts } from '../../redux/slices/inventorySlice';
import {
  selectCartProducts,
  setCartProducts
} from '../../redux/slices/cartSlice';
import { selectUser } from '../../redux/slices/userSlice';

// Firebase
import { getCartProducts, getProducts } from '../../utils/firebase/firebase';

// Styles
import './cart.scss';
import { Button } from '@chakra-ui/react';

function Cart() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const cartProducts = useSelector(selectCartProducts);
  const products = useSelector(selectProducts);

  // Fetches and stores the products if not already done
  useEffect(() => {
    // setPageLoading(true);

    if (products.length === 0) {
      getProducts().then((res) => {
        // setPageLoading(false);
        dispatch(setProducts(res));
      });
    }
  }, [dispatch, products.length]);

  // Brings down the user's cart if it hasn't been loaded already
  useEffect(() => {
    if (cartProducts.length === 0 && user)
      getCartProducts(user.uid).then((res) => dispatch(setCartProducts(res)));
  }, [cartProducts.length, user, dispatch]);

  // Returns the product given a product ID
  function getProduct(productId) {
    return products.filter((product) => product.id === productId)[0];
  }

  return (
    <Container className="main-container cart-container">
      <Row>
        <Col xs={12} md={7}>
          <div className="cart-items-container">
            {cartProducts.length > 0 &&
              cartProducts.map((cartProduct, index) => (
                <Row key={index}>
                  <Col>
                    <div className="cart-item-container">
                      <div
                        className="cart-item-image-container"
                        style={{
                          backgroundImage: `url(${
                            getProduct(cartProduct.product).pictures[0]
                          })`,
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover'
                        }}
                      ></div>
                      <div className="cart-item-details-container">
                        <h1>{getProduct(cartProduct.product).title}</h1>
                        <h3>{cartProduct.color}</h3>
                        <p>{cartProduct.notes}</p>

                        <div className="cart-item-quantity-cost-container">
                          <p>{`Quantity: ${cartProduct.quantity}`}</p>
                          <h2>{`$${getProduct(
                            cartProduct.product
                          ).totalCost()}`}</h2>
                        </div>

                        <div className="cart-item-actions-container">
                          <Button variant="link">Edit</Button>
                          <span>{'• '}</span>
                          <Button variant="link">Remove</Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              ))}
          </div>
        </Col>

        <Col>Checkout details</Col>
      </Row>
    </Container>
  );
}

export default Cart;
