import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  sort: '',
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setCommonState: (state, action) => {
      if (action.payload.search !== null && action.payload.search !== undefined) state.search = action.payload.search;
      if (action.payload.sort !== null && action.payload.sort !== undefined) state.sort = action.payload.sort;
    },
  },
});

export const { setCommonState } = commonSlice.actions;

export const selectCommonState = state => state.common;

export default commonSlice.reducer;