import { configureStore } from '@reduxjs/toolkit';

import typesReducer from './slices/typesSlice.js';
import statusesReducer from './slices/statusesSlice.js';
import claimsReducer from './slices/claimsSlice.js';
import pagerReducer from './slices/pagerSlice.js';
import commonReducer from './slices/commonSlice.js';

//export default configureStore({
const store = configureStore({
  reducer: {
    types: typesReducer,
    statuses: statusesReducer,
    claims: claimsReducer,
    pager: pagerReducer,
    common: commonReducer, 
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;