// React
import { useEffect, useState } from 'react';

// React Router
import { useLocation, useNavigate } from 'react-router-dom';

// React Redux
import { useSelector } from 'react-redux';

// Chakra
import { Badge, Box, Image } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

// Bootstrap
import { Placeholder } from 'react-bootstrap';

// Slices
import { selectScreenWidth } from '../../redux/slices/screenSlice';
import { selectRatings } from '../../redux/slices/ratingSlice';

// Exports
import {
  getAverageRatingForProduct,
  getRatingsForProduct
} from '../../exports/functions';

// Styles
import './product-card.scss';
import './product-card.mobile.scss';

function ProductCard({ product, ratingsLoading }) {
  const location = useLocation();
  const navigate = useNavigate();

  const screenWidth = useSelector(selectScreenWidth);
  const ratings = useSelector(selectRatings);

  const [productRatings, setProductRatings] = useState([]);

  // Sets the ratings for the given product
  useEffect(() => {
    setProductRatings(getRatingsForProduct(ratings, product.id));
  }, [ratings, product.id]);

  // Handles showing the correct product detail page
  function showProductDetailsPage() {
    navigate(`${location.pathname}/product-details/${product.id}`);
  }

  return (
    <div className="product-card-container">
      <Box
        className="product-card hvr-float"
        maxW={screenWidth <= 767 ? 'auto' : 'sm'}
        borderWidth="3px"
        borderRadius="lg"
        overflow="hidden"
        onClick={showProductDetailsPage}
      >
        <Image src={product.pictures[0]} alt={product.title} h="auto" />
        <Box p="6">
          <Box display="flex" alignItems="baseline">
            {product.isNew() && (
              <Badge className="product-new-badge" borderRadius="full" px="2">
                New
              </Badge>
            )}

            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml={product.isNew() ? '2' : '0'}
            >
              <span>{product.category}</span> &bull;{' '}
              <span style={{ color: product.getAvailabilityColor() }}>
                {product.getAvailabilityString()}
              </span>
            </Box>
          </Box>

          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            noOfLines={1}
          >
            {product.title}
          </Box>

          <Box>
            ${product.totalCost()}
            <Box as="span" color="gray.600" fontSize="sm">
              {' '}
              (materials and labor)
            </Box>
          </Box>

          {ratingsLoading ? (
            <Placeholder as="p" animation="wave">
              <Placeholder xs={4} size="lg" />
            </Placeholder>
          ) : (
            <Box display="flex" mt="2" alignItems="center">
              {Array(5)
                .fill('')
                .map((_, i) => (
                  <StarIcon
                    key={i}
                    color={
                      i < getAverageRatingForProduct(productRatings)
                        ? 'gold'
                        : 'gray.300'
                    }
                  />
                ))}
              <Box as="span" ml="2" color="gray.600" fontSize="sm">
                {`${productRatings.length} ${
                  productRatings.length === 1 ? 'rating' : 'ratings'
                }`}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default ProductCard;
