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
    setQuantity: (state, action) => {
      const productToUpdateIndex = state.cartProducts.findIndex(
        (product) => product.id === action.payload.id
      );
      state.cartProducts[productToUpdateIndex].quantity =
        action.payload.quantity;
    }
  }
});

// Setters
export const { setCartProducts, setQuantity } = cartSlice.actions;

// Selectors
export const selectCartProducts = (state) => state.cart.cartProducts;

export default cartSlice.reducer;
