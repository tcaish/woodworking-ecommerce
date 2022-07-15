// React
import { useEffect } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

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
import { firestore } from '../../utils/firebase/firebase';

// Slices
import { selectOrders, setOrders } from '../../redux/slices/ordersSlice';
import { selectUser } from '../../redux/slices/userSlice';

// Classes
import { orderConverter } from '../../classes/Order';

// Styles
import './orders.scss';

function Orders() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const orders = useSelector(selectOrders);

  // Listen to real-time updates on orders table
  useEffect(() => {
    if (user) {
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
      });

      // This is what gets ran when the user leaves this page
      return () => {
        // Remove the listener for orders
        unsubscribe();
      };
    }
  }, [dispatch, orders, user]);

  return (
    <div className="main-container">
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
            {orders &&
              orders.map((order, index) => (
                <Tr key={index}>
                  <Td>{order.id}</Td>
                  <Td>{order.cartProducts.join(', ')}</Td>
                  <Td>{`$${order.total.toFixed(2)}`}</Td>
                  <Td>
                    <a href="#">Invoice</a> &bull;{' '}
                    <a href="#">Request Refund</a>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Orders;
