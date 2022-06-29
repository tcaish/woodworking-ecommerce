// React
import { useEffect, useState } from 'react';

// React Router
import { useDispatch, useSelector } from 'react-redux';

// React Router
import { useParams } from 'react-router-dom';

// React Icons
import { BsArrow90DegDown } from 'react-icons/bs';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// Chakra
import { Divider, Icon, useToast } from '@chakra-ui/react';

// Slices
import { selectProducts } from '../../../../redux/slices/inventorySlice';
import {
  addToCart,
  selectCartProducts,
  setCartProducts
} from '../../../../redux/slices/cartSlice';
import { selectUser } from '../../../../redux/slices/userSlice';

// Firebase
import {
  addProductToCart,
  getCartProducts
} from '../../../../utils/firebase/firebase';

// Components
import QuantityController from '../../../../components/quantity-controller/quantity-controller';
import BackButton from '../../../../components/back-button/back-button';
import DetailImages from '../../../../components/detail/detail-images/detail-images';
import AddToCartButton from '../../../../components/add-to-cart-button/add-to-cart-button';
import ShareToSocialButtons from '../../../../components/share-to-social-buttons/share-to-social-buttons';

// Exports
import { NAVIGATION_PATHS } from '../../../../exports/constants';

// Styles
import './detail.scss';
import './detail.mobile.scss';

function Detail() {
  const toast = useToast();
  const dispatch = useDispatch();
  const params = useParams();

  const user = useSelector(selectUser);
  const products = useSelector(selectProducts);
  const cartProducts = useSelector(selectCartProducts);

  const selectedProduct = products.filter(
    (product) => product.id === params.productId
  )[0];

  const [mainImage, setMainImage] = useState('');
  const [otherImages, setOtherImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Sets the main image and other images when available
  useEffect(() => {
    setMainImage(selectedProduct && selectedProduct.pictures[0]);
    setOtherImages(
      selectedProduct &&
        selectedProduct.pictures.slice(1, selectedProduct.pictures.length)
    );
  }, [selectedProduct]);

  // Brings down the user's cart if it hasn't been loaded already
  useEffect(() => {
    if (cartProducts.length === 0 && user)
      getCartProducts(user.uid).then((res) => dispatch(setCartProducts(res)));
  }, [cartProducts.length, user, dispatch]);

  // Handles setting the main image and updating the list of other images
  function handleSelectedImage(event) {
    const selectedImage = event.target;
    setMainImage(selectedImage.src);
    setOtherImages(
      selectedProduct.pictures.filter(
        (picture) => picture !== selectedImage.src
      )
    );
  }

  // Returns whether or not a product is already in the user's cart
  function isItemAlreadyInCart() {
    return (
      cartProducts.filter((item) => item.productId === selectedProduct.id)
        .length === 1
    );
  }

  // Handles showing success or error messages when adding an item to the cart
  function handleAddToCartSuccessOrError(res) {
    const failedTitle = 'Failed to Add to Cart';
    const alreadyInCartDesc = 'This item is already in your cart.';

    if (!user) return true;
    else if (isItemAlreadyInCart()) {
      toast({
        title: failedTitle,
        description: alreadyInCartDesc,
        status: 'error',
        duration: 6000,
        isClosable: true
      });
      return true;
    } else if (!selectedProduct.availability) {
      toast({
        title: failedTitle,
        description: 'This item is currently out of stock.',
        status: 'error',
        duration: 6000,
        isClosable: true
      });
      return true;
    }

    if (res) {
      const description = () => {
        if (res.added) {
          const numOrders =
            quantity === 1 ? '1 order of ' : `${quantity} orders of `;
          const wasOrWere = quantity === 1 ? 'was' : 'were';
          return `${numOrders} ${selectedProduct.title} ${wasOrWere} added to your cart successfully!`;
        }

        if (!res.added && res.error === 'already-exists')
          return alreadyInCartDesc;

        return 'There was an error adding your item to your cart. Please try again later.';
      };

      toast({
        title: res.added ? 'Added to Cart' : failedTitle,
        description: description(),
        status: res.added ? 'success' : 'error',
        duration: 6000,
        isClosable: true
      });
    }
    return false;
  }

  // Handles adding an item to the user's cart
  async function handleAddToCart() {
    if (handleAddToCartSuccessOrError()) return;

    setAddingToCart(true);

    await addProductToCart(selectedProduct.id, quantity, user.uid).then(
      (res) => {
        handleAddToCartSuccessOrError(res);

        if (res.added) {
          dispatch(addToCart({ productId: selectedProduct.id, quantity }));
          setQuantity(1);
        }

        setAddingToCart(false);
      }
    );
  }

  return (
    <div className="main-container">
      <div className="detail-container">
        <Row>
          <Col>
            <div className="detail-back-button">
              <BackButton path={`/${NAVIGATION_PATHS.shop}`} />
            </div>
          </Col>
        </Row>
        {selectedProduct && (
          <Row sm={1} md={1} lg={1} xl={2}>
            <Col className="detail-images-container">
              <DetailImages
                mainImage={mainImage}
                otherImages={otherImages}
                handleSelectedImage={handleSelectedImage}
              />
            </Col>
            <Col className="detail-description-container">
              <h1 className="detail-title">{selectedProduct.title}</h1>

              <div className="detail-cost-container">
                <h2 className="detail-cost">${selectedProduct.totalCost()}</h2>
                <ul className="detail-cost-breakdown">
                  <li>Materials: ${selectedProduct.cost.materials}</li>
                  <li>Labor: ${selectedProduct.cost.labor}</li>
                </ul>
              </div>

              <div className="detail-category-avail-container">
                <h3 className="detail-category">
                  Category: <span>{selectedProduct.category}</span>
                </h3>
                <h3 className="detail-availability">
                  Availability:{' '}
                  <span
                    style={{ color: selectedProduct.getAvailabilityColor() }}
                  >
                    {selectedProduct.getAvailabilityString()}
                  </span>
                </h3>
              </div>
              <Divider className="detail-divider" color="lightgrey" />
              <p>{selectedProduct.description}</p>

              <div className="detail-quantity-container">
                <QuantityController
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
              </div>

              <div className="detail-add-to-cart-container">
                <AddToCartButton
                  selectedProduct={selectedProduct}
                  isItemAlreadyInCart={isItemAlreadyInCart}
                  addingToCart={addingToCart}
                  handleAddToCart={handleAddToCart}
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
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

export default Detail;
