import { configureStore } from '@reduxjs/toolkit';

import typesReducer from './slices/typesSlice';
import statusesReducer from './slices/statusesSlice';
import claimsReducer from './slices/claimsSlice';
import pagerReducer from './slices/pagerSlice';
import commonReducer from './slices/commonSlice';

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