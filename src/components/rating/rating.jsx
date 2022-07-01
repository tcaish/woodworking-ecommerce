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
import { useState } from 'react';

// Third-party
import Ratings from 'react-ratings-declarative';

// Slices
import { selectScreenWidth } from '../../redux/slices/screenSlice';

// Styles
import './rating.scss';

export function OverallRating() {
  const screenWidth = useSelector(selectScreenWidth);

  return (
    <Box w="100%" p={4}>
      <Stat>
        <StatLabel fontSize={screenWidth > 575 ? '2xl' : '1xl'}>
          Overall Rating
        </StatLabel>
        <StatNumber
          className="review-stat-number"
          fontSize={screenWidth > 575 ? '3xl' : '2xl'}
        >
          4.7
        </StatNumber>
        <StatHelpText fontSize="1xl">4 reviews</StatHelpText>
      </Stat>
    </Box>
  );
}

export function SubmitRating() {
  const screenWidth = useSelector(selectScreenWidth);

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
      <Text fontSize={screenWidth > 575 ? '3xl' : '2xl'}>Submit Rating</Text>
      <div className="review-submit-rating-container">
        <Ratings
          rating={rating}
          widgetDimensions={screenWidth > 575 ? '40px' : '25px'}
          widgetSpacings={screenWidth > 575 ? '7px' : '4px'}
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
