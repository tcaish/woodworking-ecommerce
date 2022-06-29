// React Icons
import { BsArrow90DegDown } from 'react-icons/bs';

// Chakra
import { Divider, Icon } from '@chakra-ui/react';

// Components
import QuantityController from '../../quantity-controller/quantity-controller';
import AddToCartButton from '../../add-to-cart-button/add-to-cart-button';
import ShareToSocialButtons from '../../share-to-social-buttons/share-to-social-buttons';

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
          <li>Materials: ${props.selectedProduct.cost.materials}</li>
          <li>Labor: ${props.selectedProduct.cost.labor}</li>
        </ul>
      </div>

      <div className="detail-category-avail-container">
        <h3 className="detail-category">
          Category: <span>{props.selectedProduct.category}</span>
        </h3>
        <h3 className="detail-availability">
          Availability:{' '}
          <span style={{ color: props.selectedProduct.getAvailabilityColor() }}>
            {props.selectedProduct.getAvailabilityString()}
          </span>
        </h3>
      </div>
      <Divider className="detail-divider" color="lightgrey" />
      <p>{props.selectedProduct.description}</p>

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
