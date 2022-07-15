// React
import { useEffect, useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Icons
import { IoMdLock } from 'react-icons/io';

// Bootstrap
import { Col, Container, Row } from 'react-bootstrap';

// Chakra
import {
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Image,
  useDisclosure
} from '@chakra-ui/react';

// Slices
import { selectProducts, setProducts } from '../../redux/slices/inventorySlice';
import {
  selectCartProducts,
  selectCartQuantity,
  selectDiscountTotal,
  selectPromoCode,
  setCartProducts,
  setCartTotal,
  setDiscountTotal,
  setOrderDescription,
  setOrderMetaData,
  setPromoCode
} from '../../redux/slices/cartSlice';
import { selectUser } from '../../redux/slices/userSlice';

// Firebase
import {
  firestore,
  getProducts,
  getPromoCodeById,
  removeAllCartItems
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
import CheckoutModal from '../../components/modals/checkout-modal/checkout-modal';

// Exports
import { cartProductConverter } from '../../classes/CartProduct';

// Images
import CustSatisfactionImg from '../../assets/images/cust_satisfaction_guaranteed.png';
import MoneyBackImg from '../../assets/images/money_back_guaranteed.png';

// Styles
import './cart.scss';

function Cart() {
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const user = useSelector(selectUser);
  const cartProducts = useSelector(selectCartProducts);
  const cartQuantity = useSelector(selectCartQuantity);
  const promoCode = useSelector(selectPromoCode);
  const products = useSelector(selectProducts);
  const discountTotal = useSelector(selectDiscountTotal);

  const [productsLoading, setProductsLoading] = useState(false);
  const [cartProductsLoading, setCartProductsLoading] = useState(false);
  const [materialsTotal, setMaterialsTotal] = useState(0);
  const [laborTotal, setLaborTotal] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderSucceeded, setOrderSucceeded] = useState(false);

  // Listen to real-time updates on the user's cart table
  const unsubscribe = () => {
    if (user) {
      cartQuantity === 0 && setCartProductsLoading(true);

      const q = query(
        collection(firestore, 'users', user.uid, 'cart').withConverter(
          cartProductConverter
        )
      );
      return onSnapshot(q, (querySnapshot) => {
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
    }
  };

  // Remove the listener for ratings
  useEffect(() => {
    // This is what gets ran when the user leaves this page
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

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
        dispatch(setDiscountTotal(discount));
        dispatch(setCartTotal((subtotal - discount).toFixed(2)));
      } else {
        dispatch(setCartTotal(subtotal.toFixed(2)));
      }
    }
    // eslint-disable-next-line
  }, [cartProducts.length, cartProducts, discountTotal, promoCode]);

  // Creates a description of all products being ordered for placing the order
  function createOrderDescriptionAndMetaData() {
    const description = cartProducts
      .map((item) => `${getProduct(item.product).title} (${item.quantity})`)
      .join(', ');

    const titles = cartProducts.map((item) => getProduct(item.product).title);
    const costs = cartProducts.map(
      (item) =>
        `$${(getProduct(item.product).totalCost() * item.quantity).toFixed(2)}`
    );
    const quantities = cartProducts.map((item) => item.quantity);
    const colors = cartProducts.map((item) => item.color);
    const notes = cartProducts.map((item) => (item.notes ? item.notes : '-'));

    const metaData =
      cartQuantity > 1
        ? {
            colors: colors.join(' || '),
            costs: costs.join(' || '),
            discount: promoCode
              ? `$${discountTotal} (${promoCode.discount * 100}%)`
              : '-',
            notes: notes.join(' || '),
            promo_code: promoCode ? promoCode.code : '-',
            quantities: quantities.join(' || '),
            titles: titles.join(' || ')
          }
        : {
            color: colors.join(' || '),
            cost: costs.join(' || '),
            discount: promoCode
              ? `$${discountTotal} (${promoCode.discount * 100}%)`
              : '-',
            notes: notes.join(' || '),
            promo_code: promoCode ? promoCode.code : '-',
            quantity: quantities.join(' || '),
            title: titles.join(' || ')
          };

    dispatch(setOrderDescription(description));
    dispatch(setOrderMetaData(metaData));
  }

  // Proceed to checkout
  function proceedToCheckout() {
    if (!cartProducts) return;
    createOrderDescriptionAndMetaData();
    setShowCheckoutModal(true);
    onOpen();
  }

  // Handles what happens when the checkout modal closes
  async function handleCheckoutModalClose() {
    onClose();

    if (orderSucceeded) {
      setOrderSucceeded(false);
      await removeAllCartItems(user.uid);
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

                  <Center>
                    <HStack className="cart-satisfaction-images-container">
                      <Image
                        boxSize="70px"
                        objectFit="cover"
                        src={CustSatisfactionImg}
                        alt="100% Customer Satisfaction"
                      />
                      <Image
                        boxSize="70px"
                        objectFit="cover"
                        src={MoneyBackImg}
                        alt="100% Money Back"
                      />
                    </HStack>
                  </Center>
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
