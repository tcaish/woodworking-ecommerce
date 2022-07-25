// Chakra
import { Grid } from '@chakra-ui/react';

// Bootstrap
import { Container } from 'react-bootstrap';
import HomeGridItem from '../../components/home-grid-item/home-grid-item';

// Images
import bg1 from '../../assets/images/grid-bg-1.jpg';
import bg2 from '../../assets/images/grid-bg-2.jpg';
import bg3 from '../../assets/images/grid-bg-3.jpg';

// Exports
import { NAVIGATION_PATHS } from '../../exports/constants';

// Styles
import './home.scss';

function Home() {
  return (
    <Container className="main-container home-container">
      <Grid
        h="650px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={4}
      >
        <HomeGridItem
          title="Furniture"
          titleColor="white"
          buttonTitle="Shop Furniture"
          path={NAVIGATION_PATHS.shop}
          image={bg3}
          rowSpan={2}
          colSpan={3}
        />
        <HomeGridItem
          title="Custom Builds"
          buttonTitle="Submit Build"
          buttonIsDisabled={true}
          path={`${NAVIGATION_PATHS.shop}/${NAVIGATION_PATHS.shop_custom}`}
          image={bg2}
          rowSpan={null}
          colSpan={2}
        />
        <HomeGridItem
          title="Restoration"
          buttonTitle="Submit Restoration"
          buttonIsDisabled={true}
          path={`${NAVIGATION_PATHS.shop}/${NAVIGATION_PATHS.shop_restoration}`}
          image={bg1}
          rowSpan={null}
          colSpan={2}
        />
      </Grid>
    </Container>
  );
}

export default Home;
