// React
import { useEffect, useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Icons
import { IoMdLock } from 'react-icons/io';

// Bootstrap
import { Col, Container, Row } from 'react-bootstrap';

// Chakra
import { Button, Center, Heading, Icon, useDisclosure } from '@chakra-ui/react';

// Slices
import { selectProducts, setProducts } from '../../redux/slices/inventorySlice';
import {
  selectCartProducts,
  selectCartQuantity,
  selectPromoCode,
  setCartProducts,
  setCartTotal,
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
import CheckoutModal from '../../components/modals/checkout-modal/checkout-modal';

function Cart() {
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const user = useSelector(selectUser);
  const cartProducts = useSelector(selectCartProducts);
  const cartQuantity = useSelector(selectCartQuantity);
  const promoCode = useSelector(selectPromoCode);
  const products = useSelector(selectProducts);

  const [productsLoading, setProductsLoading] = useState(false);
  const [cartProductsLoading, setCartProductsLoading] = useState(false);
  const [materialsTotal, setMaterialsTotal] = useState(0);
  const [laborTotal, setLaborTotal] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderSucceeded, setOrderSucceeded] = useState(false);

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

  // Listen to real-time updates on the user's cart table
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

        // If there are cart products and the first one has a promo code
        if (cartProds.length > 0 && cartProds[0].promoCode) {
          getPromoCodeById(cartProds[0].promoCode).then((res) => {
            // If there is no error
            if (!res.error) {
              dispatch(setPromoCode(res));

              // Remove promo code when it expires
              setTimeout(() => {
                dispatch(setPromoCode(null));
              }, res.ends.toDate().getTime() - Date.now());
            }
          });
        }
      });

      // This is what gets ran when the user leaves this page
      return () => {
        // Remove the listener for ratings
        unsubscribe();
      };
    }
    // eslint-disable-next-line
  }, [user, dispatch]);

  // Sets the materials, labor, and sub totals
  useEffect(() => {
    if (cartProducts.length > 0) {
      const mTotal = cartProducts.reduce((prevValue, cartProd) => {
        const product = getProduct(cartProd.product);
        return product
          ? prevValue + product.cost.materials * cartProd.quantity
          : 0;
      }, 0);
      const lTotal = cartProducts.reduce((prevValue, cartProd) => {
        const product = getProduct(cartProd.product);
        return product ? prevValue + product.cost.labor * cartProd.quantity : 0;
      }, 0);
      const subtotal = mTotal + lTotal;

      setMaterialsTotal(mTotal.toFixed(2));
      setLaborTotal(lTotal.toFixed(2));

      if (promoCode) {
        const discount = (subtotal * promoCode.discount).toFixed(2);
        setDiscountTotal(discount);
        dispatch(setCartTotal((subtotal - discount).toFixed(2)));
      } else {
        dispatch(setCartTotal(subtotal.toFixed(2)));
      }
    }
    // eslint-disable-next-line
  }, [cartProducts.length, cartProducts, discountTotal, promoCode]);

  // Proceed to checkout
  function proceedToCheckout() {
    if (!cartProducts) return;
    setShowCheckoutModal(true);
    onOpen();
  }

  // Handles what happens when the checkout modal closes
  function handleCheckoutModalClose() {
    onClose();

    if (orderSucceeded) {
      setOrderSucceeded(false);

      // Remvoe all cart items from firebase
    }
  }

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
                  />

                  <Button
                    className="cart-checkout-button"
                    variant="solid"
                    leftIcon={<Icon as={IoMdLock} w={5} h={5} />}
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              ) : (
                <PlaceholderCartTotals />
              )}
            </Col>
          </Row>

          {showCheckoutModal && (
            <CheckoutModal
              isOpen={isOpen}
              onOpen={onOpen}
              handleCheckoutModalClose={handleCheckoutModalClose}
              setShowCheckoutModal={setShowCheckoutModal}
              orderSucceeded={orderSucceeded}
              setOrderSucceeded={setOrderSucceeded}
            />
          )}
        </>
      )}
    </Container>
  );
}

export default Cart;
