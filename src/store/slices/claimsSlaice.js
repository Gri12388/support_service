import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalItems: 0,
  values: {},
}

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    upload: (state, action) => {
      debugger
      state.totalItems = action.payload.totalItems;
      action.payload.claims.forEach((item, index) => {
        state.values[index] = item;
      });
    }
  },
});

export const { upload } = claimsSlice.actions;

export const selectClaims = state => Object.values(state.claims.values);

export const selectTotalClaimsNumber = state => state.claims.totalItems;

export default claimsSlice.reducer;