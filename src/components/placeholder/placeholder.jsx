// Bootstrap
import { Card, Col, Container, Placeholder, Row } from 'react-bootstrap';

// Images
import placeholder_img from '../../assets/images/placeholder_img.gif';

// Styles
import './placeholder.scss';
import './placeholder.mobile.scss';

export function PlaceholderDetailPage() {
  return (
    <Container className="main-container">
      <Row sm={1} md={1} lg={1} xl={2}>
        <Col>
          <Placeholder xs={6} />
          <Placeholder className="w-75" />{' '}
          <Placeholder style={{ width: '25%' }} />
        </Col>
        <Col></Col>
      </Row>
    </Container>
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
