// Chakra
import { Button } from '@chakra-ui/react';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// Styles
import './cart-item.scss';

function CartItem(props) {
  return (
    <Row>
      <Col>
        <div className="cart-item-container">
          <div
            className="cart-item-image-container"
            style={{
              backgroundImage: `url(${
                props.getProduct(props.cartProduct.product).pictures[0]
              })`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          ></div>
          <div className="cart-item-details-container">
            <h1>{props.getProduct(props.cartProduct.product).title}</h1>
            <h3>{props.cartProduct.color}</h3>
            <p>{props.cartProduct.notes}</p>

            <div className="cart-item-quantity-cost-container">
              <p>{`Quantity: ${props.cartProduct.quantity}`}</p>
              <h2>{`$${props
                .getProduct(props.cartProduct.product)
                .totalCost()}`}</h2>
            </div>

            <div className="cart-item-actions-container">
              <Button variant="link">Edit</Button>
              <span>{'• '}</span>
              <Button variant="link">Remove</Button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default CartItem;
