import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../store/store';

import type { IobjObj } from '../../commonTypes';

let temp : string;

const initialState: IobjObj = (temp = sessionStorage.getItem('statuses')!) ? JSON.parse(temp) : {};

const statusesSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {},
});

export const selectStatuses = (state : RootState) => Object.values(state.statuses);

export default statusesSlice.reducer;