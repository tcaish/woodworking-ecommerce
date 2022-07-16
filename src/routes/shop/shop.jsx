// React
import { useEffect, useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Router
import { Outlet, useLocation } from 'react-router-dom';

// Firebase
import { collection, onSnapshot, query } from 'firebase/firestore';
import { firestore, getProducts } from '../../utils/firebase/firebase';

// Slices
import { selectProducts, setProducts } from '../../redux/slices/inventorySlice';
import { setRatings } from '../../redux/slices/ratingSlice';
import { selectCurrentPath } from '../../redux/slices/routingSlice';

// Components
import Search from '../../components/search/search';
import { PlaceholderShopPage } from '../../components/placeholder/placeholder';

// Exports
import { NAVIGATION_PATHS } from '../../exports/constants';
import { ratingConverter } from '../../classes/Rating';

function Shop() {
  const dispatch = useDispatch();
  const location = useLocation();

  const products = useSelector(selectProducts);
  const currentPath = useSelector(selectCurrentPath);

  const [pageLoading, setPageLoading] = useState(false);

  // Remove the listener for ratings
  useEffect(() => {
    // Listen to real-time updates on ratings table
    const q = query(
      collection(firestore, 'ratings').withConverter(ratingConverter)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let ratings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        ratings.push(data);
      });

      dispatch(setRatings(ratings));
    });

    // This is what gets ran when the user leaves this page
    return () => {
      // If current path is '/shop' or contains '/shop/product-details'
      if (
        currentPath !== `/${NAVIGATION_PATHS.shop}` ||
        !currentPath.includes(
          `/${NAVIGATION_PATHS.shop}/${NAVIGATION_PATHS.shop_product_details}`
        )
      ) {
        unsubscribe();
      }
    };
    // eslint-disable-next-line
  }, [currentPath]);

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
