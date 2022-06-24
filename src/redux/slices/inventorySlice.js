import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: []
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    }
  }
});

// Setters
export const { setProducts } = inventorySlice.actions;

// Selectors
export const selectProducts = (state) => state.inventory.products;

export default inventorySlice.reducer;
