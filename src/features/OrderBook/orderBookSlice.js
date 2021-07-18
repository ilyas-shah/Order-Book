import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  book: {
    asks: null,
    bids: null,
  },
  loading: false,
};

export const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    updateAsks: (state, action) => {
      state.book.asks = action.payload;
    },
    updateBids: (state, action) => {
      state.book.bids = action.payload;
    },
    updateAsk: (state, action) => {
      const key = action?.payload?.key;
      state.book.asks[key] = action.payload?.value;
    },
    updateBid: (state, action) => {
      const key = action?.payload?.key;
      state.book.bids[key] = action.payload?.value;
    },
    toggleLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAsks, updateBids, updateAsk, updateBid, toggleLoading } =
  orderBookSlice.actions;

export default orderBookSlice.reducer;
