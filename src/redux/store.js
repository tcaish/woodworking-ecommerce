// React Redux
import { configureStore } from '@reduxjs/toolkit';

// Slices
import userReducer from './slices/userSlice';
import screenReducer from './slices/screenSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    screen: screenReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});
