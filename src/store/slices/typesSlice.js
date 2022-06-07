import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  0: {id: 0, type: 'Hardware', color: '#7DB59A'},
  1: {id: 1, type: 'Software', color: '#FF7675'},
  2: {id: 2, type: 'Networking', color: '#FDCB6E'},
  3: {id: 3, type: 'Troubleshooting', color: '#6C5CE7'},
  4: {id: 4, type: 'Other', color: '#ADADAD'},
};

const typesSlice = createSlice({
  name: 'types',
  initialState,
  reducers: {},
});

export const selectTypes = state => Object.values(state.types);

export default typesSlice.reducer;