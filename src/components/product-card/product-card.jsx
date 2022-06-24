// Chakra
import { Badge, Box, Image } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

// Styles
import './product-card.scss';

function ProductCard({ product }) {
  return (
    <div className="product-card-container">
      <Box
        className="product-card hvr-float"
        maxW="sm"
        borderWidth="3px"
        borderRadius="lg"
        overflow="hidden"
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
              <span
                style={{ color: product.availability ? 'green' : 'darkred' }}
              >
                {product.availability ? 'Available' : 'Out of Stock'}
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

          <Box display="flex" mt="2" alignItems="center">
            {Array(5)
              .fill('')
              .map((_, i) => (
                <StarIcon
                  key={i}
                  color={i < product.averageRating() ? 'gold' : 'gray.300'}
                />
              ))}
            <Box as="span" ml="2" color="gray.600" fontSize="sm">
              {product.ratings.length} reviews
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default ProductCard;
