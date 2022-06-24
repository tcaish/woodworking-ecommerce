// React Redux
import { useSelector } from 'react-redux';

// Bootstrap
import { Container, Col, Row } from 'react-bootstrap';

// Chakra

// Slices
import { selectProducts } from '../../../redux/slices/inventorySlice';

// Styles
import './furniture.scss';
import ProductCard from '../../../components/product-card/product-card';

function Furniture() {
  const products = useSelector(selectProducts);

  return (
    <Container className="main-container">
      <Row sm={1} md={2} lg={3}>
        {products.map((product) => (
          <Col key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Furniture;
