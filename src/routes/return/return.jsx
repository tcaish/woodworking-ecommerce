// React
import { useEffect } from 'react';

// React Router
import { useParams } from 'react-router-dom';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Bootstrap
import { Container } from 'react-bootstrap';

// Firebase
import { getOrders } from '../../utils/firebase/firebase';

// Slices
import { selectOrders, setOrders } from '../../redux/slices/ordersSlice';
import { selectUser } from '../../redux/slices/userSlice';

// Styles
import './return.scss';

function Return() {
  const dispatch = useDispatch();
  const params = useParams();

  const user = useSelector(selectUser);
  const orders = useSelector(selectOrders);

  const selectedOrder = orders.filter(
    (order) => order.id === params.orderId
  )[0];

  // Fetch the orders if we haven't yet
  useEffect(() => {
    if (user && orders.length === 0)
      getOrders(user.uid).then((res) => dispatch(setOrders(res)));
  }, [dispatch, user, orders.length]);

  return (
    <Container className="main-container">
      {!selectedOrder ? <h1>No order found</h1> : <h1>{selectedOrder.id}</h1>}
    </Container>
  );
}

export default Return;
