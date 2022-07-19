// React
import { useEffect, useState } from 'react';

// React Icons
import { AiOutlineSearch } from 'react-icons/ai';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Bootstrap
import { Col, Container, Row } from 'react-bootstrap';

// Chakra
import { Input, InputGroup, InputLeftElement, Select } from '@chakra-ui/react';

// Slices
import {
  selectProducts,
  setFilteredProducts
} from '../../redux/slices/inventorySlice';

// Exports
import { capitalizeFirstLetter } from '../../exports/functions';

// Styles
import './search.scss';
import './search.mobile.scss';

function Search() {
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);

  const [uniqueCategories, setUniqueCategories] = useState([]);

  // Returns the unique categories
  useEffect(() => {
    products &&
      setUniqueCategories([
        ...new Map(products.map((item) => [item['category'], item])).values()
      ]);
  }, [products]);

  // Updates the products being shown to have anything relating to what is
  // being searched for by the user.
  function searchForProduct(queryString) {
    queryString = queryString.toLowerCase();

    const filteredProds = products.filter(
      (product) =>
        product.title.toLowerCase().includes(queryString) ||
        product.category.toLowerCase().includes(queryString)
    );
    dispatch(setFilteredProducts(filteredProds));
  }

  function filterByCategory(category) {}

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
                onChange={(e) => searchForProduct(e.target.value)}
              />
            </InputGroup>
          </div>
        </Col>

        <Col xs={12} sm={4} lg={2}>
          <div className="filter-container">
            <Select placeholder="Filter By Category" focusBorderColor="#f7d794">
              {uniqueCategories.map((product, index) => (
                <option key={index} value={product.category}>
                  {capitalizeFirstLetter(product.category)}
                </option>
              ))}
            </Select>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Search;
