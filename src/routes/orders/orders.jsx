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
import { selectUser } from '../../redux/slices/userSlice';
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
  const orders = useSelector(selectOrders);
  const products = useSelector(selectProducts);

  const [cartProducts, setCartProducts] = useState([]);
  const [cartProductsLoading, setCartProductsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

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
