import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  0: {id: 0, type: 'NEW', color: '#6C5CE7'},
  1: {id: 1, type: 'DONE', color: '#00B894'},
  2: {id: 2, type: 'IN PROGRESS', color: '#FDCB6E'},
  3: {id: 3, type: 'DECLINED', color: '#E84393'},
};

const postsSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {},
});

export const selectStatuses = state => Object.values(state.statuses);

export default postsSlice.reducer;