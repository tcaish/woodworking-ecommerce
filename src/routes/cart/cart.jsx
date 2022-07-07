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

// Components
import CartItem from '../../components/cart-item/cart-item';
import { PlaceholderCartItem } from '../../components/placeholder/placeholder';

// Styles
import './cart.scss';

function Cart() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const cartProducts = useSelector(selectCartProducts);
  const products = useSelector(selectProducts);

  const [productsLoading, setProductsLoading] = useState(false);
  const [cartProductsLoading, setCartProductsLoading] = useState(false);

  // Fetches and stores the products if not already done
  useEffect(() => {
    if (products.length === 0) {
      setProductsLoading(true);

      getProducts().then((res) => {
        setProductsLoading(false);
        dispatch(setProducts(res));
      });
    }
  }, [dispatch, products.length]);

  // Brings down the user's cart if it hasn't been loaded already
  useEffect(() => {
    if (cartProducts.length === 0 && user) {
      setCartProductsLoading(true);

      getCartProducts(user.uid).then((res) => {
        dispatch(setCartProducts(res));
        setCartProductsLoading(false);
      });
    }
  }, [cartProducts.length, user, dispatch]);

  // Returns the product given a product ID
  function getProduct(productId) {
    return products.filter((product) => product.id === productId)[0];
  }

  return (
    <Container className="main-container cart-container">
      <Row>
        <Col xs={12} md={7}>
          {!productsLoading && !cartProductsLoading ? (
            <div className="cart-items-container">
              {cartProducts.length > 0 &&
                cartProducts.map((cartProduct, index) => (
                  <CartItem
                    key={index}
                    getProduct={getProduct}
                    cartProduct={cartProduct}
                  />
                ))}
            </div>
          ) : (
            <PlaceholderCartItem />
          )}
        </Col>

        <Col>
          {!productsLoading && !cartProductsLoading ? (
            <h1>Checkout details</h1>
          ) : (
            <h1>Loading</h1>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
