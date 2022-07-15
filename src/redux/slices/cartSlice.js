import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartProducts: [],
  cartQuantity: 0,
  promoCode: null,
  total: 0,
  discountTotal: 0,
  orderDescription: '',
  orderMetaData: {}
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
    setPromoCode: (state, action) => {
      state.promoCode = action.payload;
    },
    setCartTotal: (state, action) => {
      state.total = action.payload;
    },
    setDiscountTotal: (state, action) => {
      state.discountTotal = action.payload;
    },
    setOrderDescription: (state, action) => {
      state.orderDescription = action.payload;
    },
    setOrderMetaData: (state, action) => {
      state.orderMetaData = action.payload;
    }
  }
});

// Setters
export const {
  setCartProducts,
  addToCart,
  updateCartProduct,
  setPromoCode,
  setCartTotal,
  setDiscountTotal,
  setOrderDescription,
  setOrderMetaData
} = cartSlice.actions;

// Selectors
export const selectCartProducts = (state) => state.cart.cartProducts;
export const selectCartQuantity = (state) => state.cart.cartQuantity;
export const selectPromoCode = (state) => state.cart.promoCode;
export const selectCartTotal = (state) => state.cart.total;
export const selectDiscountTotal = (state) => state.cart.discountTotal;
export const selectOrderDescription = (state) => state.cart.orderDescription;
export const selectOrderMetaData = (state) => state.cart.orderMetaData;

export default cartSlice.reducer;
