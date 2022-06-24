import { createSlice } from '@reduxjs/toolkit';

let temp;

const initialState = (temp = sessionStorage.getItem('types')) ? JSON.parse(temp) : {};

const typesSlice = createSlice({
  name: 'types',
  initialState,
  reducers: {},
});

export const selectTypes = state => Object.values(state.types);

export default typesSlice.reducer;