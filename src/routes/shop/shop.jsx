// React
import { useEffect, useState } from 'react';

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
import { PlaceholderShopPage } from '../../components/placeholder/placeholder';

// Exports
import { NAVIGATION_PATHS } from '../../exports/constants';

function Shop() {
  const dispatch = useDispatch();
  const location = useLocation();

  const products = useSelector(selectProducts);

  const [pageLoading, setPageLoading] = useState(false);

  // Fetches and stores the products if not already done
  useEffect(() => {
    if (products.length === 0) {
      setPageLoading(true);

      getProducts().then((res) => {
        setPageLoading(false);
        dispatch(setProducts(res));
      });
    }
  }, [dispatch, products.length]);

  return (
    <div>
      {location.pathname === `/${NAVIGATION_PATHS.shop}` && <Search />}
      {pageLoading ? <PlaceholderShopPage /> : <Outlet />}
    </div>
  );
}

export default Shop;
