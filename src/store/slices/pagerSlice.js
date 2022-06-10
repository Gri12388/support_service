import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  offset: null,
  last: null,
  start: null,
  stop: null,
  pointer: null,
  displayLeft: null,
  displayRight: null,
};

const pagerSlice = createSlice({
  name: 'pager',
  initialState,
  reducers: {
    setPagerState: (state, action) => {
      if (action.payload.offset !== null && action.payload.offset !== undefined) state.offset = action.payload.offset;
      if (action.payload.last !== null && action.payload.last !== undefined) state.last = action.payload.last;
      if (action.payload.start !== null && action.payload.start !== undefined) state.start = action.payload.start;
      if (action.payload.stop !== null && action.payload.stop !== undefined) state.stop = action.payload.stop;
      if (action.payload.pointer !== null && action.payload.pointer !== undefined) state.pointer = action.payload.pointer;
      if (action.payload.displayLeft !== null && action.payload.displayLeft !== undefined) state.displayLeft = action.payload.displayLeft;
      if (action.payload.displayRight !== null && action.payload.displayRight !== undefined) state.displayRight = action.payload.displayRight;

    }
  },
});

export const { setPagerState } = pagerSlice.actions;

export const selectPagerState = state => state.pager;

export default pagerSlice.reducer;