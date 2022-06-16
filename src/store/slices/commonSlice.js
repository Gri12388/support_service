import { createSlice } from '@reduxjs/toolkit';

import { sortOptions } from '../../data/data.js';

const initialState = {
  search: '',
  sort: sortOptions.asc,
  column: ''
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setCommonState: (state, action) => {
      if (action.payload.search !== null && action.payload.search !== undefined) state.search = action.payload.search;
      if (action.payload.sort !== null && action.payload.sort !== undefined) state.sort = action.payload.sort;
      if (action.payload.column !== null && action.payload.column !== undefined) state.column = action.payload.column;
    },
  },
});

export const { setCommonState } = commonSlice.actions;

export const selectCommonState = state => state.common;

export default commonSlice.reducer;