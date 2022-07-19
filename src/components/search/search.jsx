// React Icons
import { AiOutlineSearch } from 'react-icons/ai';

// Bootstrap
import { Col, Container, Row } from 'react-bootstrap';

// Chakra
import { Input, InputGroup, InputLeftElement, Select } from '@chakra-ui/react';

// Styles
import './search.scss';
import './search.mobile.scss';

function Search() {
  return (
    <Container>
      <Row>
        <Col>
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
        </Col>

        <Col xs={12} sm={4} lg={2}>
          <div className="filter-container">
            <Select placeholder="Filter Category" focusBorderColor="#f7d794">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Search;
