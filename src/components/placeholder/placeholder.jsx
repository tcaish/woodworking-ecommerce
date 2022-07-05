// Bootstrap
import { Card, Col, Container, Placeholder, Row } from 'react-bootstrap';

// Chakra
import { Divider } from '@chakra-ui/react';

// Images
import placeholder_img from '../../assets/images/placeholder_img.gif';

// Styles
import './placeholder.scss';
import './placeholder.mobile.scss';

export function PlaceholderDetailInfo() {
  return (
    <div>
      <Placeholder className="detail-title" xs={8} size="lg" />

      <div className="detail-cost-container">
        <Placeholder as="p" animation="wave">
          <Placeholder xs={4} />
        </Placeholder>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={2} size="xs" />
        </Placeholder>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={2} size="xs" />
        </Placeholder>
      </div>

      <div className="detail-category-avail-container">
        <Placeholder as="p" animation="wave">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={6} />
        </Placeholder>
      </div>

      <Divider className="detail-divider" color="lightgrey" />

      <Placeholder as="p" animation="wave">
        <Placeholder xs={10} size="sm" />
      </Placeholder>
      <Placeholder as="p" animation="wave">
        <Placeholder xs={8} size="sm" />
      </Placeholder>
      <Placeholder as="p" animation="wave">
        <Placeholder xs={7} size="sm" />
      </Placeholder>
      <Placeholder as="p" animation="wave">
        <Placeholder xs={6} size="sm" />
      </Placeholder>

      <div className="detail-quantity-container">
        <Placeholder as="p" animation="wave">
          <Placeholder xs={2} size="lg" />
        </Placeholder>
      </div>

      <div className="detail-add-to-cart-container">
        <Placeholder as="p" animation="wave">
          <Placeholder xs={4} size="lg" />
        </Placeholder>
      </div>

      <div className="detail-social-share-container">
        <Placeholder as="p" animation="wave">
          <Placeholder xs={10} size="lg" />
        </Placeholder>
      </div>
    </div>
  );
}

export function PlaceholderShopPage() {
  const cardList = Array.from({ length: 3 }, (x, i) => i);

  return (
    <Container className="main-container">
      <Row className="placeholder-shop-page" sm={1} md={2} lg={3}>
        {cardList.map((x, i) => (
          <Col key={i}>
            <Card className="placeholder-card">
              <Card.Img
                className="placeholder-card-image"
                variant="top"
                src={placeholder_img}
              />
              <Card.Body>
                <Placeholder as={Card.Title} animation="glow">
                  <Placeholder xs={8} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={11} />
                  <Placeholder xs={9} />
                  <Placeholder xs={6} />
                </Placeholder>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export function PlaceholderOverallRating() {
  return (
    <>
      <Col className="review-overall-container">
        <Placeholder as="p" animation="wave">
          <Placeholder xs={8} size="lg" />
        </Placeholder>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={4} size="lg" />
        </Placeholder>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={6} size="lg" />
        </Placeholder>
      </Col>
      <Col>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={8} size="lg" />
        </Placeholder>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={6} size="lg" />
        </Placeholder>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={8} size="lg" />
        </Placeholder>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={6} size="lg" />
        </Placeholder>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={8} size="lg" />
        </Placeholder>
      </Col>
    </>
  );
}

export function PlaceholderSubmitRating() {
  return (
    <>
      <Placeholder as="p" animation="wave">
        <Placeholder xs={6} size="lg" />
      </Placeholder>
      <Placeholder as="p" animation="wave">
        <Placeholder xs={4} size="lg" />
      </Placeholder>
    </>
  );
}
