import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartProducts: [],
  cartQuantity: 0
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
    removeFromCart: (state, action) => {
      state.cartProducts = state.cartProducts.filter(
        (cartProduct) => cartProduct.product !== action.payload.product
      );
      state.cartQuantity -= action.payload.quantity;
    },
    updateQuantity: (state, action) => {
      const productToUpdateIndex = state.cartProducts.findIndex(
        (cartProduct) => cartProduct.id === action.payload.id
      );
      state.cartProducts[productToUpdateIndex].quantity =
        action.payload.quantity;

      state.cartQuantity =
        state.cartQuantity -
        state.cartProducts[productToUpdateIndex].quantity +
        action.payload.quantity;
    }
  }
});

// Setters
export const { setCartProducts, addToCart, removeFromCart, updateQuantity } =
  cartSlice.actions;

// Selectors
export const selectCartProducts = (state) => state.cart.cartProducts;
export const selectCartQuantity = (state) => state.cart.cartQuantity;

export default cartSlice.reducer;
