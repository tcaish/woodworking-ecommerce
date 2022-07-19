import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  filteredProducts: []
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    }
  }
});

// Setters
export const { setProducts, setFilteredProducts } = inventorySlice.actions;

// Selectors
export const selectProducts = (state) => state.inventory.products;
export const selectFilteredProducts = (state) =>
  state.inventory.filteredProducts;

export default inventorySlice.reducer;
