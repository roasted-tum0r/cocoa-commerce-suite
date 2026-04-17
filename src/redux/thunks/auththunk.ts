import axiosInstance from "@/interceptors/apiInterceptor";
import { API_ENDPOINTS } from "@/utility/endpoints";
import { setAccessToken } from "@/utility/token";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.AUTH.REGISTER,
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.AUTH.LOGIN,
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        payload
      );
      setAccessToken(response.data.accesstoken);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch User Details
export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AUTH.USER_DETAILS);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Auth User
export const updateAuthUser = createAsyncThunk(
  "auth/updateAuthUser",
  async ({ id, payload }: { id: string, payload: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(API_ENDPOINTS.AUTH.UPDATE_USER(id), payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
