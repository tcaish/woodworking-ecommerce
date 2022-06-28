// React
import { useEffect } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Router
import { Outlet, useLocation } from 'react-router-dom';

// Firebase
import { getProducts } from '../../utils/firebase/firebase';

// Slices
import { selectProducts, setProducts } from '../../redux/slices/inventorySlice';

// Components
import Search from '../../components/search/search';

function Shop() {
  const dispatch = useDispatch();
  const location = useLocation();

  const products = useSelector(selectProducts);

  // Fetches and stores the products if not already done
  useEffect(() => {
    if (products.length === 0)
      getProducts().then((res) => dispatch(setProducts(res)));
  }, [dispatch, products.length]);

  return (
    <div>
      {location.pathname === '/shop' && <Search />}
      <Outlet />
    </div>
  );
}

export default Shop;
