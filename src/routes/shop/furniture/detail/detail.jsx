// React
import { useEffect, useState } from 'react';

// React Router
import { useDispatch, useSelector } from 'react-redux';

// React Router
import { useParams } from 'react-router-dom';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// Chakra
import { useToast } from '@chakra-ui/react';

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
import BackButton from '../../../../components/back-button/back-button';
import DetailImages from '../../../../components/detail/detail-images/detail-images';
import DetailInfo from '../../../../components/detail/detail-info/detail-info';

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

  const [mainImage, setMainImage] = useState('');
  const [otherImages, setOtherImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const selectedProduct = products.filter(
    (product) => product.id === params.productId
  )[0];

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
    if (cartProducts.length === 0 && user) {
      setPageLoading(true);

      getCartProducts(user.uid).then((res) => {
        dispatch(setCartProducts(res));
        setPageLoading(false);
      });
    }
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
                pageLoading={pageLoading}
              />
            </Col>
            <Col>
              <DetailInfo
                selectedProduct={selectedProduct}
                quantity={quantity}
                setQuantity={setQuantity}
                isItemAlreadyInCart={isItemAlreadyInCart}
                addingToCart={addingToCart}
                handleAddToCart={handleAddToCart}
                pageLoading={pageLoading}
              />
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

export default Detail;
