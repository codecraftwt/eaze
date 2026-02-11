import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for Salesforce API from the .env file
const API_URL = import.meta.env.VITE_API_URL;
const REGISTRATION_CODE = "001cY00000JXauEQAT";
// const REGISTRATION_CODE = import.meta.env.VITE_REGISTRATION_CODE;
const LEADSOURCE = import.meta.env.VITE_LEADSOURCE;

// Helper function to make API requests
const fetchData = async (endpoint, { accountId, leadSource,month,year }, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/services/apexrest/salesforce/portal/api/${endpoint}`,
      {
        accountId,
        leadSource,
        month: month ?? 0,
        year: year ?? 0,
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
const fetchData2 = async (endpoint, { accountId, leadSource }, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/services/apexrest/salesforce/portal/api/${endpoint}`,
      {
        accountId,
        leadSource,
        month: 1,
        year: 2026,
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
const fetchData3 = async (endpoint, { accountId, leadSource }, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/services/apexrest/salesforce/portal/api/${endpoint}`,
      {
        accountId,
        leadSource,
        // month: 1,
        // year: 2026,
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
  async ({ accountId, leadSource, token, month,year }, { rejectWithValue }) => {
    const data = await fetchData('gettotalapplicationthismonth', { accountId: accountId, leadSource: LEADSOURCE,month:month,year:year }, token)
      .catch(rejectWithValue);

      // //console.log(data, 'data');
    return data?.data || [];
  }
);

export const getApprovedThisMonth = createAsyncThunk(
  'dashboard/getApprovedThisMonth',
  async ({ accountId, leadSource, token , month,year}, { rejectWithValue }) => {
    const data = await fetchData('getapprovedthismonth', { accountId: accountId, leadSource: LEADSOURCE,month:month,year:year }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getPreApprovedThisMonth = createAsyncThunk(
  'dashboard/getPreApprovedThisMonth',
  async ({ accountId, leadSource, token, month,year }, { rejectWithValue }) => {
    const data = await fetchData('getpreapprovedthismonth', { accountId: accountId, leadSource: LEADSOURCE,month:month,year:year }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getDeclinedThisMonth = createAsyncThunk(
  'dashboard/getDeclinedThisMonth',
  async ({ accountId, leadSource, token , month,year}, { rejectWithValue }) => {
    const data = await fetchData('getdeclinethismonth', { accountId: accountId, leadSource: LEADSOURCE,month:month,year:year }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTotalApplications = createAsyncThunk(
  'dashboard/getTotalApplications',
  async ({ accountId, leadSource, token , month,year}, { rejectWithValue }) => {
    const data = await fetchData('gettotalapplication', { accountId: accountId, leadSource: LEADSOURCE,month:month,year:year }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTotalApproved = createAsyncThunk(
  'dashboard/getTotalApproved',
  async ({ accountId, leadSource, token, month,year}, { rejectWithValue }) => {
    const data = await fetchData('gettotalapproved', { accountId: accountId, leadSource: LEADSOURCE,month:month,year:year }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTotalDeclined = createAsyncThunk(
  'dashboard/getTotalDeclined',
  async ({ accountId, leadSource, token , month,year}, { rejectWithValue }) => {
    const data = await fetchData('gettotaldeclined', { accountId: accountId, leadSource: LEADSOURCE,month:month,year:year }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTotalPreApproved = createAsyncThunk(
  'dashboard/getTotalPreApproved',
  async ({ accountId, leadSource, token, month,year }, { rejectWithValue }) => {
    const data = await fetchData('gettotalpreapproved', { accountId: accountId, leadSource: LEADSOURCE,month:month,year:year }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTotalDeclinePercent = createAsyncThunk(
  'dashboard/getTotalDeclinePercent',
  async ({ accountId, leadSource, token , month,year}, { rejectWithValue }) => {
    const data = await fetchData('gettotaldeclinepercent', { accountId: accountId, leadSource: LEADSOURCE,month:month,year:year }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getTopDeclineReason = createAsyncThunk(
  'dashboard/getTopDeclineReason',
  async ({ accountId, leadSource, token, month,year }, { rejectWithValue }) => {
    const data = await fetchData('gettopdeclinereason', { accountId: accountId, leadSource: LEADSOURCE,month:month,year:year }, token)
      .catch(rejectWithValue);
    return data?.data || [];
  }
);

export const getLoanByTypeThisMonth = createAsyncThunk(
  'dashboard/getLoanByTypeThisMonth',
  async ({ accountId, token , month,year}, { rejectWithValue }) => {
    try {
      const data = await fetchData(
        'getloanbytype',
        { accountId, leadSource: LEADSOURCE,month:month,year:year },
        token
      );
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getLoanByTypeAllTime = createAsyncThunk(
  'dashboard/getLoanByTypeAllTime',
  async ({ accountId, token , month,year}, { rejectWithValue }) => {
    try {
      const data = await fetchData(
        'getloanbytypealltime',
        { accountId, leadSource: LEADSOURCE ,month:month,year:year},
        token
      );
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCashCollectedThisMonth = createAsyncThunk(
  'dashboard/getCashCollectedThisMonth',
  async ({ accountId, token , month,year}, { rejectWithValue }) => {
    try {
      const data = await fetchData(
        'getcashcollectedamount',
        { accountId, leadSource: LEADSOURCE,month:month,year:year },
        token
      );
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCashCollectedAllTime = createAsyncThunk(
  'dashboard/getCashCollectedAllTime',
  async ({ accountId, token , month,year}, { rejectWithValue }) => {
    try {
      const data = await fetchData(
        'getcashcollectedamountalltime',
        { accountId, leadSource: LEADSOURCE,month:month,year:year },
        token
      );
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getFundedData = createAsyncThunk(
  'dashboard/getFundedData',
  async ({ accountId, token , month,year}, { rejectWithValue }) => {
    try {
      const data = await fetchData(
        'getfundeddata', 
        { accountId, leadSource: LEADSOURCE,month:month,year:year }, 
        token
      );
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getFundedData2 = createAsyncThunk(
  'dashboard/getFundedData2',
  async ({ accountId, token }, { rejectWithValue }) => {
    try {
      const data = await fetchData2(
        'getfundeddata', 
        { accountId, leadSource: LEADSOURCE}, 
        token
      );
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getFundedLastMonthData = createAsyncThunk(
  'dashboard/getFundedLastMonthData',
  async ({ accountId, token , month,year}, { rejectWithValue }) => {
    try {
      const data = await fetchData(
        'getfundeddata', 
        { accountId, leadSource: LEADSOURCE,month:month,year:year }, 
        token
      );
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getFundedDataThisYear = createAsyncThunk(
  'dashboard/getFundedDataThisYear',
  async ({ accountId, token, month, year }, { rejectWithValue }) => {
    try {
      const data = await fetchData3(
        'getfundeddatathisyear', // Assuming this is the Salesforce endpoint name
        { accountId, leadSource: LEADSOURCE, month: month, year: year },
        token
      );
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCashCollectedLastMonth = createAsyncThunk(
  'dashboard/getCashCollectedLastMonth',
  async ({ accountId, token , month,year}, { rejectWithValue }) => {
    try {
      const data = await fetchData(
        'getcashcollectedamountlastmonth', // Assumed endpoint based on pattern
        { accountId, leadSource: LEADSOURCE,month:month,year:year },
        token
      );
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const transformLeadData = (data) => {
  return data.map(item => {
    const updatedItem = { ...item };
    // //console.log(updatedItem,'updatedItem')

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
    loanByTypeThisMonth: [],
  loanByTypeAllTime: [],
  cashCollectedThisMonth: [],
  cashCollectedLastMonth: [],
  cashCollectedAllTime: [],
  fundedData: [],
  fundedData2: [],
  fundedLastMonthData: [],
  fundedDataThisYear: [],
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
        state.totalApplicationsThisMonth = action.payload;
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
        state.approvedApplicationsThisMonth = action.payload;
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
        state.preApprovedApplicationsThisMonth = action.payload;
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
        state.declinedApplicationsThisMonth =action.payload;
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
        state.totalApplications = action.payload;
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
        state.totalApproved = action.payload;
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
        state.totalDeclined = action.payload;
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
        state.totalPreApproved = action.payload;
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
        state.totalDeclinePercent = action.payload;
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
        state.topDeclineReason = action.payload;
      })
      .addCase(getTopDeclineReason.rejected, (state, action) => {
        state.status = 'failed';
        //console.log(action.error.message,'action.error.message')
        state.error = action.payload || action.error.message;
      })
      // Loan By Type – This Month
.addCase(getLoanByTypeThisMonth.pending, (state) => {
  state.status = 'loading';
})
.addCase(getLoanByTypeThisMonth.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.loanByTypeThisMonth = action.payload;
})
.addCase(getLoanByTypeThisMonth.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.payload || action.error.message;
})

// Loan By Type – All Time
.addCase(getLoanByTypeAllTime.pending, (state) => {
  state.status = 'loading';
})
.addCase(getLoanByTypeAllTime.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.loanByTypeAllTime = action.payload;
})
.addCase(getLoanByTypeAllTime.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.payload || action.error.message;
})

// Cash Collected – This Month
.addCase(getCashCollectedThisMonth.pending, (state) => {
  state.status = 'loading';
})
.addCase(getCashCollectedThisMonth.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.cashCollectedThisMonth = action.payload;
})
.addCase(getCashCollectedThisMonth.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.payload || action.error.message;
})

.addCase(getCashCollectedLastMonth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCashCollectedLastMonth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cashCollectedLastMonth = action.payload;
      })
      .addCase(getCashCollectedLastMonth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

// Cash Collected – All Time
.addCase(getCashCollectedAllTime.pending, (state) => {
  state.status = 'loading';
})
.addCase(getCashCollectedAllTime.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.cashCollectedAllTime = action.payload;
})
.addCase(getCashCollectedAllTime.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.payload || action.error.message;
})

// Funded Data
.addCase(getFundedData.pending, (state) => {
  state.status = 'loading';
})
.addCase(getFundedData.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.fundedData = action.payload;
})
.addCase(getFundedData.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.payload || action.error.message;
})
// Funded Data2
.addCase(getFundedData2.pending, (state) => {
  state.status = 'loading';
})
.addCase(getFundedData2.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.fundedData2 = action.payload;
})
.addCase(getFundedData2.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.payload || action.error.message;
})

// Funded Data (Last Month)
.addCase(getFundedLastMonthData.pending, (state) => {
  // We use a different status property if you don't want to 
  // trigger the main screen loader
  state.lastMonthStatus = 'loading'; 
})
.addCase(getFundedLastMonthData.fulfilled, (state, action) => {
  state.lastMonthStatus = 'succeeded';
  state.fundedLastMonthData = action.payload; // Store in a separate array
})
.addCase(getFundedLastMonthData.rejected, (state, action) => {
  state.lastMonthStatus = 'failed';
  state.lastMonthError = action.payload || action.error.message;
})
// Funded Data (This Year)
.addCase(getFundedDataThisYear.pending, (state) => {
  state.status = 'loading';
})
.addCase(getFundedDataThisYear.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.fundedDataThisYear = action.payload;
})
.addCase(getFundedDataThisYear.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.payload || action.error.message;
})

  },
});

export default dashboardSlice.reducer;
