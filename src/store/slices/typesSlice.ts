import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../../store/store';

import type { IobjObj } from '../../commonTypes';

let temp : string;

const initialState : IobjObj = (temp = sessionStorage.getItem('types')!) ? JSON.parse(temp) : [];

const typesSlice = createSlice({
  name: 'types',
  initialState,
  reducers: {},
});

export const selectTypes = (state : RootState) => Object.values(state.types);

export default typesSlice.reducer;