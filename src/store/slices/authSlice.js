// src/store/slices/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const corsProxy = 'https://cors-anywhere.herokuapp.com/';
/* =============================
   ENV VARIABLES
=============================== */
const BASE_URL = import.meta.env.VITE_API_URL;
const TOKEN_URL = import.meta.env.VITE_API_TOKEN_URL;
const CLIENT_ID = import.meta.env.VITE_SF_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SF_CLIENT_SECRET;
const REGISTRATION_CODE = "001cY00000JXauEQAT";
// const REGISTRATION_CODE = import.meta.env.VITE_REGISTRATION_CODE;
/* =============================
   GLOBAL TOAST HANDLERS
=============================== */
const showSuccess = (msg) => toast.success(msg);
const showError = (msg) => toast.error(msg);

const handleError = (error) => {
  // Detect CORS / Network Errors FIRST
  if (
    error.message === "Network Error" ||
    error?.code === "ERR_NETWORK" ||
    error?.response === undefined
  ) {
    // showError("CORS Error: Salesforce blocked the request. Use backend proxy.");
    showError(
      "We’re having trouble connecting to Salesforce. Please try again in a moment."
    );
    return;
  }
  const status = error?.response?.status;

  switch (status) {
    case 400:
      showError("400 - Bad Request: Invalid or incomplete data.");
      break;

    // case 401:{
    //   showError("401 - Bad Request: Invalid or incomplete data.");
    //   localStorage.clear()
    //   break;
    // }


    case 404:
      showError("404 - API endpoint not found.");
      break;

    case 405:
      showError("405 - Method not allowed. Use POST.");
      break;

    case 500:
      showError("500 - Internal Server Error.");
      break;

    default:
      showError(error?.response?.data?.message || "Unexpected error occurred");
  }
};

/* =========================================================
   1. GET SALESFORCE ACCESS TOKEN
========================================================= */
export const getSalesforceToken = createAsyncThunk(
  "auth/getSalesforceToken",
  async (_, { rejectWithValue }) => {
    try {
      // const response = await axios.get(
      //   // `https://salesforcetoken1-cvs3z1jef-nirsubhas-projects.vercel.app/api/token`,
      //   `http://localhost:3000/api/token`,
      //   // `${TOKEN_URL}/api/token`,
      //   null,
      //   // {
      //   //   params: {
      //   //     grant_type: "client_credentials",
      //   //     client_id: CLIENT_ID,
      //   //     client_secret: CLIENT_SECRET,
      //   //   },
      //   // }
      // );

      const response = await axios.post(`${TOKEN_URL}/api/token`, {
        SF_INSTANCE: BASE_URL,
        CLIENT_ID: CLIENT_ID,
        CLIENT_SECRET: CLIENT_SECRET,
      });


      return response.data; // { access_token }
    } catch (error) {
      handleError(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* =========================================================
   2. REGISTER USER
========================================================= */
// Helper function for side effects (e.g., register)
const register2 = (key) => {
  // Example logic for the register action (side effect)
  console.log("Registering with key:", key);
  // Perform any side effects (like calling an API) here
};
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email, password, accountId, token }, { getState, rejectWithValue }) => {
    try {
      // const token = getState().auth.salesforceToken;
      register2("some_key_here");
      const response = await axios.post(
        `${BASE_URL}/services/apexrest/salesforce/portal/auth`,
        { action: "register", email, password, accountId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data.success && response.data.message) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      handleError(error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* =========================================================
   3. LOGIN USER
========================================================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.salesforceToken;

      const response = await axios.post(
        `${BASE_URL}/services/apexrest/salesforce/portal/auth`,
        { action: "login", email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // 🔥 If Salesforce returns success=false → treat as error
      if (!response.data.success && response.data.message) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      handleError(error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* =========================================================
   4. CHANGE PASSWORD
========================================================= */
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ email, oldPassword, newPassword }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.salesforceToken;

      const response = await axios.post(
        `${BASE_URL}/services/apexrest/salesforce/portal/auth`,
        { action: "changePassword", email, oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data.success && response.data.message) {
        return rejectWithValue(response.data.message);
      }

      return response.data;
    } catch (error) {
      handleError(error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/* =========================================================
   5. FORGOT PASSWORD
========================================================= */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, {getState, rejectWithValue }) => {
    try {
      const token = getState().auth.salesforceToken;
      const response = await axios.post(
        `${BASE_URL}/services/apexrest/salesforce/portal/auth`,
        {
          action: "forgotpassword",
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      debugger
      return response.data;
    } catch (error) {
      handleError(error);
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
/* =========================================================
   6. RESET PASSWORD
========================================================= */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, token, newPassword }, { getState,rejectWithValue }) => {
    try {
      const tokenG = getState().auth.salesforceToken;
      const response = await axios.post(
        `${BASE_URL}/services/apexrest/salesforce/portal/auth`,
        {
          action: "resetpassword",
          email,
          token,
          newpassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenG}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success && response.data.message) {
        return rejectWithValue(response.data.message);
      }

      return response.data;
    } catch (error) {
      handleError(error);
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


/* =========================================================
   SLICE
========================================================= */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    salesforceToken: null,
    portalUserId: null,
    status: "idle",
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.salesforceToken = null;
      state.portalUserId = null;
      state.status = 'idle';  // Reset status if needed
      showSuccess("Logged out successfully");
    },
  },

  extraReducers: (builder) => {
    /* ---- Salesforce Token ---- */
    builder
      .addCase(getSalesforceToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSalesforceToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.salesforceToken = action.payload.access_token;
        showSuccess("Connected to Salesforce");
      })
      .addCase(getSalesforceToken.rejected, (state, action) => {
        state.status = "failed";
        console.log('tokennnn----')
        state.error = action.payload;
      });

    /* ---- Register ---- */
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        showSuccess("Registration Successful");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ---- Login ---- */
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action.payload, 'action.payload');
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.portalUserId = action.payload.portalUserId;
        showSuccess("Login Successful");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ---- Change Password ---- */
    builder
      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = "succeeded";
        showSuccess("Password Changed Successfully");
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ---- Forgot Password ---- */
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        showSuccess(action.payload.message);
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ---- Reset Password ---- */
    builder
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        showSuccess(action.payload.message || "Password reset successful");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
