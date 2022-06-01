import { configureStore } from '@reduxjs/toolkit';

import typesReducer from './slices/typesSlice.js';
import statusesReducer from './slices/statusesSlice.js';

export default configureStore({
  reducer: {
    types: typesReducer,
    statuses: statusesReducer,
  }
});