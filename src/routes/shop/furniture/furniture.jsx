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
        gap={4}
      ></Grid>
      {products.map((product) => (
        <GridItem key={product.id} rowSpan={1} colSpan={1}>
          <ProductCard product={product} />
        </GridItem>
      ))}
    </Container>
  );
}

export default Furniture;
