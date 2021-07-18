import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  price: 0,
  count: 0,
  amount: 0,
};

export const orderBookItemSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    updateAsk: (state, action) => {
      const key = action?.payload?.key;
      state.book.asks[key] = action.payload?.value;
    },
    updateBid: (state, action) => {
      const key = action?.payload?.key;
      state.book.bids[key] = action.payload?.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAsk, updateBid } = orderBookSlice.actions;

export default orderBookItemSlice.reducer;
