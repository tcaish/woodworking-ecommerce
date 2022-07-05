// React
import { useEffect, useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// React Icons
import { BsCheck2 } from 'react-icons/bs';

// Chakra
import {
  Box,
  Button,
  Icon,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useToast
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
import {
  addRating,
  selectRatings,
  updateRating
} from '../../redux/slices/ratingSlice';

// Firebase
import { addUserRating, editUserRating } from '../../utils/firebase/firebase';

// Exports
import {
  getAverageRatingForProduct,
  getFirebaseTimestampFromDate,
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
  const dispatch = useDispatch();
  const toast = useToast();

  const user = useSelector(selectUser);
  const screenWidth = useSelector(selectScreenWidth);
  const ratings = useSelector(selectRatings);

  const [productRatings, setProductRatings] = useState([]);
  const [userRating, setUserRating] = useState({});
  const [selectedRating, setSelectedRating] = useState(0);
  const [userHasRated, setUserHasRated] = useState(false);
  const [editingRating, setEditingRating] = useState(false);
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
    setUserRating(userRatings.length === 1 ? userRatings[0] : {});
    setSelectedRating(userRatings.length === 1 ? userRatings[0].rating : 0);
    setUserHasRated(userRatings.length === 1);
  }, [productRatings, user]);

  // Handles showing toast depending on success or error of submitting rating
  function handleSuccessError(addingRating, err) {
    let title = '';
    let description = '';

    if (err) {
      title = addingRating
        ? 'Failed to Submit Rating'
        : 'Failed to Edit Rating';
      description = addingRating
        ? 'There was an error submitting your rating. Please try again later!'
        : 'There was an error editing your rating. Please try again later!';
    } else {
      title = addingRating
        ? 'Successfully Submitted Rating'
        : 'Successfully Edited Rating';
      description = addingRating
        ? `Your rating of ${selectedRating} was submitted.`
        : `Your rating has been updated to ${selectedRating}.`;
    }
    toast({
      title: title,
      description: description,
      status: err ? 'error' : 'success',
      duration: 6000,
      isClosable: true
    });
  }

  // Submits the rating chosen by the user
  async function submitRating() {
    if (!user || !productId || selectedRating === 0) return;

    setSubmittingRating(true);

    if (!editingRating) {
      await addUserRating(selectedRating, user.uid, productId)
        .then((docId) => {
          dispatch(
            addRating({
              id: docId,
              product: productId,
              rating: selectedRating,
              submitted: getFirebaseTimestampFromDate(new Date()),
              user: user.uid
            })
          );

          setSubmittingRating(false);
          handleSuccessError(true, false);
        })
        .catch((err) => {
          setSubmittingRating(false);
          handleSuccessError(true, true);
        });
    } else {
      await editUserRating(selectedRating, userRating.id, user.uid, productId)
        .then((res) => {
          dispatch(
            updateRating({
              id: userRating.id,
              product: productId,
              rating: selectedRating,
              submitted: getFirebaseTimestampFromDate(new Date()),
              user: user.uid
            })
          );

          setSubmittingRating(false);
          setEditingRating(false);
          handleSuccessError(false, false);
        })
        .catch((err) => {
          setSubmittingRating(false);
          handleSuccessError(false, true);
        });
    }
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

      {!userHasRated || editingRating ? (
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
      ) : (
        <>
          <Icon as={BsCheck2} color="green" /> <span>Rating Submitted</span>
          <br />
          <Button
            className="rating-edit-button"
            variant="link"
            onClick={() => setEditingRating(true)}
          >
            Edit Rating
          </Button>
        </>
      )}
    </div>
  );
}
