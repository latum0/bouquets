import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Bouquet } from '../types/bouquet.dto';

export const fetchBouquets = createAsyncThunk('bouquets/fetch', async () => {
  const res = await fetch('http://localhost:5000/api/bouquets');
  if (!res.ok) throw new Error('Failed to fetch bouquets');
  const data = (await res.json()) as Bouquet[];
  try {
    localStorage.setItem('mesBouquets', JSON.stringify(data));
  } catch (e) {
  }
  return data;
});

interface BouquetsState {
  items: Bouquet[];
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
    setBouquets(state, action: PayloadAction<Bouquet[]>) {
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
