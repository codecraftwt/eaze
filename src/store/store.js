// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage for persistence
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice'; 
import applicationReducer from './slices/applicationSlice';

// Create persist configuration for the auth slice
const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['auth'], // Persist only the auth slice (including portalUserId)
};

// Wrap the authReducer with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    dashboard: dashboardReducer,
    application: applicationReducer,
  },
});

// Create a persistor for handling the persistence of state
const persistor = persistStore(store);

export { store, persistor };
