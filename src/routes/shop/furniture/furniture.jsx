// React Redux
import { useSelector } from 'react-redux';

// Bootstrap
import { Container } from 'react-bootstrap';

// Chakra
import { Grid, GridItem } from '@chakra-ui/react';

// Slices
import { selectProducts } from '../../../redux/slices/inventorySlice';

// Styles
import './furniture.scss';
import ProductCard from '../../../components/product-card/product-card';

function Furniture() {
  const products = useSelector(selectProducts);

  return (
    <Container className="main-container">
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={2}
      ></Grid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Container>
  );
}

export default Furniture;
