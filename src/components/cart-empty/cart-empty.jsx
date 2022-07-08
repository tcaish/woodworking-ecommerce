// React Router
import { Link } from 'react-router-dom';

// React Icons
import { TiShoppingCart } from 'react-icons/ti';

// Chakra
import { Box, Center, Heading, Icon, Stack, Text } from '@chakra-ui/react';

// Exports
import { NAVIGATION_PATHS } from '../../exports/constants';

// Styles
import './cart-empty.scss';

function CartEmpty() {
  return (
    <div className="cart-empty-container">
      <Box>
        <Center h="400px" w="auto">
          <Stack spacing={2}>
            <Center>
              <Icon as={TiShoppingCart} w={100} h={100} color="black" />
            </Center>
            <Heading>Your shopping cart is empty!</Heading>
            <Text fontSize="xl">
              Fill your cart up with some goodies.{' '}
              <Link to={`/${NAVIGATION_PATHS.shop}`}>
                Browser our furniture.
              </Link>
            </Text>
          </Stack>
        </Center>
      </Box>
    </div>
  );
}

export default CartEmpty;
