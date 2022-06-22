import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  width: window.innerWidth
};

export const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    setScreenWidth: (state, action) => {
      state.width = action.payload;
    }
  }
});

// Setters
export const { setScreenWidth } = screenSlice.actions;

// Selectors
export const selectScreenWidth = (state) => state.screen.width;

export default screenSlice.reducer;
