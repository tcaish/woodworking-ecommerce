// Chakra
import { Badge, Box, Image } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

// Functions
import { howManyDaysFromToday } from '../../exports/functions';

// Styles
import './product-card.scss';

function ProductCard({ product }) {
  return (
    <Box
      className="product-card"
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Image src={product.pictures[0]} alt={product.title} />
      <Box p="6">
        <Box display="flex" alignItems="baseline">
          {howManyDaysFromToday(product.created) < 14 && (
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
            ml="2"
          >
            {product.category} &bull;{' '}
            {product.availability ? 'Available' : 'Out of Stock'}
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
                color={i < product.averageRating() ? 'teal.500' : 'gray.300'}
              />
            ))}
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            {product.ratings.length} reviews
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductCard;
