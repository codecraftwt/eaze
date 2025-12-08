import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for Salesforce API from the .env file
const API_URL = import.meta.env.VITE_API_URL;
const REGISTRATION_CODE = import.meta.env.VITE_REGISTRATION_CODE;
const LEADSOURCE = import.meta.env.VITE_LEADSOURCE;

// Helper function to make API requests
const fetchData = async (endpoint, { accountId, leadSource }, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/services/apexrest/salesforce/portal/api/${endpoint}`,
      {
        accountId,
        leadSource,
      },
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

// Thunks for each API endpoint
export const getTotalApplicationsThisMonth = createAsyncThunk(
  'dashboard/getTotalApplicationsThisMonth',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('gettotalapplicationthismonth', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);

      console.log(data, 'data');
    return data?.data || [];
  }
);

export const getApprovedThisMonth = createAsyncThunk(
  'dashboard/getApprovedThisMonth',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('getapprovedthismonth', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getPreApprovedThisMonth = createAsyncThunk(
  'dashboard/getPreApprovedThisMonth',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('getpreapprovedthismonth', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getDeclinedThisMonth = createAsyncThunk(
  'dashboard/getDeclinedThisMonth',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('getdeclinethismonth', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTotalApplications = createAsyncThunk(
  'dashboard/getTotalApplications',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('gettotalapplication', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTotalApproved = createAsyncThunk(
  'dashboard/getTotalApproved',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('gettotalapproved', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTotalDeclined = createAsyncThunk(
  'dashboard/getTotalDeclined',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('gettotaldeclined', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTotalPreApproved = createAsyncThunk(
  'dashboard/getTotalPreApproved',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('gettotalpreapproved', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTotalDeclinePercent = createAsyncThunk(
  'dashboard/getTotalDeclinePercent',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('gettotaldeclinepercent', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTopDeclineReason = createAsyncThunk(
  'dashboard/getTopDeclineReason',
  async ({ accountId, leadSource, token }, { rejectWithValue }) => {
    const data = await fetchData('gettopdeclinereason', { accountId: REGISTRATION_CODE, leadSource: LEADSOURCE }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const transformLeadData = (data) => {
  return data.map(item => {
    const updatedItem = { ...item };
    // console.log(updatedItem,'updatedItem')

    // Check if Invoice_Paid_Date__c exists, replace it with CreatedDate
    if (updatedItem.Invoice_Paid_Date__c) {
      // updatedItem.CreatedDate = "2025-12-04T23:24:36.000+0000", // Replace date
      delete updatedItem.Invoice_Paid_Date__c; // Remove the old key
    }
    if (updatedItem.Declined_or_Closed_Lost_Date__c) {
      // updatedItem.CreatedDate = "2025-12-04T23:24:36.000+0000", // Replace date
      delete updatedItem.Declined_or_Closed_Lost_Date__c; // Remove the old key
    }
    return updatedItem;
  });
};

// Dashboard slice to handle state
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    totalApplicationsThisMonth: [],
    approvedApplicationsThisMonth: [],
    preApprovedApplicationsThisMonth: [],
    declinedApplicationsThisMonth: [],
    totalApplications: [],
    totalApproved: [],
    totalDeclined: [],
    totalPreApproved: [],
    totalDeclinePercent: null,
    topDeclineReason: null,
    status: 'idle', // 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle loading, success, and error for each thunk
      .addCase(getTotalApplicationsThisMonth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTotalApplicationsThisMonth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(action.payload, 'action.payload');
        let a = transformLeadData(action.payload)
        console.log(a,'transformLeadData(action.payload)')
        state.totalApplicationsThisMonth = transformLeadData(action.payload);
      })
      .addCase(getTotalApplicationsThisMonth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getApprovedThisMonth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getApprovedThisMonth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.approvedApplicationsThisMonth = transformLeadData(action.payload);
      })
      .addCase(getApprovedThisMonth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getPreApprovedThisMonth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPreApprovedThisMonth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.preApprovedApplicationsThisMonth = transformLeadData(action.payload);
      })
      .addCase(getPreApprovedThisMonth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getDeclinedThisMonth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDeclinedThisMonth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.declinedApplicationsThisMonth =transformLeadData(action.payload);
      })
      .addCase(getDeclinedThisMonth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getTotalApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTotalApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalApplications = transformLeadData(action.payload);
      })
      .addCase(getTotalApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getTotalApproved.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTotalApproved.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalApproved = transformLeadData(action.payload);
      })
      .addCase(getTotalApproved.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getTotalDeclined.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTotalDeclined.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalDeclined = transformLeadData(action.payload);
      })
      .addCase(getTotalDeclined.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getTotalPreApproved.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTotalPreApproved.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalPreApproved = transformLeadData(action.payload);
      })
      .addCase(getTotalPreApproved.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getTotalDeclinePercent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTotalDeclinePercent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalDeclinePercent = transformLeadData(action.payload);
      })
      .addCase(getTotalDeclinePercent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(getTopDeclineReason.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTopDeclineReason.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topDeclineReason = transformLeadData(action.payload);
      })
      .addCase(getTopDeclineReason.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error.message,'action.error.message')
        state.error = action.payload || action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
