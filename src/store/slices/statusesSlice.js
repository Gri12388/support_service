import { createSlice } from '@reduxjs/toolkit';

let temp;

const initialState = (temp = sessionStorage.getItem('statuses')) ? JSON.parse(temp) : {};

const statusesSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {},
});

export const selectStatuses = state => Object.values(state.statuses);

export default statusesSlice.reducer;