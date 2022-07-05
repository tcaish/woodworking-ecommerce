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
  Text
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

// Styles
import './rating.scss';

export function OverallRating() {
  const screenWidth = useSelector(selectScreenWidth);
  const ratings = useSelector(selectRatings);

  // Averages the ratings when ratings gets loaded
  function getAverageRating() {
    if (ratings.length === 0) return 0;

    const totalRating = ratings.reduce(
      (prevValue, rating) => prevValue + rating.rating,
      0
    );
    return (totalRating / ratings.length).toFixed(1);
  }

  // Returns the number of ratings for a specific type of rating
  // (e.g. 1 rating for a 5-star rating)
  function getNumRatingsForType(typeOfRating) {
    if (ratings.length === 0) return 0;

    const numRatings = ratings.filter(
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
              {getAverageRating()}
            </StatNumber>
            <StatHelpText fontSize="1xl">
              {`${ratings.length} ${
                ratings.length === 1 ? 'rating' : 'ratings'
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

export function SubmitRating() {
  const user = useSelector(selectUser);
  const screenWidth = useSelector(selectScreenWidth);
  const ratings = useSelector(selectRatings);

  const [selectedRating, setSelectedRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Submits the rating chosen by the user
  async function submitRating() {
    setSubmittingRating(true);
    console.log(selectedRating);
    setSubmittingRating(false);
  }

  // Sets the rating submitted by the user
  useEffect(() => {
    const userRatings = ratings.filter((rating) => rating.user === user.uid);
    setSelectedRating(userRatings.length === 1 ? userRatings[0].rating : 0);
  }, [ratings, user.uid]);

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
          changeRating={(rating) => setSelectedRating(rating)}
        >
          <Ratings.Widget />
          <Ratings.Widget />
          <Ratings.Widget />
          <Ratings.Widget />
          <Ratings.Widget />
        </Ratings>
      </div>
      <Button
        className="review-submit-button"
        isLoading={submittingRating}
        onClick={submitRating}
      >
        Submit
      </Button>
    </div>
  );
}
