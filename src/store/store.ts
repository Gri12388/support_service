import { configureStore } from '@reduxjs/toolkit';

import claimsReducer from './slices/claimsSlice';
import pagerReducer from './slices/pagerSlice';
import commonReducer from './slices/commonSlice';

const store = configureStore({
  reducer: {
    claims: claimsReducer,
    pager: pagerReducer,
    common: commonReducer, 
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;