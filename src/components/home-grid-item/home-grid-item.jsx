// React
import { useEffect, useState } from 'react';

// React Redux
import { useSelector } from 'react-redux';

// React Router
import { Link } from 'react-router-dom';

// Chakra
import { Button, Center, GridItem, Tooltip, VStack } from '@chakra-ui/react';

// Slices
import { selectScreenWidth } from '../../redux/slices/screenSlice';

// Exports
import { loadImage } from '../../exports/functions';

// Images
import placeholder_img from '../../assets/images/placeholder_img.gif';

// Styles
import './home-grid-item.scss';
import './home-grid-item.mobile.scss';

function HomeGridItem({
  title,
  titleColor = 'black',
  buttonTitle,
  buttonIsDisabled = false,
  path,
  image,
  rowSpan,
  colSpan
}) {
  const screenWidth = useSelector(selectScreenWidth);

  const [bgImg, setBgImg] = useState('');

  const buttonSize = () => {
    if (screenWidth <= 515) return 'xs';
    else if (screenWidth <= 1199) return 'sm';
    else return 'md';
  };

  // Sets the image when it is loaded
  useEffect(() => {
    loadImage(image).then(() => {
      setBgImg(image);
    });
  }, [image]);

  return (
    <GridItem
      className="home-grid-item hvr-grow"
      rowSpan={rowSpan}
      colSpan={colSpan}
      style={{ backgroundImage: `url(${bgImg ? bgImg : placeholder_img})` }}
    >
      <Center className="home-grid-item-container">
        <VStack spacing={4} direction="row">
          <h1 style={{ color: `${titleColor}` }}>{title}</h1>
          <Link className="home-grid-item-link" to={path}>
            <Tooltip
              hasArrow
              shouldWrapChildren
              mt="5"
              label="This feature is currently disabled."
              isDisabled={!buttonIsDisabled}
            >
              <Button
                colorScheme="gray"
                variant="solid"
                size={buttonSize()}
                isDisabled={buttonIsDisabled}
              >
                {buttonTitle}
              </Button>
            </Tooltip>
          </Link>
        </VStack>
      </Center>
    </GridItem>
  );
}

export default HomeGridItem;
