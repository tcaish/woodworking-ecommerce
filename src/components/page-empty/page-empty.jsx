// React Router
import { Link } from 'react-router-dom';

// Chakra
import { Box, Center, Heading, Icon, Stack, Text } from '@chakra-ui/react';

// Styles
import './page-empty.scss';

function PageEmpty({ icon, title, text, linkPath, linkText }) {
  return (
    <div className="main-container page-empty-container">
      <Box>
        <Center h="400px" w="auto">
          <Stack spacing={2}>
            <Center>
              <Icon as={icon} w={100} h={100} color="black" />
            </Center>
            <Heading>{title}</Heading>
            <Text fontSize="xl">
              {text} <Link to={linkPath}>{linkText}</Link>
            </Text>
          </Stack>
        </Center>
      </Box>
    </div>
  );
}

export default PageEmpty;
