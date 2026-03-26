// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage for persistence
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice'; 
import applicationReducer from './slices/applicationSlice';
import leadDetailReducer from './slices/leadDetailSlice';

// Salesforce OAuth tokens expire; persisting them caused stale tokens in normal Chrome
// while incognito (no persisted state) always fetched a fresh token. Strip on read/write.
const omitSalesforceToken = (state) => {
  if (state == null || typeof state !== 'object') return state;
  const { salesforceToken: _removed, ...rest } = state;
  return rest;
};

const salesforceTokenTransform = createTransform(
  (inboundState) => omitSalesforceToken(inboundState),
  (outboundState) => omitSalesforceToken(outboundState),
);

// Create persist configuration for the auth slice
const persistConfig = {
  key: 'root',
  storage,
  transforms: [salesforceTokenTransform],
};

// Wrap the authReducer with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    dashboard: dashboardReducer,
    application: applicationReducer,
    leadDetail: leadDetailReducer,
  },
});

// Create a persistor for handling the persistence of state
const persistor = persistStore(store);

export { store, persistor };
