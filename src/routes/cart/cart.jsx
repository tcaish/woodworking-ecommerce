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
  selectPromoCode,
  setCartProducts,
  setPromoCode
} from '../../redux/slices/cartSlice';
import { selectUser } from '../../redux/slices/userSlice';

// Firebase
import {
  firestore,
  getProducts,
  getPromoCodeById
} from '../../utils/firebase/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

// Components
import CartItem from '../../components/cart-item/cart-item';
import CartTotals from '../../components/cart-totals/cart-totals';
import {
  PlaceholderCartItem,
  PlaceholderCartTotals
} from '../../components/placeholder/placeholder';
import CartEmpty from '../../components/cart-empty/cart-empty';

// Exports
import { cartProductConverter } from '../../classes/CartProduct';

// Styles
import './cart.scss';

function Cart() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const cartProducts = useSelector(selectCartProducts);
  const cartQuantity = useSelector(selectCartQuantity);
  const promoCode = useSelector(selectPromoCode);
  const products = useSelector(selectProducts);

  const [productsLoading, setProductsLoading] = useState(false);
  const [cartProductsLoading, setCartProductsLoading] = useState(false);
  const [materialsTotal, setMaterialsTotal] = useState(0);
  const [laborTotal, setLaborTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);

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

  // Listen to real-time updates on ratings table
  useEffect(() => {
    if (user) {
      cartQuantity === 0 && setCartProductsLoading(true);

      const q = query(
        collection(firestore, 'users', user.uid, 'cart').withConverter(
          cartProductConverter
        )
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let cartProds = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          cartProds.push(data);
        });

        setCartProductsLoading(false);
        dispatch(setCartProducts(cartProds));

        if (cartProds.length > 0 && cartProds[0].promoCode) {
          getPromoCodeById(cartProds[0].promoCode).then((res) =>
            dispatch(setPromoCode(res))
          );
        }
      });

      // This is what gets ran when the user leaves this page
      return () => {
        // Remove the listener for ratings
        unsubscribe();
      };
    }
  }, [user, dispatch, cartQuantity]);

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

      if (promoCode) {
        const discount = (total * promoCode.discount).toFixed(2);
        setDiscountTotal(discount);
        setTotal((total - discount).toFixed(2));
      } else {
        setTotal(total.toFixed(2));
      }
    }
    // eslint-disable-next-line
  }, [cartProducts.length, cartProducts, discountTotal, promoCode]);

  // Returns the product given a product ID
  function getProduct(productId) {
    return products.filter((product) => product.id === productId)[0];
  }

  return (
    <Container className="main-container cart-container">
      {cartProducts.length === 0 ? (
        <CartEmpty />
      ) : (
        <>
          <Center className="cart-heading">
            <Heading fontSize="3xl">
              Shopping Cart{' '}
              {cartQuantity > 0 && <span>({`${cartQuantity} items`})</span>}
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
                    discountTotal={discountTotal}
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
        </>
      )}
    </Container>
  );
}

export default Cart;
