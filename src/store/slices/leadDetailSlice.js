import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { withSalesforce401Retry } from '../salesforceWith401Retry';

const API_URL = import.meta.env.VITE_API_URL;

export const getLeadData = createAsyncThunk(
  'leadDetail/getLeadData',
  async ({ leadId, token }, { rejectWithValue, dispatch, getState }) => {
    try {
      const payload = await withSalesforce401Retry(dispatch, getState, token, async (accessToken) => {
        const response = await axios.get(`${API_URL}/services/apexrest/salesforce/portal/api/leadData/${leadId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const { Id, ...data } = response.data;
        return data;
      });
      return payload;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const leadDetailSlice = createSlice({
  name: 'leadDetail',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLeadData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLeadData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getLeadData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default leadDetailSlice.reducer;

