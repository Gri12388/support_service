import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { pager } from '../../data/data.js';

const initialState = {
  token: '',
  totalItems: 0,
  values: {},
  status: 'ok'
}

export const fetchClaims = createAsyncThunk('claims/fetchClaims', async ({token, offset, limit}) => {
  while(true) {
    const promise = await fetch (`http://localhost:3001/claim?offset=${offset}&limit=${limit}`, {
      method: 'GET',
      headers: {
      Authorization: `Bearer ${token}`
      },
    });
    if (promise.status !== 200) return;
    let result = await promise.json();
    let maxOffset = Math.floor(result.totalItems / pager.base);
    if (offset <= maxOffset) {
      localStorage.setItem('offset', offset);
      return result;
    }
    offset = maxOffset;  
  }
})

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    upload: (state, action) => {
      if (action.payload.token) state.token = action.payload.token;
      state.totalItems = action.payload.totalItems;
      action.payload.claims.forEach((item, index) => {
        state.values[index] = item;
      });
    }, 
  },
  extraReducers: builder => {
    builder
      .addCase(fetchClaims.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.totalItems = action.payload.totalItems;
        let temp = {};
        action.payload.claims.forEach((item, index) => {
          temp[index] = item;
        });
        state.values = temp;
        state.status = 'ok';
      
      })
  }, 
});

export const { upload } = claimsSlice.actions;

export const selectClaims = state => Object.values(state.claims.values);

export const selectTotalClaimsNumber = state => state.claims.totalItems;

export const selectToken = state => state.claims.token;

export const selectStatus = state => state.claims.status;

export default claimsSlice.reducer;

