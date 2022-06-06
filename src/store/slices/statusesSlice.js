import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  0: {id: 0, status: 'NEW', color: '#6C5CE7'},
  1: {id: 1, status: 'DONE', color: '#00B894'},
  2: {id: 2, status: 'IN PROGRESS', color: '#FDCB6E'},
  3: {id: 3, status: 'DECLINED', color: '#E84393'},
};

const statusesSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {},
});

export const selectStatuses = state => Object.values(state.statuses);

export default statusesSlice.reducer;