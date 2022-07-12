// React
import { useState } from 'react';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Chakra
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react';

// Firebase
import {
  addPromoCodeToCartProducts,
  getPromoCode
} from '../../utils/firebase/firebase';

// Slices
import { selectUser } from '../../redux/slices/userSlice';
import {
  selectCartTotal,
  selectPromoCode,
  setPromoCode
} from '../../redux/slices/cartSlice';

// Styles
import './cart-totals.scss';
import './cart-totals.mobile.scss';

function CartTotals(props) {
  const toast = useToast();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const promoCode = useSelector(selectPromoCode);
  const total = useSelector(selectCartTotal);

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [submittingPromoCode, setSubmittingPromoCode] = useState(false);
  const [promoCodeInvalid, setPromoCodeInvalid] = useState(false);

  // Submits promo code and applies discount if it exists
  async function submitPromoCode() {
    if (promoCodeInput === '') {
      setPromoCodeInvalid(true);
      return;
    }

    setSubmittingPromoCode(true);

    await getPromoCode(promoCodeInput, user.uid)
      .then((code) => {
        if (!code.error) {
          addPromoCodeToCartProducts(code.id, user.uid)
            .then((res) => {
              handlePromoCodeSuccessError(!res.error ? code : res);
              setSubmittingPromoCode(false);
            })
            .catch((err) => {
              handlePromoCodeSuccessError({ error: err });
              setSubmittingPromoCode(false);
            });
        } else {
          handlePromoCodeSuccessError(code);
          setSubmittingPromoCode(false);
        }
      })
      .catch((err) => {
        setSubmittingPromoCode(false);
        setPromoCodeInvalid(true);
        handlePromoCodeSuccessError({ error: err });
      });
  }

  // Handles showing success or error messages depending on the result of
  // submitting the promo code.
  function handlePromoCodeSuccessError(res) {
    let title = 'Promo Code Accepted';
    let description = `A discount of ${
      res.discount * 100
    }% has been applied to your order.`;

    if (res.error && res.error === 'invalid') {
      title = 'Invalid Promo Code';
      description = 'You entered an invalid promo code. Please try again!';
    } else if (res.error && res.error === 'applied') {
      title = 'Promo Code Already Used';
      description =
        'This promo code has either already been applied to this order or a previous order. Please try a different code!';
    } else if (res.error && res.error === 'expired') {
      title = 'Promo Code Expired';
      description = 'This promo code has expired.';
    } else if (res.error) {
      title = 'Promo Code Error';
      description =
        'There was an issue submitting the promo code. Please try again later.';
    }

    if (!res.error) dispatch(setPromoCode(res));
    setPromoCodeInvalid(res.error && true);
    setPromoCodeInput(!res.error ? '' : promoCodeInput);

    toast({
      title: title,
      description: description,
      status: res.error ? 'error' : 'success',
      duration: 6000,
      isClosable: true
    });
  }

  return (
    <div className="cart-checkout-totals-container">
      <div className="cart-checkout-promo-container">
        <FormControl isInvalid={promoCodeInvalid}>
          <FormLabel htmlFor="promoCode">Promo Code</FormLabel>
          <Input
            id="promoCode"
            type="text"
            placeholder="Enter Promo Code"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
          />
        </FormControl>

        <Button isLoading={submittingPromoCode} onClick={submitPromoCode}>
          Submit
        </Button>
      </div>

      <div className="cart-checkout-materials-container cart-checkout-grid">
        <p className="cart-checkout-title">Materials</p>
        <p className="cart-checkout-value">{`$${props.materialsTotal}`}</p>
      </div>

      <div className="cart-checkout-labor-container cart-checkout-grid">
        <p className="cart-checkout-title">Labor</p>
        <p className="cart-checkout-value">{`$${props.laborTotal}`}</p>
      </div>

      {promoCode && (
        <div className="cart-checkout-discount-container cart-checkout-grid">
          <p className="cart-checkout-title">Discount</p>
          <p className="cart-checkout-value">{`-$${props.discountTotal}`}</p>
        </div>
      )}

      <div className="cart-checkout-total-container cart-checkout-grid">
        <p className="cart-checkout-title">Total</p>
        <p className="cart-checkout-value">{`$${total}`}</p>
      </div>
    </div>
  );
}

export default CartTotals;
