// Styles
import './cart-totals.scss';
import './cart-totals.mobile.scss';

function CartTotals({ materialsTotal, laborTotal, total }) {
  return (
    <div className="cart-checkout-totals-container">
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
