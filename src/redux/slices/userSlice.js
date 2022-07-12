import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  displayName: '',
  email: '',
  photoURL: '',
  phoneNumber: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.displayName = action.payload ? action.payload.displayName : '';
      state.email = action.payload ? action.payload.email : '';
      state.photoURL = action.payload ? action.payload.photoURL : '';
    },
    setDisplayName: (state, action) => {
      state.displayName = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPhotoURL: (state, action) => {
      state.photoURL = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    }
  }
});

// Setters
export const {
  setUser,
  setDisplayName,
  setEmail,
  setPhotoURL,
  setPhoneNumber
} = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.currentUser;
export const selectDisplayName = (state) => state.user.displayName;
export const selectEmail = (state) => state.user.email;
export const selectPhotoURL = (state) => state.user.photoURL;
export const selectPhoneNumber = (state) => state.user.phoneNumber;

export default userSlice.reducer;
