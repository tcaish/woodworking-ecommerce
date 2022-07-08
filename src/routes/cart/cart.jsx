// React
import { useEffect, useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Bootstrap
import { Col, Container, Row } from 'react-bootstrap';

// Chakra
import { Button, Center, Heading } from '@chakra-ui/react';

// Slices
import { selectProducts, setProducts } from '../../redux/slices/inventorySlice';
import {
  selectCartProducts,
  selectCartQuantity,
  setCartProducts
} from '../../redux/slices/cartSlice';
import { selectUser } from '../../redux/slices/userSlice';

// Firebase
import { getCartProducts, getProducts } from '../../utils/firebase/firebase';

// Components
import CartItem from '../../components/cart-item/cart-item';
import CartTotals from '../../components/cart-totals/cart-totals';
import {
  PlaceholderCartItem,
  PlaceholderCartTotals
} from '../../components/placeholder/placeholder';

// Styles
import './cart.scss';

function Cart() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const cartProducts = useSelector(selectCartProducts);
  const cartQuantity = useSelector(selectCartQuantity);
  const products = useSelector(selectProducts);

  const [productsLoading, setProductsLoading] = useState(false);
  const [cartProductsLoading, setCartProductsLoading] = useState(false);
  const [materialsTotal, setMaterialsTotal] = useState(0);
  const [laborTotal, setLaborTotal] = useState(0);
  const [total, setTotal] = useState(0);

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

  // Sets the materials, labor, and sub totals
  useEffect(() => {
    if (cartProducts.length > 0) {
      const mTotal = cartProducts.reduce((prevValue, cartProd) => {
        const product = getProduct(cartProd.product);
        return prevValue + product.cost.materials * cartProd.quantity;
      }, 0);
      const lTotal = cartProducts.reduce((prevValue, cartProd) => {
        const product = getProduct(cartProd.product);
        return prevValue + product.cost.labor * cartProd.quantity;
      }, 0);
      const total = mTotal + lTotal;

      setMaterialsTotal(mTotal.toFixed(2));
      setLaborTotal(lTotal.toFixed(2));
      setTotal(total.toFixed(2));
    }
    // eslint-disable-next-line
  }, [cartProducts.length, cartProducts]);

  // Returns the product given a product ID
  function getProduct(productId) {
    return products.filter((product) => product.id === productId)[0];
  }

  return (
    <Container className="main-container cart-container">
      <Center className="cart-heading">
        <Heading fontSize="3xl">
          Shopping Cart {cartQuantity > 0 && <span>({`${3} items`})</span>}
        </Heading>
      </Center>
      <Row>
        <Col xs={12} md={7}>
          {!productsLoading && !cartProductsLoading ? (
            <div className="cart-items-container">
              {cartProducts.length > 0 &&
                cartProducts.map((cartProduct, index) => (
                  <CartItem
                    key={index}
                    index={index}
                    getProduct={getProduct}
                    cartProduct={cartProduct}
                    cartProductsLength={cartProducts.length}
                  />
                ))}
            </div>
          ) : (
            <PlaceholderCartItem />
          )}
        </Col>

        <Col>
          {!productsLoading && !cartProductsLoading ? (
            <div className="cart-checkout-container">
              <CartTotals
                materialsTotal={materialsTotal}
                laborTotal={laborTotal}
                total={total}
              />

              <Button
                className="cart-checkout-button"
                variant="unstyled"
                onClick={() => console.log('proceed to checkout')}
              >
                Proceed to Checkout
              </Button>
            </div>
          ) : (
            <PlaceholderCartTotals />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
