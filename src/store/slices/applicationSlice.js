import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL and other constants
const API_URL = import.meta.env.VITE_API_URL;
const REGISTRATION_CODE = "001cY00000JXauEQAT"; // You can also use an environment variable for this
const LEADSOURCE = import.meta.env.VITE_LEADSOURCE; // Lead source can also be dynamic from env

// Helper function to fetch data
const fetchData = async (endpoint, { accountId, leadSource }, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/services/apexrest/salesforce/portal/api/${endpoint}`,
      { accountId, leadSource },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Async thunks for fetching various lead statuses
export const getNewLead = createAsyncThunk(
  'application/getNewLead',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('getnewlead', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getPreApprovedLead = createAsyncThunk(
  'application/getPreApprovedLead',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('getpreapprovedlead', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getApprovedLead = createAsyncThunk(
  'application/getApprovedLead',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('getapprovedlead', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getApplicationDeclineLead = createAsyncThunk(
  'application/getApplicationDeclineLead',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('getapplicationdeclinelead', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getClosedLost = createAsyncThunk(
  'application/getClosedLost',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('getclosedlost', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getAllDeclined = createAsyncThunk(
  'application/getAllDeclined',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('getalldeclined', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

// Slice for application data
const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    newLeads: [],
    preApprovedLeads: [],
    approvedLeads: [],
    applicationDeclinedLeads: [],
    closedLostLeads: [],
    allDeclinedLeads: [],
    status: 'idle', // Can be 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle new leads
      .addCase(getNewLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getNewLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.newLeads = action.payload;
      })
      .addCase(getNewLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Handle pre-approved leads
      .addCase(getPreApprovedLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPreApprovedLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.preApprovedLeads = action.payload;
      })
      .addCase(getPreApprovedLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Handle approved leads
      .addCase(getApprovedLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getApprovedLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.approvedLeads = action.payload;
      })
      .addCase(getApprovedLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Handle application decline leads
      .addCase(getApplicationDeclineLead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getApplicationDeclineLead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applicationDeclinedLeads = action.payload;
      })
      .addCase(getApplicationDeclineLead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Handle closed lost leads
      .addCase(getClosedLost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getClosedLost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.closedLostLeads = action.payload;
      })
      .addCase(getClosedLost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Handle all declined leads
      .addCase(getAllDeclined.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllDeclined.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allDeclinedLeads = action.payload;
      })
      .addCase(getAllDeclined.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

// Export the reducer
export default applicationSlice.reducer;
