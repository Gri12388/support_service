import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../store/store';

import type { IpagerSliceState, IsetPagerStatePayload } from '../../commonTypes';

const initialState : IpagerSliceState = {
  offset: 0,
  last: 0,
  start: 0,
  stop: 0,
  pointer: 0,
  displayLeft: false,
  displayRight: false,
};

const pagerSlice = createSlice({
  name: 'pager',
  initialState,
  reducers: {
    setPagerState: (state, action : PayloadAction<IsetPagerStatePayload>) => {
      if (action.payload.offset !== null && action.payload.offset !== undefined) state.offset = action.payload.offset;
      if (action.payload.last !== null && action.payload.last !== undefined) state.last = action.payload.last;
      if (action.payload.start !== null && action.payload.start !== undefined) state.start = action.payload.start;
      if (action.payload.stop !== null && action.payload.stop !== undefined) state.stop = action.payload.stop;
      if (action.payload.pointer !== null && action.payload.pointer !== undefined) state.pointer = action.payload.pointer;
      if (action.payload.displayLeft !== null && action.payload.displayLeft !== undefined) state.displayLeft = action.payload.displayLeft;
      if (action.payload.displayRight !== null && action.payload.displayRight !== undefined) state.displayRight = action.payload.displayRight;

    },
    resetPagerState: state => {
      state = initialState;

    }
  },
});

export const { setPagerState, resetPagerState } = pagerSlice.actions;

export const selectPagerState = (state : RootState) => state.pager;

export default pagerSlice.reducer;