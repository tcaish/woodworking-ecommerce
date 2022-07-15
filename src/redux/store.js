// React Redux
import { configureStore } from '@reduxjs/toolkit';

// Slices
import userReducer from './slices/userSlice';
import screenReducer from './slices/screenSlice';
import inventoryReducer from './slices/inventorySlice';
import cartReducer from './slices/cartSlice';
import ratingsReducer from './slices/ratingSlice';
import routingSlice from './slices/routingSlice';
import ordersSlice from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    screen: screenReducer,
    inventory: inventoryReducer,
    cart: cartReducer,
    ratings: ratingsReducer,
    routing: routingSlice,
    orders: ordersSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});
