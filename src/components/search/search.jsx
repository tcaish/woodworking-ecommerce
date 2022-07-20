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
  const [searchString, setSearchString] = useState('');
  const [chosenCategory, setChosenCategory] = useState('');

  // Returns the unique categories
  useEffect(() => {
    products &&
      setUniqueCategories([
        ...new Map(products.map((item) => [item['category'], item])).values()
      ]);
  }, [products]);

  // Updates the products being shown to have anything relating to what is
  // being searched for by the user in the search bar or category filter
  // dropdown.
  useEffect(() => {
    if (!searchString && !chosenCategory)
      dispatch(setFilteredProducts(products));

    let queryString = searchString.toLowerCase();
    let filteredProds = products;

    // Filter by category first
    chosenCategory &&
      (filteredProds = filteredProds.filter((product) =>
        product.category.includes(chosenCategory)
      ));

    // Filter by search string
    filteredProds = filteredProds.filter(
      (product) =>
        product.title.toLowerCase().includes(queryString) ||
        (!chosenCategory &&
          product.category.toLowerCase().includes(queryString))
    );

    dispatch(setFilteredProducts(filteredProds));
    // eslint-disable-next-line
  }, [searchString, chosenCategory]);

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
                onChange={(e) => setSearchString(e.target.value)}
                value={searchString}
              />
            </InputGroup>
          </div>
        </Col>

        <Col xs={12} sm={4} lg={2}>
          <div className="filter-container">
            <Select
              placeholder="Filter By Category"
              focusBorderColor="#f7d794"
              onChange={(e) => setChosenCategory(e.target.value)}
              value={chosenCategory}
            >
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
