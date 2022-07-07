import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPath: '/'
};

export const routingSlice = createSlice({
  name: 'routing',
  initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload;
    }
  }
});

// Setters
export const { setCurrentPath } = routingSlice.actions;

// Selectors
export const selectCurrentPath = (state) => state.routing.currentPath;

export default routingSlice.reducer;
