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
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
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

  useEffect(() => {
    getChargesForCustomer();
  }, []);

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

      const content = await response.json();
      console.log(content);
      // setCharges(data);
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
    const titles = orders[index].cartProducts.map((cartProductId) => {
      const cartProduct = getCartProduct(cartProductId);
      const product = getProduct(products, cartProduct.product);
      return product.title;
    });
    return titles.join(', ');
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
                      <a href="#">Invoice</a> &bull;{' '}
                      <Link to={`/${NAVIGATION_PATHS.return}/${order.id}`}>
                        Request Refund
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
