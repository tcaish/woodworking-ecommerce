import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartProducts: [],
  cartQuantity: 0,
  promoCode: null
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartProducts: (state, action) => {
      state.cartProducts = action.payload;
      state.cartQuantity = action.payload.reduce(
        (prevValue, cartProd) => prevValue + cartProd.quantity,
        0
      );
    },
    addToCart: (state, action) => {
      state.cartProducts = [...state.cartProducts, action.payload];
      state.cartQuantity += action.payload.quantity;
    },
    updateCartProduct: (state, action) => {
      const index = state.cartProducts.findIndex(
        (cartProd) => cartProd.id === action.payload.id
      );
      const prevCartProduct = state.cartProducts.filter(
        (cartProduct) => cartProduct.id === action.payload.id
      )[0];

      const tempCartProducts = state.cartProducts.filter(
        (cartProduct) => cartProduct.id !== prevCartProduct.id
      );
      state.cartProducts = tempCartProducts.splice(index, 0, action.payload);
      state.cartQuantity =
        state.cartQuantity - prevCartProduct.quantity + action.payload.quantity;
    },
    setPromoCode: (state, action) => {
      state.promoCode = action.payload;
    }
  }
});

// Setters
export const { setCartProducts, addToCart, updateCartProduct, setPromoCode } =
  cartSlice.actions;

// Selectors
export const selectCartProducts = (state) => state.cart.cartProducts;
export const selectCartQuantity = (state) => state.cart.cartQuantity;
export const selectPromoCode = (state) => state.cart.promoCode;

export default cartSlice.reducer;
