// React Redux
import { configureStore } from '@reduxjs/toolkit';

// Slices
import userReducer from './slices/userSlice';
import screenReducer from './slices/screenSlice';
import inventoryReducer from './slices/inventorySlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    screen: screenReducer,
    inventory: inventoryReducer,
    cart: cartReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});
