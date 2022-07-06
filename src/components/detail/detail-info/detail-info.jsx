// React Icons
import { BsArrow90DegDown } from 'react-icons/bs';

// Chakra
import {
  Divider,
  FormControl,
  FormLabel,
  Icon,
  Select,
  Textarea
} from '@chakra-ui/react';

// Components
import QuantityController from '../../quantity-controller/quantity-controller';
import AddToCartButton from '../../add-to-cart-button/add-to-cart-button';
import ShareToSocialButtons from '../../share-to-social-buttons/share-to-social-buttons';
import { PlaceholderDetailInfo } from '../../placeholder/placeholder';

// Exports
import { capitalizeFirstLetter } from '../../../exports/functions';

// Styles
import './detail-info.scss';
import './detail-info.mobile.scss';

function DetailInfo(props) {
  return (
    <div className="detail-info-container">
      {props.pageLoading ? (
        <PlaceholderDetailInfo />
      ) : (
        <>
          <h1 className="detail-title">{props.selectedProduct.title}</h1>

          <div className="detail-cost-container">
            <h2 className="detail-cost">
              ${props.selectedProduct.totalCost()}
            </h2>
            <ul className="detail-cost-breakdown">
              <li>
                Materials: ${props.selectedProduct.cost.materials.toFixed(2)}
              </li>
              <li>Labor: ${props.selectedProduct.cost.labor.toFixed(2)}</li>
            </ul>
          </div>

          <div className="detail-category-avail-container">
            <h3 className="detail-availability">
              Availability:{' '}
              <span
                style={{ color: props.selectedProduct.getAvailabilityColor() }}
              >
                {props.selectedProduct.getAvailabilityString()}
              </span>
            </h3>
            <h3 className="detail-category">
              Category:{' '}
              <span>
                {capitalizeFirstLetter(props.selectedProduct.category)}
              </span>
            </h3>
            <h3 className="detail-color">
              Color: <span>{props.selectedProduct.specifications.color}</span>
            </h3>
            <h3 className="detail-size">
              Size:{' '}
              <span>{`${props.selectedProduct.specifications.width}" W x ${props.selectedProduct.specifications.length}" L x ${props.selectedProduct.specifications.height}" H`}</span>
            </h3>
            <h3 className="detail-weight">
              Weight (Est.):{' '}
              <span>{`${props.selectedProduct.specifications.weight} lbs.`}</span>
            </h3>
          </div>

          <Divider className="detail-divider" color="lightgrey" />

          <p>{props.selectedProduct.description}</p>
          <p className="detail-description-2">
            {props.selectedProduct.description2}
          </p>

          <div className="detail-input-container">
            <FormControl className="detail-input-color-container" isRequired>
              <FormLabel htmlFor="color">Color</FormLabel>
              <Select
                id="color"
                placeholder="Select color"
                onChange={(e) => props.setColor(e.target.value)}
                value={props.color}
              >
                <option value="Natural Wood">Natural Wood</option>
                <option value="Black">Black</option>
                <option value="Grey">Grey</option>
                <option value="Other">Other - specified in notes</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="notes">Notes</FormLabel>
              <Textarea
                placeholder="Specify any changes or modifications you would like to make to this order."
                onChange={(e) => props.setNotes(e.target.value)}
                value={props.notes}
              />
            </FormControl>
          </div>

          <div className="detail-quantity-container">
            <QuantityController
              quantity={props.quantity}
              setQuantity={props.setQuantity}
            />
          </div>

          <div className="detail-add-to-cart-container">
            <AddToCartButton
              selectedProduct={props.selectedProduct}
              isItemAlreadyInCart={props.isItemAlreadyInCart}
              addingToCart={props.addingToCart}
              handleAddToCart={props.handleAddToCart}
            />
          </div>

          <div className="detail-social-share-container">
            <h3 className="detail-share-text">
              Share on social media{' '}
              <Icon
                className="detail-social-arrow flip-svg-horizontally"
                as={BsArrow90DegDown}
              />
            </h3>

            <ShareToSocialButtons />
          </div>
        </>
      )}
    </div>
  );
}

export default DetailInfo;
