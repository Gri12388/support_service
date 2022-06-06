import { configureStore } from '@reduxjs/toolkit';

import typesReducer from './slices/typesSlice.js';
import statusesReducer from './slices/statusesSlice.js';
import claimsReducer from './slices/claimsSlaice.js';

export default configureStore({
  reducer: {
    types: typesReducer,
    statuses: statusesReducer,
    claims: claimsReducer,
  }
});