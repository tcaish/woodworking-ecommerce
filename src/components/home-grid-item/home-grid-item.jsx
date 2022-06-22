// React Redux
import { useSelector } from 'react-redux';

// React Router
import { Link } from 'react-router-dom';

// Chakra
import { Button, Center, GridItem, VStack } from '@chakra-ui/react';

// Slices
import { selectScreenWidth } from '../../redux/slices/screenSlice';

// Styles
import './home-grid-item.scss';
import './home-grid-item.mobile.scss';

function HomeGridItem({
  title,
  titleColor = 'black',
  buttonTitle,
  path,
  image,
  rowSpan,
  colSpan
}) {
  const screenWidth = useSelector(selectScreenWidth);

  const buttonSize = () => {
    if (screenWidth <= 515) return 'xs';
    else if (screenWidth <= 1199) return 'sm';
    else return 'md';
  };

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
            <Button colorScheme="gray" variant="solid" size={buttonSize()}>
              {buttonTitle}
            </Button>
          </Link>
        </VStack>
      </Center>
    </GridItem>
  );
}

export default HomeGridItem;
