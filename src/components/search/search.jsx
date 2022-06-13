// React Icons
import { AiOutlineSearch } from 'react-icons/ai';

// Bootstrap
import { Container } from 'react-bootstrap';

// Chakra
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';

// Styles
import './search.scss';

function Search() {
  return (
    <Container>
      <div className="search-bar-container">
        <InputGroup className="search-bar-input-group">
          <InputLeftElement
            pointerEvents="none"
            children={<AiOutlineSearch color="gray.300" />}
          />
          <Input
            className="search-bar"
            type="text"
            placeholder="Search"
            _placeholder={{ opacity: 1, color: 'black' }}
            focusBorderColor="#f7d794"
            variant="filled"
          />
        </InputGroup>
      </div>
    </Container>
  );
}

export default Search;
