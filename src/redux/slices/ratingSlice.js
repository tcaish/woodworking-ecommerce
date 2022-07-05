import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ratings: []
};

export const ratingsSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    setRatings: (state, action) => {
      state.ratings = action.payload;
    },
    addRating: (state, action) => {
      state.ratings = [...state.ratings, action.payload];
    },
    removeRating: (state, action) => {
      state.ratings = state.ratings.filter(
        (rating) => rating.id !== action.payload.id
      );
    }
  }
});

// Setters
export const { removeRating, setRatings } = ratingsSlice.actions;

// Selectors
export const selectRatings = (state) => state.ratings.ratings;

export default ratingsSlice.reducer;
