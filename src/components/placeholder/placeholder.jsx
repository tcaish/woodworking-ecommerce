// Bootstrap
import { Card, Col, Container, Placeholder, Row } from 'react-bootstrap';

// Chakra
import {
  Avatar,
  Center,
  Divider,
  Grid,
  GridItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';

// Images
import placeholder_img from '../../assets/images/placeholder_img.gif';

// Styles
import './placeholder.scss';
import './placeholder.mobile.scss';

export function PlaceholderProfileDesktop() {
  return (
    <Grid templateRows="repeat(4, 1fr)" templateColumns="repeat(2, 1fr)">
      <GridItem rowSpan={2} colSpan={1}>
        <Center h="100%">
          <Avatar
            className="profile-avatar"
            size="2xl"
            bg="none"
            src={placeholder_img}
          />
        </Center>
      </GridItem>

      <GridItem className="update-profile-container" rowSpan={4}>
        <h1 className="profile-update-header">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={4} />
          </Placeholder>
        </h1>

        <div className="profile-form-control">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={2} />
          </Placeholder>
          <Placeholder as="p" animation="wave">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder.Button className="button-placeholder" xs={2} />
        </div>

        <div className="profile-form-control">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={2} />
          </Placeholder>
          <Placeholder as="p" animation="wave">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder.Button className="button-placeholder" xs={2} />
        </div>

        <div className="profile-form-control">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={2} />
          </Placeholder>
          <Placeholder as="p" animation="wave">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder.Button className="button-placeholder" xs={2} />
        </div>

        <div className="profile-form-control">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={2} />
          </Placeholder>
          <Placeholder as="p" animation="wave">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder.Button className="button-placeholder" xs={2} />
        </div>
      </GridItem>

      <GridItem rowSpan={1} colSpan={1}>
        <div className="profile-info-container">
          <div className="profile-name-container">
            <h1 className="profile-name">
              <Placeholder as="p" animation="wave">
                <Placeholder xs={6} />
              </Placeholder>
            </h1>
          </div>

          <div className="profile-email-container">
            <h1 className="profile-email">
              <Placeholder as="p" animation="wave">
                <Placeholder xs={4} />
              </Placeholder>
            </h1>
          </div>

          <div className="profile-phone-container">
            <h1 className="profile-phone">
              <Placeholder as="p" animation="wave">
                <Placeholder xs={3} />
              </Placeholder>
            </h1>
          </div>
        </div>
      </GridItem>
    </Grid>
  );
}

export function PlaceholderProfileMobile() {
  return (
    <Grid templateRows="repeat(3, 1fr)" templateColumns="repeat(1, 1fr)">
      <GridItem rowSpan={1} colSpan={1}>
        <Center>
          <Avatar
            className="profile-avatar"
            size="2xl"
            bg="none"
            src={placeholder_img}
          />
        </Center>

        <div className="profile-info-container">
          <div className="profile-name-container">
            <h1 className="profile-name">
              <Placeholder as="p" animation="wave">
                <Placeholder xs={8} />
              </Placeholder>
            </h1>
          </div>

          <div className="profile-email-container">
            <h1 className="profile-email">
              <Placeholder as="p" animation="wave">
                <Placeholder xs={6} />
              </Placeholder>
            </h1>
          </div>

          <div className="profile-phone-container">
            <h1 className="profile-phone">
              <Placeholder as="p" animation="wave">
                <Placeholder xs={4} />
              </Placeholder>
            </h1>
          </div>
        </div>
      </GridItem>

      <GridItem
        className="update-profile-container update-profile-container-mobile"
        rowSpan={2}
        colSpan={1}
      >
        <div className="profile-form-control">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={4} />
          </Placeholder>
          <Placeholder as="p" animation="wave">
            <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button className="button-placeholder" xs={4} />
        </div>

        <div className="profile-form-control">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={4} />
          </Placeholder>
          <Placeholder as="p" animation="wave">
            <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button className="button-placeholder" xs={4} />
        </div>

        <div className="profile-form-control">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={4} />
          </Placeholder>
          <Placeholder as="p" animation="wave">
            <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button className="button-placeholder" xs={4} />
        </div>

        <div className="profile-form-control">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={4} />
          </Placeholder>
          <Placeholder as="p" animation="wave">
            <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button className="button-placeholder" xs={4} />
        </div>
      </GridItem>
    </Grid>
  );
}

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

export function PlaceholderCartItem() {
  return (
    <Row>
      <Col>
        <div className="cart-item-container cart-item-margin-bottom">
          <div
            className="cart-item-image-container"
            style={{
              backgroundImage: `url(${placeholder_img})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          ></div>
          <div className="cart-item-details-container">
            <Placeholder as="p" animation="wave">
              <Placeholder xs={6} size="lg" />
            </Placeholder>
            <Placeholder as="p" animation="wave">
              <Placeholder xs={4} size="sm" />
            </Placeholder>
            <Placeholder as="p" animation="wave">
              <Placeholder xs={6} size="sm" />
            </Placeholder>

            <div className="cart-item-quantity-cost-container">
              <Placeholder as="p" animation="wave">
                <Placeholder xs={6} size="md" />
              </Placeholder>
            </div>
          </div>
        </div>

        <div className="cart-item-container cart-item-margin-bottom">
          <div
            className="cart-item-image-container"
            style={{
              backgroundImage: `url(${placeholder_img})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          ></div>
          <div className="cart-item-details-container">
            <Placeholder as="p" animation="wave">
              <Placeholder xs={6} size="lg" />
            </Placeholder>
            <Placeholder as="p" animation="wave">
              <Placeholder xs={4} size="sm" />
            </Placeholder>
            <Placeholder as="p" animation="wave">
              <Placeholder xs={6} size="sm" />
            </Placeholder>

            <div className="cart-item-quantity-cost-container">
              <Placeholder as="p" animation="wave">
                <Placeholder xs={6} size="md" />
              </Placeholder>
            </div>
          </div>
        </div>

        <div className="cart-item-container">
          <div
            className="cart-item-image-container"
            style={{
              backgroundImage: `url(${placeholder_img})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          ></div>
          <div className="cart-item-details-container">
            <Placeholder as="p" animation="wave">
              <Placeholder xs={6} size="lg" />
            </Placeholder>
            <Placeholder as="p" animation="wave">
              <Placeholder xs={4} size="sm" />
            </Placeholder>
            <Placeholder as="p" animation="wave">
              <Placeholder xs={6} size="sm" />
            </Placeholder>

            <div className="cart-item-quantity-cost-container">
              <Placeholder as="p" animation="wave">
                <Placeholder xs={6} size="md" />
              </Placeholder>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export function PlaceholderCartTotals() {
  return (
    <div className="cart-checkout-container">
      <div className="cart-checkout-totals-container">
        <div className="cart-checkout-materials-container cart-checkout-grid">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={6} size="sm" />
          </Placeholder>
          <Placeholder as="p" animation="wave">
            <Placeholder xs={6} size="sm" />
          </Placeholder>
        </div>

        <div className="cart-checkout-labor-container cart-checkout-grid">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={6} size="sm" />
          </Placeholder>
          <Placeholder as="p" animation="wave">
            <Placeholder xs={6} size="sm" />
          </Placeholder>
        </div>

        <div className="cart-checkout-total-container cart-checkout-grid">
          <Placeholder as="p" animation="wave">
            <Placeholder xs={6} size="sm" />
          </Placeholder>
          <Placeholder as="p" animation="wave">
            <Placeholder xs={6} size="sm" />
          </Placeholder>
        </div>
      </div>

      <Placeholder.Button
        className="cart-checkout-button cart-checkout-button-placeholder"
        xs={12}
      />
    </div>
  );
}

export function PlaceholderOrders() {
  return (
    <TableContainer className="orders-table-container">
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Product(s)</Th>
            <Th>Total</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <Placeholder as="p" animation="wave">
                <Placeholder xs={8} size="sm" />
              </Placeholder>
            </Td>
            <Td>
              <Placeholder as="p" animation="wave">
                <Placeholder xs={10} size="sm" />
              </Placeholder>
            </Td>
            <Td>
              <Placeholder as="p" animation="wave">
                <Placeholder xs={4} size="sm" />
              </Placeholder>
            </Td>
            <Td>
              <Placeholder as="p" animation="wave">
                <Placeholder xs={8} size="sm" />
              </Placeholder>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export function PlaceholderSupport() {
  return (
    <>
      <Placeholder
        className="placeholder-margin-bottom"
        as="p"
        animation="wave"
      >
        <Placeholder xs={6} size="lg" />
        <Placeholder xs={10} size="sm" />
      </Placeholder>

      <Placeholder
        className="placeholder-margin-bottom"
        as="p"
        animation="wave"
      >
        <Placeholder xs={6} size="lg" />
        <Placeholder xs={10} size="sm" />
      </Placeholder>

      <Placeholder
        className="placeholder-margin-bottom"
        as="p"
        animation="wave"
      >
        <Placeholder xs={6} size="lg" />
        <Placeholder xs={10} size="sm" />
      </Placeholder>

      <Placeholder
        className="placeholder-margin-bottom"
        as="p"
        animation="wave"
      >
        <Placeholder xs={6} size="lg" />
        <Placeholder xs={10} size="sm" />
      </Placeholder>

      <Placeholder
        className="placeholder-margin-bottom"
        as="p"
        animation="wave"
      >
        <Placeholder xs={6} size="lg" />
        <Placeholder xs={10} size="sm" />
      </Placeholder>

      <Placeholder.Button className="button-placeholder" xs={3} />
    </>
  );
}
