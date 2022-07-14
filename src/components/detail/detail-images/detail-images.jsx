// React
import { useEffect, useState } from 'react';

// React Redux
import { useSelector } from 'react-redux';

// Chakra
import { Box, HStack, Image } from '@chakra-ui/react';

// Slices
import { selectScreenWidth } from '../../../redux/slices/screenSlice';

// Images
import placeholder_img from '../../../assets/images/placeholder_img.gif';

// Styles
import './detail-images.scss';
import './detail-images.mobile.scss';

function DetailImages(props) {
  const screenWidth = useSelector(selectScreenWidth);

  const [mainImage, setMainImage] = useState('');

  // Sets the main image when it finishes loading
  useEffect(() => {
    const img = document.getElementById('detail-main-image');

    if (img.complete) {
      setMainImage(props.mainImage);
    } else {
      img.addEventListener('load', () => setMainImage(props.mainImage));
    }
  }, [props.mainImage]);

  return (
    <>
      <Box
        className="detail-main-image-container"
        boxSize={screenWidth <= 575 ? 'xs' : 'md'}
      >
        <Image
          id="detail-main-image"
          boxSize={screenWidth <= 575 ? 'xs' : 'md'}
          alt="Main Picture"
          src={mainImage ? mainImage : placeholder_img}
        />
      </Box>

      <HStack className="detail-other-images-container">
        {props.otherImages &&
          props.otherImages.map((pictureUrl, index) => (
            <Box
              className="detail-image-container"
              boxSize={screenWidth <= 575 ? '75px' : '100px'}
              key={index}
            >
              <Image
                h="100%"
                alt="Additional Picture"
                src={!props.pageLoading ? pictureUrl : placeholder_img}
                onClick={props.handleSelectedImage}
              />
            </Box>
          ))}
      </HStack>
    </>
  );
}

export default DetailImages;
