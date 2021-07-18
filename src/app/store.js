import { configureStore } from '@reduxjs/toolkit';

import orderBookReducer from '../features/OrderBook/orderBookSlice';

export const store = configureStore({
  reducer: {
    orderBook: orderBookReducer,
  },
});
