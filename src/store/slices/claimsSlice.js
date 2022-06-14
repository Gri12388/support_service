import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { pager } from '../../data/data.js';

const initialState = {
  //token: '',
  totalItems: 0,
  values: {},
  status: 'ok',
  error: false,
  errorMessage: ''
}

export const fetchClaims = createAsyncThunk('claims/fetchClaims', async ({token, offset, limit}) => {
  while(true) {
    const promise = await fetch (`http://localhost:3001/claim?offset=${offset}&limit=${limit}`, {
      method: 'GET',
      headers: {
      Authorization: `Bearer ${token}`
      },
    });
    //debugger
    if (promise.status !== 200) throw Error(promise.status);
    let result = await promise.json();
    let maxOffset = (Math.floor(result.totalItems / pager.base) * pager.base);
    if (offset <= maxOffset) {
      sessionStorage.setItem('offset', offset);
      return result;
    }
    offset = maxOffset;  
  }
});

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
    configSettings: (state, action) => {
      state.status = action.payload.status;
      if (action.payload.error !== null || action.payload.error !== undefined) {
        state.error = action.payload.error;
        state.errorMessage = action.payload.errorMessage;
      }
    }
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
      .addCase(fetchClaims.rejected, (state, action) => {
        state.status = 'ok';
        state.error = true;
        state.errorMessage = action.error.message ? action.error.message : 'Something wrong';
        state.totalItems = 0;
        state.values = {};
        console.log (action);
        //debugger
      })
  }, 
});

export const { upload, configSettings } = claimsSlice.actions;

export const selectClaims = state => Object.values(state.claims.values);

export const selectTotalClaimsNumber = state => state.claims.totalItems;

export const selectToken = state => state.claims.token;

export const selectStatus = state => state.claims.status;

export default claimsSlice.reducer;

//----------------------------

// export const postNewClaim = createAsyncThunk('claims/postNewClaim', async ({token, body}) => {
//   const promise = await fetch (`http://localhost:3001/claim`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${token}`
//     },
//     body: body
//   });
//   if (promise.status !== 200) throw Error(promise.status);
//   else return;
// })

// .addCase(postNewClaim.pending, state => {
//   state.status = 'loading';
// })
// .addCase(postNewClaim.fulfilled, state => {
//   state.status = 'ok';
// })
// .addCase(postNewClaim.rejected, state => {
//   state.status = 'ok';
//   state.error = true;
//   state.errorMessage = action.error.message ? action.error.message : 'Something wrong';
//   console.log (action);
// })