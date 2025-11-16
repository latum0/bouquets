import { configureStore } from '@reduxjs/toolkit';
import bouquetsReducer from './bouquetsSlice';

export const store = configureStore({
  reducer: {
    bouquets: bouquetsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
