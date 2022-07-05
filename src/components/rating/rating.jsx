// React
import { useEffect, useState } from 'react';

// React Redux
import { useSelector } from 'react-redux';

// Chakra
import {
  Box,
  Button,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip
} from '@chakra-ui/react';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// Third-party
import Ratings from 'react-ratings-declarative';

// Components
import StarRating from '../star-rating/star-rating';

// Slices
import { selectUser } from '../../redux/slices/userSlice';
import { selectScreenWidth } from '../../redux/slices/screenSlice';
import { selectRatings } from '../../redux/slices/ratingSlice';

// Exports
import {
  getAverageRatingForProduct,
  getRatingsForProduct
} from '../../exports/functions';

// Styles
import './rating.scss';

export function OverallRating({ productId }) {
  const screenWidth = useSelector(selectScreenWidth);
  const ratings = useSelector(selectRatings);

  const [productRatings, setProductRatings] = useState([]);

  // Sets the ratings for the given product
  useEffect(() => {
    setProductRatings(getRatingsForProduct(ratings, productId));
  }, [ratings, productId]);

  // Returns the number of ratings for a specific type of rating
  // (e.g. 1 rating for a 5-star rating)
  function getNumRatingsForType(typeOfRating) {
    if (productRatings.length === 0) return 0;

    const numRatings = productRatings.filter(
      (rating) => rating.rating === typeOfRating
    );
    return numRatings.length;
  }

  return (
    <Row sm={2}>
      <Col className="review-overall-container">
        <Box w="100%" p={4}>
          <Stat>
            <StatLabel fontSize={screenWidth > 575 ? '2xl' : '1xl'}>
              Overall Rating
            </StatLabel>
            <StatNumber
              className="review-stat-number"
              fontSize={screenWidth > 575 ? '3xl' : '2xl'}
            >
              {getAverageRatingForProduct(productRatings)}
            </StatNumber>
            <StatHelpText fontSize="1xl">
              {`${productRatings.length} ${
                productRatings.length === 1 ? 'rating' : 'ratings'
              }`}
            </StatHelpText>
          </Stat>
        </Box>
      </Col>
      <Col>
        {Array(5)
          .fill('')
          .map((_, i) => (
            <StarRating
              key={i}
              totalStars={5}
              numGoldStars={5 - i}
              numRatings={getNumRatingsForType(5 - i)}
            />
          ))}
      </Col>
    </Row>
  );
}

export function SubmitRating({ productId }) {
  const user = useSelector(selectUser);
  const screenWidth = useSelector(selectScreenWidth);
  const ratings = useSelector(selectRatings);

  const [productRatings, setProductRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Sets the ratings for the given product
  useEffect(() => {
    setProductRatings(getRatingsForProduct(ratings, productId));
  }, [ratings, productId]);

  // Sets the rating submitted by the user
  useEffect(() => {
    if (!user) return;

    const userRatings = productRatings.filter(
      (rating) => rating.user === user.uid
    );
    setSelectedRating(userRatings.length === 1 ? userRatings[0].rating : 0);
  }, [productRatings, user]);

  // Submits the rating chosen by the user
  async function submitRating() {
    if (!user) return;
    setSubmittingRating(true);
    console.log(selectedRating);
    setSubmittingRating(false);
  }

  return (
    <div className="review-submit-container">
      <Text fontSize={screenWidth > 575 ? '3xl' : '2xl'}>Submit Rating</Text>
      <div className="review-submit-rating-container">
        <Ratings
          rating={selectedRating}
          widgetDimensions={screenWidth > 575 ? '40px' : '25px'}
          widgetSpacings={screenWidth > 575 ? '7px' : '4px'}
          widgetRatedColors="gold"
          widgetHoverColors="gold"
          changeRating={(rating) => user && setSelectedRating(rating)}
        >
          <Ratings.Widget />
          <Ratings.Widget />
          <Ratings.Widget />
          <Ratings.Widget />
          <Ratings.Widget />
        </Ratings>
      </div>
      <Tooltip
        hasArrow
        label="Create an account to submit a review"
        shouldWrapChildren
        mt="4"
        isDisabled={user}
      >
        <Button
          className="review-submit-button"
          isLoading={submittingRating}
          isDisabled={!user}
          onClick={submitRating}
        >
          Submit
        </Button>
      </Tooltip>
    </div>
  );
}
