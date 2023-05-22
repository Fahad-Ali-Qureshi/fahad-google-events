import {configureStore} from '@reduxjs/toolkit';
import venuesReducer from './VenuesSlice';

export const Store = configureStore({
  reducer: {
    venues: venuesReducer,
  },
});
