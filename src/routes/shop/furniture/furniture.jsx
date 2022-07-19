// React Redux
import { useSelector } from 'react-redux';

// Bootstrap
import { Container, Col, Row } from 'react-bootstrap';

// Components
import ProductCard from '../../../components/product-card/product-card';

// Slices
import { selectFilteredProducts } from '../../../redux/slices/inventorySlice';

// Styles
import './furniture.scss';

function Furniture() {
  const filteredProducts = useSelector(selectFilteredProducts);

  return (
    <Container className="main-container">
      <Row sm={1} md={2} lg={3}>
        {filteredProducts.map((product) => (
          <Col key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Furniture;
