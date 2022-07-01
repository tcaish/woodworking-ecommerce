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
import { useState } from 'react';

// Third-party
import Ratings from 'react-ratings-declarative';

// Styles
import './rating.scss';

export function OverallRating() {
  return (
    <Box w="100%" p={4}>
      <Stat>
        <StatLabel fontSize="2xl">Overall Rating</StatLabel>
        <StatNumber className="review-stat-number" fontSize="3xl">
          4.7
        </StatNumber>
        <StatHelpText fontSize="1xl">4 reviews</StatHelpText>
      </Stat>
    </Box>
  );
}

export function SubmitRating(props) {
  const [rating, setRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Submits the rating chosen by the user
  function submitRating() {
    setSubmittingRating(true);
    console.log(rating);
    setSubmittingRating(false);
  }

  return (
    <div className="review-submit-container">
      <Text fontSize="3xl">Submit Rating</Text>
      <div className="review-submit-rating-container">
        <Ratings
          rating={rating}
          widgetDimensions="40px"
          widgetSpacings="7px"
          widgetRatedColors="gold"
          widgetHoverColors="gold"
          changeRating={(rating) => setRating(rating)}
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
