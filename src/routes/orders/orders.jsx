// React
import { useEffect, useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Router
import { Link } from 'react-router-dom';

// React Icons
import { IoReceipt } from 'react-icons/io5';

// Chakra
import {
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast
} from '@chakra-ui/react';

// Firebase
import { collection, onSnapshot, query } from 'firebase/firestore';
import {
  firestore,
  getCartProducts,
  getProducts
} from '../../utils/firebase/firebase';

// Slices
import { selectOrders, setOrders } from '../../redux/slices/ordersSlice';
import {
  selectStripeCustomerId,
  selectUser
} from '../../redux/slices/userSlice';
import { selectProducts, setProducts } from '../../redux/slices/inventorySlice';

// Classes
import { orderConverter } from '../../classes/Order';

// Components
import PageEmpty from '../../components/page-empty/page-empty';

// Exports
import { getProduct } from '../../exports/functions';
import { NAVIGATION_PATHS } from '../../exports/constants';

// Styles
import './orders.scss';
import { PlaceholderOrders } from '../../components/placeholder/placeholder';

function Orders() {
  const toast = useToast();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const stripeCustomerId = useSelector(selectStripeCustomerId);
  const orders = useSelector(selectOrders);
  const products = useSelector(selectProducts);

  const [charges, setCharges] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [cartProductsLoading, setCartProductsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [chosenReceipt, setChosenReceipt] = useState('');
  const [receiptLoading, setReceiptLoading] = useState(false);

  // Fetch purchased card products
  useEffect(() => {
    if (user) {
      setCartProductsLoading(true);

      getCartProducts(user.uid, true).then((res) => {
        setCartProducts(res);
        setCartProductsLoading(false);
      });
    }
  }, [user]);

  // Fetch products if there aren't any yet
  useEffect(() => {
    if (products.length === 0) {
      setProductsLoading(true);

      getProducts().then((res) => {
        dispatch(setProducts(res));
        setProductsLoading(false);
      });
    }
  }, [dispatch, products.length]);

  // Remove the listener for orders
  useEffect(() => {
    // Listen to real-time updates on orders table
    if (user) {
      if (orders.length === 0) setOrdersLoading(true);

      const q = query(
        collection(firestore, 'users', user.uid, 'orders').withConverter(
          orderConverter
        )
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let orders = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          orders.push(data);
        });

        dispatch(setOrders(orders));
        setOrdersLoading(false);
      });

      // This is what gets ran when the user leaves this page
      return () => {
        unsubscribe();
      };
    }
    // eslint-disable-next-line
  }, [user]);

  // Return all charges for the given customer
  async function getChargesForCustomer() {
    try {
      const response = await fetch(
        '/.netlify/functions/list-charges-for-customer',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customer: stripeCustomerId
          })
        }
      );

      const { charges } = await response.json();
      setCharges(charges.data);

      return charges.data;
    } catch (err) {
      console.log(err);
    }
  }

  // Returns the cart product given an ID
  function getCartProduct(cartProductId) {
    return cartProducts.filter(
      (cartProduct) => cartProduct.id === cartProductId
    )[0];
  }

  // Returns all the titles for the products purchased joined by commas
  function getProductTitlesForOrderAtIndex(index) {
    const titles = orders[index].cart_products.map((cartProductId) => {
      const cartProduct = getCartProduct(cartProductId);
      const product = getProduct(products, cartProduct.product);
      return product.title;
    });
    return titles.join(', ');
  }

  // Downloads the receipt for a given order
  async function getReceiptForOrder(stripeOrderId) {
    let tempCharges = charges;

    setChosenReceipt(stripeOrderId);

    // If charges haven't been fetched yet, let's fetch them
    if (stripeCustomerId && charges.length === 0) {
      setReceiptLoading(true);

      tempCharges = await getChargesForCustomer().then((res) => {
        setReceiptLoading(false);
        return res;
      });
    }

    const filteredCharges = tempCharges.filter(
      (item) => item.payment_intent === stripeOrderId
    );

    if (filteredCharges.length === 1) {
      window.open(filteredCharges[0].receipt_url);
    } else {
      toast({
        title: 'Receipt Download Failed',
        description:
          'There was an error retrieving your receipt. Please try again later.',
        status: 'error',
        duration: 7000,
        isClosable: true
      });
    }
  }

  // Renders the page with placeholders or orders table
  function renderOrdersPage() {
    return cartProductsLoading || productsLoading || ordersLoading ? (
      <PlaceholderOrders />
    ) : (
      <>
        <Heading className="orders-heading">Your Orders</Heading>

        <TableContainer className="orders-table-container">
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Purchased</Th>
                <Th>Order ID</Th>
                <Th>Product(s)</Th>
                <Th>Total</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.length > 0 &&
                cartProducts.length > 0 &&
                products.length > 0 &&
                orders.map((order, index) => (
                  <Tr key={index}>
                    <Td>{order.getOrderedDate()}</Td>
                    <Td>{order.id}</Td>
                    <Td>{getProductTitlesForOrderAtIndex(index)}</Td>
                    <Td>{`$${order.total.toFixed(2)}`}</Td>
                    <Td>
                      <Button
                        variant="link"
                        isLoading={
                          chosenReceipt === order.stripe_order_id &&
                          receiptLoading
                        }
                        onClick={() =>
                          getReceiptForOrder(order.stripe_order_id)
                        }
                      >
                        Receipt
                      </Button>
                      <span>&nbsp;&bull;&nbsp;</span>
                      <Link to={`/${NAVIGATION_PATHS.return}/${order.id}`}>
                        <Button variant="link">Request Refund</Button>
                      </Link>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    );
  }

  return (
    <div className="main-container">
      {orders.length === 0 &&
      !cartProductsLoading &&
      !productsLoading &&
      !ordersLoading ? (
        <PageEmpty
          icon={IoReceipt}
          title="You have no orders yet!"
          text="Let's go change that!"
          linkPath={`/${NAVIGATION_PATHS.shop}`}
          linkText="Browse our furniture."
        />
      ) : (
        renderOrdersPage()
      )}
    </div>
  );
}

export default Orders;
