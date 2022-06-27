import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartProducts: []
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartProducts: (state, action) => {
      state.cartProducts = action.payload;
    },
    addToCart: (state, action) => {
      state.cartProducts = [...state.cartProducts, action.payload];
    },
    removeFromCart: (state, action) => {
      state.cartProducts = state.cartProducts.filter(
        (product) => product.productId !== action.payload.productId
      );
    },
    updateQuantity: (state, action) => {
      const productToUpdateIndex = state.cartProducts.findIndex(
        (product) => product.id === action.payload.id
      );
      state.cartProducts[productToUpdateIndex].quantity =
        action.payload.quantity;
    }
  }
});

// Setters
export const { setCartProducts, addToCart, removeFromCart, updateQuantity } =
  cartSlice.actions;

// Selectors
export const selectCartProducts = (state) => state.cart.cartProducts;

export default cartSlice.reducer;
