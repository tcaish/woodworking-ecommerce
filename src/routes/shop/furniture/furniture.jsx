// React Redux
import { useSelector } from 'react-redux';

// React Icons
import { BsShop } from 'react-icons/bs';

// Bootstrap
import { Container, Col, Row } from 'react-bootstrap';

// Components
import ProductCard from '../../../components/product-card/product-card';
import PageEmpty from '../../../components/page-empty/page-empty';

// Slices
import { selectFilteredProducts } from '../../../redux/slices/inventorySlice';

// Styles
import './furniture.scss';

function Furniture() {
  const filteredProducts = useSelector(selectFilteredProducts);

  return (
    <Container className="main-container">
      {filteredProducts.length === 0 ? (
        <PageEmpty
          icon={BsShop}
          title="There are no products!"
          text="Try searching for something else. We're sure you will find it!"
        />
      ) : (
        <Row sm={1} md={2} lg={3}>
          {filteredProducts.map((product) => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Furniture;
