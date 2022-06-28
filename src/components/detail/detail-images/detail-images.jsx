// Chakra
import { Box, HStack, Image } from '@chakra-ui/react';

// Styles
import './detail-images.scss';

function DetailImages(props) {
  return (
    <>
      <Box className="detail-main-image-container" boxSize="md">
        <Image boxSize="md" alt="Main Picture" src={props.mainImage} />
      </Box>

      <HStack>
        {props.otherImages &&
          props.otherImages.map((pictureUrl, index) => (
            <Box className="detail-image-container" boxSize="100px" key={index}>
              <Image
                h="100%"
                alt="Additional Picture"
                src={pictureUrl}
                onClick={props.handleSelectedImage}
              />
            </Box>
          ))}
      </HStack>
    </>
  );
}

export default DetailImages;
