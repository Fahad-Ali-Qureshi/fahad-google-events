import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  listOfVenues: [],
};

export const venuesSlice = createSlice({
  name: 'venues',
  initialState: initialState,
  reducers: {
    updateVenues: (state, action) => {
      state.listOfVenues = action.payload;
    },
  },
});

export const {updateVenues} = venuesSlice.actions;
export default venuesSlice.reducer;
