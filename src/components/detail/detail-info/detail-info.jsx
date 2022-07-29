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

// Exports
import { capitalizeFirstLetter } from '../../../exports/functions';

// Styles
import './detail-info.scss';
import './detail-info.mobile.scss';

function DetailInfo(props) {
  return (
    <div className="detail-info-container">
      <h1 className="detail-title">{props.selectedProduct.title}</h1>

      <div className="detail-cost-container">
        <h2 className="detail-cost">${props.selectedProduct.totalCost()}</h2>
        <ul className="detail-cost-breakdown">
          <li>Materials: ${props.selectedProduct.cost.materials.toFixed(2)}</li>
          <li>Labor: ${props.selectedProduct.cost.labor.toFixed(2)}</li>
        </ul>
      </div>

      <div className="detail-specs-container">
        <table>
          <tbody>
            <tr>
              <td className="detail-specs-title">Availability:</td>
              <td className="detail-specs-value">
                <span
                  style={{
                    color: props.selectedProduct.getAvailabilityColor()
                  }}
                >
                  {props.selectedProduct.getAvailabilityString()}
                </span>
              </td>
            </tr>
            <tr>
              <td className="detail-specs-title">Category:</td>
              <td className="detail-specs-value">
                <span>
                  {capitalizeFirstLetter(props.selectedProduct.category)}
                </span>
              </td>
            </tr>
            {props.selectedProduct.specifications.color && (
              <tr>
                <td className="detail-specs-title">Color:</td>
                <td className="detail-specs-value">
                  <span>{props.selectedProduct.specifications.color}</span>
                </td>
              </tr>
            )}
            <tr>
              <td className="detail-specs-title">Size:</td>
              <td className="detail-specs-value">
                <span>{`${props.selectedProduct.specifications.width}" W x ${props.selectedProduct.specifications.length}" L x ${props.selectedProduct.specifications.height}" H`}</span>
              </td>
            </tr>
            <tr>
              <td className="detail-specs-title">Weight (Est.):</td>
              <td className="detail-specs-value">
                <span>{`${props.selectedProduct.specifications.weight} lbs.`}</span>
              </td>
            </tr>
          </tbody>
        </table>
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
            {props.selectedProduct.colors.map((theColor, index) => (
              <option key={index} value={theColor}>
                {theColor}
              </option>
            ))}
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
    </div>
  );
}

export default DetailInfo;
