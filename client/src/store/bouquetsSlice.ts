import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {  BouquetT } from '../types/bouquet.dto';
import { myFetch } from '../comm/fetchOrAxios';

export const fetchBouquets = createAsyncThunk('bouquets/fetch', async () => {
  const data = await myFetch("http://localhost:5000/api/bouquets",{})
  return data;
});

interface BouquetsState {
  items: BouquetT[];
  loading: boolean;
  error?: string;
}

const initialState: BouquetsState = {
  items: [],
  loading: false,
};

const bouquetsSlice = createSlice({
  name: 'bouquets',
  initialState,
  reducers: {
    setBouquets(state, action: PayloadAction<BouquetT[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBouquets.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchBouquets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBouquets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setBouquets } = bouquetsSlice.actions;
export default bouquetsSlice.reducer;
