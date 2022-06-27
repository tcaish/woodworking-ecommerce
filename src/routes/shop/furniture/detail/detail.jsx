// React Router
import { useSelector } from 'react-redux';

// React Router
import { useParams } from 'react-router-dom';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// Chakra
import { Box, Divider, Image, HStack } from '@chakra-ui/react';

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
        {selectedProduct && (
          <Row sm={1} lg={2}>
            <Col className="detail-images-container">
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
            <Col className="detail-description-container">
              <h1 className="detail-title">{selectedProduct.title}</h1>

              <div className="detail-cost-container">
                <h2 className="detail-cost">${selectedProduct.totalCost()}</h2>
                <ul className="detail-cost-breakdown">
                  <li>Materials: ${selectedProduct.cost.materials}</li>
                  <li>Labor: ${selectedProduct.cost.labor}</li>
                </ul>
              </div>

              <div className="detail-category-avail-container">
                <h3 className="detail-category">
                  Category: <span>{selectedProduct.category}</span>
                </h3>
                <h3 className="detail-availability">
                  Availability:{' '}
                  <span
                    style={{ color: selectedProduct.getAvailabilityColor() }}
                  >
                    {selectedProduct.getAvailabilityString()}
                  </span>
                </h3>
              </div>

              <Divider className="detail-divider" color="lightgrey" />

              <p>{selectedProduct.description}</p>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

export default Detail;
