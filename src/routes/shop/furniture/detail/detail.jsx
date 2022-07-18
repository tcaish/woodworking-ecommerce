// React
import { useEffect, useState } from 'react';

// React Router
import { useDispatch, useSelector } from 'react-redux';

// React Router
import { useParams } from 'react-router-dom';

// React Icons
import { FaQuestionCircle } from 'react-icons/fa';

// Bootstrap
import { Col, Row } from 'react-bootstrap';

// Chakra
import { useToast, Divider, useDisclosure } from '@chakra-ui/react';

// Slices
import { selectProducts } from '../../../../redux/slices/inventorySlice';
import {
  addToCart,
  selectCartProducts
} from '../../../../redux/slices/cartSlice';
import { selectUser } from '../../../../redux/slices/userSlice';
import {
  selectRatings,
  setRatings
} from '../../../../redux/slices/ratingSlice';

// Firebase
import {
  addProductToCart,
  getRatings
} from '../../../../utils/firebase/firebase';

// Components
import BackButton from '../../../../components/back-button/back-button';
import DetailImages from '../../../../components/detail/detail-images/detail-images';
import DetailInfo from '../../../../components/detail/detail-info/detail-info';
import NotSignedInModal from '../../../../components/modals/not-signed-in-modal/not-signed-in-modal';
import PageEmpty from '../../../../components/page-empty/page-empty';

// Exports
import { NAVIGATION_PATHS } from '../../../../exports/constants';

// Styles
import './detail.scss';
import './detail.mobile.scss';
import {
  OverallRating,
  SubmitRating
} from '../../../../components/rating/rating';

function Detail() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();
  const params = useParams();

  const user = useSelector(selectUser);
  const products = useSelector(selectProducts);
  const cartProducts = useSelector(selectCartProducts);
  const ratings = useSelector(selectRatings);

  const [mainImage, setMainImage] = useState('');
  const [otherImages, setOtherImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [showNotSignedInModal, setShowNotSignedInModal] = useState(false);

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

  // Brings down the ratings if it hasn't been loaded already
  useEffect(() => {
    if (ratings.length === 0 && user && selectedProduct) {
      setRatingsLoading(true);

      getRatings().then((res) => {
        dispatch(setRatings(res));
        setRatingsLoading(false);
      });
    }
  }, [ratings.length, user, dispatch, selectedProduct]);

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
      cartProducts.filter((item) => item.product === selectedProduct.id)
        .length === 1
    );
  }

  // Handles showing success or error messages when adding an item to the cart
  function handleAddToCartSuccessOrError(res) {
    const failedTitle = 'Failed to Add to Cart';
    const alreadyInCartDesc = 'This item is already in your cart.';

    if (!user) {
      setShowNotSignedInModal(true);
      onOpen();
      return true;
    } else if (isItemAlreadyInCart()) {
      toast({
        title: failedTitle,
        description: alreadyInCartDesc,
        status: 'error',
        duration: 7000,
        isClosable: true
      });
      return true;
    } else if (!selectedProduct.availability) {
      toast({
        title: failedTitle,
        description: 'This item is currently out of stock.',
        status: 'error',
        duration: 7000,
        isClosable: true
      });
      return true;
    } else if (!color) {
      toast({
        title: failedTitle,
        description: 'Please select a color for this item.',
        status: 'error',
        duration: 7000,
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
        duration: 7000,
        isClosable: true
      });
    }
    return false;
  }

  // Handles adding an item to the user's cart
  async function handleAddToCart() {
    if (handleAddToCartSuccessOrError()) return;

    setAddingToCart(true);

    await addProductToCart(
      color,
      notes,
      selectedProduct.id,
      quantity,
      user.uid
    ).then((res) => {
      handleAddToCartSuccessOrError(res);

      if (res.added) {
        dispatch(
          addToCart({ color, notes, product: selectedProduct.id, quantity })
        );
        setQuantity(1);
      }

      setAddingToCart(false);
    });
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
        {!selectedProduct ? (
          <PageEmpty
            icon={FaQuestionCircle}
            title="We cannot find that product!"
            text="Maybe you can find what you need with the search bar."
            linkPath={`/${NAVIGATION_PATHS.shop}`}
            linkText="Let's search."
          />
        ) : (
          <>
            <Row sm={1} md={1} lg={1} xl={2}>
              <Col className="detail-images-container">
                <DetailImages
                  mainImage={mainImage}
                  otherImages={otherImages}
                  handleSelectedImage={handleSelectedImage}
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
                  color={color}
                  setColor={setColor}
                  notes={notes}
                  setNotes={setNotes}
                />
              </Col>
            </Row>

            <Divider className="review-divider" color="lightgrey" />

            <Row className="review-container" sm={1} md={1} lg={1} xl={2}>
              <Col>
                <OverallRating
                  productId={selectedProduct.id}
                  ratingsLoading={ratingsLoading}
                />
              </Col>
              <Col>
                <SubmitRating
                  productId={selectedProduct.id}
                  ratingsLoading={ratingsLoading}
                />
              </Col>
            </Row>

            {showNotSignedInModal && (
              <NotSignedInModal
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Detail;
