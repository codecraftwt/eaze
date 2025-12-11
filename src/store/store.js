// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice'; 
import applicationReducer from './slices/applicationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    application: applicationReducer,
  },
});

export default store;
