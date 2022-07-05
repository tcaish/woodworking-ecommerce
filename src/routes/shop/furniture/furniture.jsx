// React
import { useEffect, useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Bootstrap
import { Container, Col, Row } from 'react-bootstrap';

// Firebase
import { getRatings } from '../../../utils/firebase/firebase';

// Components
import ProductCard from '../../../components/product-card/product-card';

// Slices
import { selectProducts } from '../../../redux/slices/inventorySlice';
import { selectRatings, setRatings } from '../../../redux/slices/ratingSlice';

// Styles
import './furniture.scss';

function Furniture() {
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const ratings = useSelector(selectRatings);

  const [ratingsLoading, setRatingsLoading] = useState(false);

  // Brings down the ratings if it hasn't been loaded already
  useEffect(() => {
    if (ratings.length === 0) {
      setRatingsLoading(true);

      getRatings().then((res) => {
        dispatch(setRatings(res));
        setRatingsLoading(false);
      });
    }
  }, [dispatch, ratings.length]);

  return (
    <Container className="main-container">
      <Row sm={1} md={2} lg={3}>
        {products.map((product) => (
          <Col key={product.id}>
            <ProductCard product={product} ratingsLoading={ratingsLoading} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Furniture;
