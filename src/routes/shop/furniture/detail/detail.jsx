// React Router
import { useSelector } from 'react-redux';

// React Router
import { useParams } from 'react-router-dom';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// Chakra
import { Box, Image, HStack } from '@chakra-ui/react';

// Slices
import { selectProducts } from '../../../../redux/slices/inventorySlice';

// Styles
import './detail.scss';
import { useEffect, useState } from 'react';

function Detail() {
  const params = useParams();
  const products = useSelector(selectProducts);

  const selectedProduct = products.filter(
    (product) => product.id === params.productId
  )[0];

  const [mainImage, setMainImage] = useState('');
  const [otherImages, setOtherImages] = useState([]);

  // Sets the main image and other images when available
  useEffect(() => {
    setMainImage(selectedProduct && selectedProduct.pictures[0]);
    setOtherImages(
      selectedProduct &&
        selectedProduct.pictures.slice(1, selectedProduct.pictures.length)
    );
  }, [selectedProduct]);

  // Handles setting the main image and updating the list of other images
  function handleSelectedImage(event) {
    const selectedImage = event.target;
    setMainImage(selectedImage.src);
    setOtherImages(
      selectedProduct.pictures.filter(
        (picture) => picture !== selectedImage.src
      )
    );
  }

  return (
    <div className="main-container">
      <div className="detail-container">
        <Row sm={1} lg={2}>
          <Col>
            <Box className="detail-main-image-container" boxSize="md">
              <Image boxSize="md" alt="Main Picture" src={mainImage} />
            </Box>

            <HStack>
              {otherImages &&
                otherImages.map((pictureUrl, index) => (
                  <Box
                    className="detail-image-container"
                    boxSize="100px"
                    key={index}
                  >
                    <Image
                      h="100%"
                      alt="Additional Picture"
                      src={pictureUrl}
                      onClick={handleSelectedImage}
                    />
                  </Box>
                ))}
            </HStack>
          </Col>
          <Col>Description</Col>
        </Row>
      </div>
    </div>
  );
}

export default Detail;
