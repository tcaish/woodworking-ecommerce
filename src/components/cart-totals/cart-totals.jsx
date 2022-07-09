// React
import { useState } from 'react';

// React Redux
import { useSelector } from 'react-redux';

// Chakra
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react';

// Firebase
import { getPromoCode } from '../../utils/firebase/firebase';

// Slices
import { selectUser } from '../../redux/slices/userSlice';

// Styles
import './cart-totals.scss';
import './cart-totals.mobile.scss';

function CartTotals({ materialsTotal, laborTotal, total }) {
  const toast = useToast();

  const user = useSelector(selectUser);

  const [promoCode, setPromoCode] = useState('');
  const [submittingPromoCode, setSubmittingPromoCode] = useState(false);
  const [promoCodeInvalid, setPromoCodeInvalid] = useState(false);

  // Submits promo code and applies discount if it exists
  async function submitPromoCode() {
    if (promoCode === '') {
      setPromoCodeInvalid(true);
      return;
    }

    setSubmittingPromoCode(true);

    await getPromoCode(promoCode, user.uid)
      .then((res) => {
        setSubmittingPromoCode(false);
        handlePromoCodeSuccessError(res);
      })
      .catch((err) => {
        setSubmittingPromoCode(false);
        setPromoCodeInvalid(true);
        handlePromoCodeSuccessError({ error: err });
      });
  }

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
        'This promo code has either already been applied to this order or a previous order.';
    } else if (res.error) {
      title = 'Promo Code Error';
      description =
        'There was an issue submitting the promo code. Please try again later.';
    }

    setPromoCodeInvalid(res.error && true);
    setPromoCode(!res.error ? '' : promoCode);

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
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
        </FormControl>

        <Button isLoading={submittingPromoCode} onClick={submitPromoCode}>
          Submit
        </Button>
      </div>

      <div className="cart-checkout-materials-container cart-checkout-grid">
        <p className="cart-checkout-title">Materials</p>
        <p className="cart-checkout-value">{`$${materialsTotal}`}</p>
      </div>

      <div className="cart-checkout-labor-container cart-checkout-grid">
        <p className="cart-checkout-title">Labor</p>
        <p className="cart-checkout-value">{`$${laborTotal}`}</p>
      </div>

      <div className="cart-checkout-total-container cart-checkout-grid">
        <p className="cart-checkout-title">Total</p>
        <p className="cart-checkout-value">{`$${total}`}</p>
      </div>
    </div>
  );
}

export default CartTotals;
