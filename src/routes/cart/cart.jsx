// React
import { useEffect } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Bootstrap
import { Container } from 'react-bootstrap';

// Slices
import {
  selectCartProducts,
  setCartProducts
} from '../../redux/slices/cartSlice';
import { selectUser } from '../../redux/slices/userSlice';

// Firebase
import { getCartProducts } from '../../utils/firebase/firebase';

// Styles
import './cart.scss';

function Cart() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const cartProducts = useSelector(selectCartProducts);

  // Brings down the user's cart if it hasn't been loaded already
  useEffect(() => {
    if (cartProducts.length === 0 && user)
      getCartProducts(user.uid).then((res) => dispatch(setCartProducts(res)));
  }, [cartProducts.length, user, dispatch]);

  return (
    <Container className="main-container cart-container">
      {cartProducts.length > 0 &&
        cartProducts.map((cartProduct, index) => (
          <h1 key={index}>{cartProduct.product}</h1>
        ))}
    </Container>
  );
}

export default Cart;
