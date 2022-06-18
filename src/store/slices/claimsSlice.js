import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


import { pager, hosts, methods, publicPaths, claimsModes, claimsStatuses } from '../../data/data.js';

const initialState = {
  totalItems: 0,
  values: {},
  mode: claimsModes.default,
  status: claimsStatuses.ok,
  message: ''
}

export const fetchClaims = createAsyncThunk('claims/fetchClaims', async ({token, offset, limit, search, column, sort}) => {
  let urlTest = new URL(publicPaths.claim, hosts.local);
  urlTest.searchParams.append('offset', 0);
  urlTest.searchParams.append('limit', 1);
  if (search) urlTest.searchParams.append('search', `${search}`);
  
  let promise = await fetch (urlTest, {
      method: methods.get,
      headers: {
      Authorization: `Bearer ${token}`
      },
    });
  if (promise.status !== 200) throw Error(promise.status);
  let result = await promise.json();
  if (result.totalItems === 0) return result;
  let maxOffset = (Math.floor(result.totalItems / pager.base) * pager.base);
  if (isNaN(offset) || offset > maxOffset) offset = maxOffset;
  sessionStorage.setItem('offset', offset);

  let url = new URL(publicPaths.claim, hosts.local);
  url.searchParams.append('offset', `${offset}`);
  url.searchParams.append('limit', `${limit}`);
  if (search) url.searchParams.append('search', `${search}`);
  if (column) {
    url.searchParams.append('column', `${column}`);
    url.searchParams.append('sort', `${sort}`);
  }

  promise = await fetch (url, {
    method: methods.get,
    headers: {
    Authorization: `Bearer ${token}`
    },
  });
  if (promise.status !== 200) throw Error(promise.status);
  return await promise.json();
});

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    reset: state => {
      state = initialState;
    },
    upload: (state, action) => {
      state.totalItems = action.payload.totalItems;
      action.payload.claims.forEach((item, index) => {
        state.values[index] = item;
      });
    }, 
    configSettings: (state, action) => {
      if (action.payload.mode !== null && action.payload.mode !== undefined) state.mode = action.payload.mode; 
      if (action.payload.status !== null && action.payload.status !== undefined) state.status = action.payload.status; 
      if (action.payload.message !== null && action.payload.message !== undefined) state.message = action.payload.message;
    },  
  },
  extraReducers: builder => {
    builder
      .addCase(fetchClaims.pending, state => {
        state.status = claimsStatuses.loading;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.totalItems = action.payload.totalItems;
        let temp = {};
        if (action.payload.claims && Array.isArray(action.payload.claims)) {
          action.payload.claims.forEach((item, index) => {
            temp[index] = item;
          });
        }
        state.values = temp;
        state.status = claimsStatuses.ok;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.status = claimsStatuses.error;
        state.message = action.error.message ? action.error.message : 'Something wrong';
        state.totalItems = 0;
        state.values = {};
      })
  }, 
});

export const { reset, upload, configSettings } = claimsSlice.actions;

export const selectClaims = state => Object.values(state.claims.values);

export const selectTotalClaimsNumber = state => state.claims.totalItems;

export const selectModes = state => state.claims.mode;

export const selectStatus = state => state.claims.status;

export const selectMessage = state => state.claims.message;

export default claimsSlice.reducer;
