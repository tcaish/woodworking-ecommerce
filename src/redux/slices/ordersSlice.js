import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: []
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    }
  }
});

// Setters
export const { setOrders } = ordersSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;

export default ordersSlice.reducer;
