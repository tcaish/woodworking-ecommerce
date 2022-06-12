// React Router
import { Link } from 'react-router-dom';

// Chakra
import { Button, Center, GridItem, VStack } from '@chakra-ui/react';

// Styles
import './home-grid-item.scss';

function HomeGridItem({
  title,
  titleColor = 'black',
  buttonTitle,
  path,
  image,
  rowSpan,
  colSpan
}) {
  return (
    <GridItem
      className="home-grid-item hvr-grow"
      rowSpan={rowSpan}
      colSpan={colSpan}
      style={{ backgroundImage: `url(${image})` }}
    >
      <Center className="home-grid-item-container">
        <VStack spacing={4} direction="row">
          <h1 style={{ color: `${titleColor}` }}>{title}</h1>
          <Link className="home-grid-item-link" to={path}>
            <Button colorScheme="gray" variant="solid">
              {buttonTitle}
            </Button>
          </Link>
        </VStack>
      </Center>
    </GridItem>
  );
}

export default HomeGridItem;
