//Chakra
import { StarIcon } from '@chakra-ui/icons';

// Styles
import './star-rating.scss';

function StarRating({ totalStars, numGoldStars, numRatings }) {
  return (
    <div>
      {Array(totalStars)
        .fill('')
        .map((_, i) => (
          <StarIcon key={i} color={i < numGoldStars ? 'gold' : 'gray.300'} />
        ))}
      <span className="star-rating-num-reviews">{`${numRatings} ${
        numRatings === 1 ? 'rating' : 'ratings'
      }`}</span>
    </div>
  );
}

export default StarRating;
